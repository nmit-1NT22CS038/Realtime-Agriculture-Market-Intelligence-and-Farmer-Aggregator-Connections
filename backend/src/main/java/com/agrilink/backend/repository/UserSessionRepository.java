package com.agrilink.backend.repository;

import com.agrilink.backend.model.UserSession;
import org.springframework.data.jpa.repository.JpaRepository;

import java.time.LocalDateTime;
import java.util.Optional;

public interface UserSessionRepository extends JpaRepository<UserSession, Long> {
    
    Optional<UserSession> findByToken(String token);
    void deleteByExpiresAtBefore(LocalDateTime now);
}
