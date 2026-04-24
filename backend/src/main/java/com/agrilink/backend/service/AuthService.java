package com.agrilink.backend.service;
import org.springframework.transaction.annotation.Transactional;

import com.agrilink.backend.dto.AuthRequest;
import com.agrilink.backend.dto.AuthResponse;
import com.agrilink.backend.dto.SignupRequest;
import com.agrilink.backend.dto.UserDto;
import com.agrilink.backend.model.User;
import com.agrilink.backend.model.UserRole;
import com.agrilink.backend.model.UserSession;
import com.agrilink.backend.repository.UserRepository;
import com.agrilink.backend.repository.UserSessionRepository;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.HttpStatus;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.web.server.ResponseStatusException;

import java.time.LocalDateTime;
import java.util.Locale;
import java.util.UUID;

@Service
public class AuthService {

    private final UserRepository userRepository;
    private final UserSessionRepository userSessionRepository;
    private final BCryptPasswordEncoder encoder = new BCryptPasswordEncoder();

    @Value("${app.auth.session-hours}")
    private long sessionHours;

    public AuthService(UserRepository userRepository, UserSessionRepository userSessionRepository) {
        this.userRepository = userRepository;
        this.userSessionRepository = userSessionRepository;
    }

    public AuthResponse signup(SignupRequest request) {
        userRepository.findByEmail(request.email().toLowerCase(Locale.ROOT))
                .ifPresent(u -> {
                    throw new ResponseStatusException(HttpStatus.CONFLICT, "Email already exists");
                });

        User user = new User();
        user.setName(request.name());
        user.setEmail(request.email().toLowerCase(Locale.ROOT));
        user.setPasswordHash(encoder.encode(request.password()));
        user.setRole(UserRole.valueOf(request.role().toUpperCase(Locale.ROOT)));

        User saved = userRepository.save(user);
        return createSession(saved);
    }

    public AuthResponse login(AuthRequest request) {
        User user = userRepository.findByEmail(request.email().toLowerCase(Locale.ROOT))
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.UNAUTHORIZED, "Invalid credentials"));

        if (!encoder.matches(request.password(), user.getPasswordHash())) {
            throw new ResponseStatusException(HttpStatus.UNAUTHORIZED, "Invalid credentials");
        }

        return createSession(user);
    }

    @Transactional
    public User requireUserFromToken(String authHeader) {
        String token = extractBearerToken(authHeader);
        userSessionRepository.deleteByExpiresAtBefore(LocalDateTime.now());

        UserSession session = userSessionRepository.findByToken(token)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.UNAUTHORIZED, "Invalid session"));

        if (session.getExpiresAt().isBefore(LocalDateTime.now())) {
            throw new ResponseStatusException(HttpStatus.UNAUTHORIZED, "Session expired");
        }

        return session.getUser();
    }

    public static UserDto toUserDto(User user) {
        return new UserDto(user.getId(), user.getName(), user.getEmail(), user.getRole().name().toLowerCase(Locale.ROOT));
    }
    

    private AuthResponse createSession(User user) {
        UserSession session = new UserSession();
        session.setToken(UUID.randomUUID().toString());
        session.setUser(user);
        session.setExpiresAt(LocalDateTime.now().plusHours(sessionHours));
        userSessionRepository.save(session);
        return new AuthResponse(session.getToken(), toUserDto(user));
    }

    private String extractBearerToken(String header) {
        if (header == null || !header.startsWith("Bearer ")) {
            throw new ResponseStatusException(HttpStatus.UNAUTHORIZED, "Missing bearer token");
        }
        return header.substring(7);
    }
}
