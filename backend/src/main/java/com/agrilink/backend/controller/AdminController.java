package com.agrilink.backend.controller;

import com.agrilink.backend.dto.AdminStatsResponse;
import com.agrilink.backend.dto.AnnouncementRequest;
import com.agrilink.backend.model.*;
import com.agrilink.backend.repository.AnnouncementRepository;
import com.agrilink.backend.repository.OfferRepository;
import com.agrilink.backend.repository.UserRepository;
import com.agrilink.backend.service.AuthService;
import jakarta.validation.Valid;
import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.server.ResponseStatusException;

import java.util.List;
import java.util.Locale;
import java.util.Map;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/api/admin")
public class AdminController {

    private final AuthService authService;
    private final UserRepository userRepository;
    private final OfferRepository offerRepository;
    private final AnnouncementRepository announcementRepository;

    public AdminController(
            AuthService authService,
            UserRepository userRepository,
            OfferRepository offerRepository,
            AnnouncementRepository announcementRepository
    ) {
        this.authService = authService;
        this.userRepository = userRepository;
        this.offerRepository = offerRepository;
        this.announcementRepository = announcementRepository;
    }

    @GetMapping("/stats")
    public AdminStatsResponse stats(@RequestHeader("Authorization") String auth) {
        requireAdmin(auth);

        var offers = offerRepository.findAll();
        long totalSales = offers.stream()
                .filter(o -> o.getStatus() == OfferStatus.COMPLETED)
                .mapToLong(o -> Math.round(o.getListing().getPricePerKg().doubleValue() * o.getListing().getQuantityKg().doubleValue()))
                .sum();

        long farmers = userRepository.findAll().stream().filter(u -> u.getRole() == UserRole.FARMER).count();
        long aggregators = userRepository.findAll().stream().filter(u -> u.getRole() == UserRole.AGGREGATOR).count();

        List<AdminStatsResponse.SalesPoint> salesByMonth = offers.stream()
                .filter(o -> o.getStatus() == OfferStatus.COMPLETED && o.getCompletedAt() != null)
                .collect(Collectors.groupingBy(o -> o.getCompletedAt().getMonth().name().substring(0, 3),
                        Collectors.summingLong(o -> Math.round(o.getListing().getPricePerKg().doubleValue() * o.getListing().getQuantityKg().doubleValue()))))
                .entrySet().stream()
                .map(e -> new AdminStatsResponse.SalesPoint(e.getKey(), e.getValue()))
                .toList();

        Map<String, Long> salesByProductMap = offers.stream()
                .filter(o -> o.getStatus() == OfferStatus.COMPLETED)
                .collect(Collectors.groupingBy(o -> o.getListing().getProductName(),
                        Collectors.summingLong(o -> Math.round(o.getListing().getPricePerKg().doubleValue() * o.getListing().getQuantityKg().doubleValue()))));

        List<AdminStatsResponse.ProductSalesPoint> salesByProduct = salesByProductMap.entrySet().stream()
                .map(e -> new AdminStatsResponse.ProductSalesPoint(e.getKey(), e.getValue()))
                .toList();

        return new AdminStatsResponse(totalSales, farmers, aggregators, salesByMonth, salesByProduct);
    }

    @PostMapping("/announcements")
    public String sendAnnouncement(@RequestHeader("Authorization") String auth, @Valid @RequestBody AnnouncementRequest request) {
        User admin = requireAdmin(auth);

        Announcement announcement = new Announcement();
        announcement.setSender(admin);
        announcement.setMessage(request.message());
        announcement.setRecipientGroup(RecipientGroup.valueOf(request.recipient().toUpperCase(Locale.ROOT)));
        announcementRepository.save(announcement);
        return "Announcement saved";
    }

    private User requireAdmin(String auth) {
        User user = authService.requireUserFromToken(auth);
        if (user.getRole() != UserRole.ADMIN) {
            throw new ResponseStatusException(HttpStatus.FORBIDDEN, "Only admin can access this endpoint");
        }
        return user;
    }
}
