package com.agrilink.backend.controller;

import com.agrilink.backend.dto.OfferDto;
import com.agrilink.backend.dto.PredictionRequest;
import com.agrilink.backend.dto.ProductRequest;
import com.agrilink.backend.model.ListingStatus;
import com.agrilink.backend.model.Offer;
import com.agrilink.backend.model.OfferStatus;
import com.agrilink.backend.model.ProductListing;
import com.agrilink.backend.model.User;
import com.agrilink.backend.model.UserRole;
import com.agrilink.backend.model.UserSession;
import com.agrilink.backend.repository.OfferRepository;
import com.agrilink.backend.repository.ProductRepository;
// import com.agrilink.backend.repository.UserRepository;
import com.agrilink.backend.repository.UserSessionRepository;
import com.agrilink.backend.service.MappingService;
// import com.agrilink.backend.service.AuthService;
import com.agrilink.backend.service.PredictionService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
//crop recommedation imports
import com.agrilink.backend.dto.RecommendationRequest;
import com.agrilink.backend.service.RecommendationService;
import com.agrilink.backend.service.LlmExplanationService;


import java.math.BigDecimal;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/farmer")
@CrossOrigin(origins = "*")
public class FarmerController {

    @Autowired
    private ProductRepository productListingRepository;
    // @Autowired
    // private AuthService authService;    
    @Autowired
    private OfferRepository offerRepository;

    // @Autowired
    // private UserRepository userRepository;
    @Autowired
    private UserSessionRepository userSessionRepository;    
    @Autowired
    private PredictionService predictionService;
    @Autowired
    private RecommendationService recommendationService;
    @Autowired
    private LlmExplanationService llmExplanationService;
    @PostMapping("/listings")
    public ResponseEntity<?> addProduct(@RequestBody ProductRequest request, @RequestHeader("Authorization") String token) {
    String cleanToken = token.startsWith("Bearer ") ? token.substring(7) : token;
    
    // Query UserSession table instead of User table
    UserSession session = userSessionRepository.findByToken(cleanToken).orElse(null);
    if (session == null || session.isExpired()) {
        return ResponseEntity.status(401).body(Map.of("error", "Invalid or expired token"));
    }
    
    User user = session.getUser();
    if (user.getRole() != UserRole.FARMER) {
        return ResponseEntity.status(403).body(Map.of("error", "Only farmers can add listings"));
    }

    ProductListing product = new ProductListing();
    product.setProductName(request.productName());
    product.setQuantityKg(BigDecimal.valueOf(request.quantityKg()));
    product.setPricePerKg(BigDecimal.valueOf(request.pricePerKg()));
    product.setLocation(request.location());
    product.setFarmer(user);
    product.setStatus(ListingStatus.OPEN);

    ProductListing saved = productListingRepository.save(product);
    return ResponseEntity.ok(toFarmerProductResponse(saved));
}

    @GetMapping("/listings")
    public ResponseEntity<?> getMyProducts(@RequestHeader("Authorization") String token) {
    String cleanToken = token.startsWith("Bearer ") ? token.substring(7) : token;
    
    UserSession session = userSessionRepository.findByToken(cleanToken).orElse(null);
    if (session == null || session.isExpired()) {
        return ResponseEntity.status(401).body(Map.of("error", "Invalid or expired token"));
    }
    
    User user = session.getUser();
    List<Map<String, Object>> products = productListingRepository.findByFarmerId(user.getId())
        .stream()
        .map(this::toFarmerProductResponse)
        .toList();

    return ResponseEntity.ok(products);
    }

    @PostMapping("/predict")
    public ResponseEntity<?> predictPrice(@RequestBody PredictionRequest request, @RequestHeader("Authorization") String token) {
        User user = getAuthenticatedFarmer(token);
        if (user == null) {
        return ResponseEntity.status(401).body(Map.of("error", "Unauthorized"));
     }

        try {
            PredictionService.PredictionResult result = predictionService.predict(
                request.district(),
                request.market(),
                request.commodity(),
                request.variety(),
                request.season(),
                request.year(),
                request.month()
            );

            Map<String, Object> response = new HashMap<>();
            response.put("predictedPricePerKg", result.getPrice());
            response.put("confidence", result.getConfidence());
            response.put("modelSource", result.getModel());

            return ResponseEntity.ok(response);
        } catch (Exception e) {
            e.printStackTrace();
            return ResponseEntity.status(500).body(Map.of("error", "Prediction failed: " + e.getMessage()));
        }
    }

    @GetMapping("/bids/{listingId}")
    public ResponseEntity<?> getBidsForListing(@PathVariable Long listingId, @RequestHeader("Authorization") String token) {
    User user = getAuthenticatedFarmer(token);
    if (user == null) {
        return ResponseEntity.status(401).body(Map.of("error", "Unauthorized"));
    }

    List<OfferDto> bids = offerRepository.findByListingIdAndStatus(listingId, OfferStatus.BID_PLACED)
            .stream()
            .map(MappingService::toOfferDto)
            .toList();

    return ResponseEntity.ok(bids);
}

    @PostMapping("/bids/{bidId}/accept")
    public ResponseEntity<?> acceptBid(@PathVariable long bidId, @RequestHeader("Authorization") String token) {
        User user = getAuthenticatedFarmer(token);
        if (user == null) {
            return ResponseEntity.status(401).body(Map.of("error", "Unauthorized"));
        }

        Offer offer = offerRepository.findById(bidId).orElse(null);
        if (offer == null) {
            return ResponseEntity.status(404).body(Map.of("error", "Bid not found"));
        }

        offer.setStatus(OfferStatus.SELECTED);
        String otp = String.format("%06d", (int)(Math.random() * 1000000));
        offer.setOtpCode(otp);
        // offer.setOtp(otp);
        Offer saved = offerRepository.save(offer);

    Map<String, Object> response = new HashMap<>();
    response.put("offer", MappingService.toOfferDto(saved));
    response.put("otpForTesting", otp);
    return ResponseEntity.ok(response);

    }

    @PostMapping("/bids/{bidId}/reject")
public ResponseEntity<?> rejectBid(@PathVariable long bidId, @RequestHeader("Authorization") String token) {
    User user = getAuthenticatedFarmer(token);
    if (user == null) {
        return ResponseEntity.status(401).body(Map.of("error", "Unauthorized"));
    }

    Offer offer = offerRepository.findById(bidId).orElse(null);
    if (offer == null) {
        return ResponseEntity.status(404).body(Map.of("error", "Bid not found"));
    }

    if (!offer.getListing().getFarmer().getId().equals(user.getId())) {
        return ResponseEntity.status(403).body(Map.of("error", "You cannot reject this bid"));
    }

    offer.setStatus(OfferStatus.REJECTED);
    offerRepository.save(offer);
    return ResponseEntity.ok(Map.of("message", "Bid rejected"));
}
    @PostMapping("/recommend")
public ResponseEntity<?> recommendCrops(
        @RequestBody RecommendationRequest request,
        @RequestHeader("Authorization") String token
) {
    User user = getAuthenticatedFarmer(token);
    if (user == null) {
        return ResponseEntity.status(401).body(Map.of("error", "Unauthorized"));
    }

    try {
        Map<String, Object> recommendations = recommendationService.recommend(
                request.district(),
                request.season(),
                request.commodity(),
                request.landSize(),
                null
        );

        String explanation = llmExplanationService.generateExplanation(recommendations);

        Map<String, Object> response = new HashMap<>();
        response.put("recommendations", recommendations);
        response.put("explanation", explanation);
        return ResponseEntity.ok(response);
    } catch (Exception e) {
        return ResponseEntity.status(500).body(Map.of("error", "Recommendation failed: " + e.getMessage()));
    }
}
    private User getAuthenticatedFarmer(String token) {
    String cleanToken = token.startsWith("Bearer ") ? token.substring(7) : token;
    UserSession session = userSessionRepository.findByToken(cleanToken).orElse(null);

    if (session == null || session.isExpired()) {
        return null;
    }

    User user = session.getUser();
    if (user.getRole() != UserRole.FARMER) {
        return null;
    }

    return user;
}

private Map<String, Object> toFarmerProductResponse(ProductListing listing) {
    Map<String, Object> data = new HashMap<>();
    data.put("id", listing.getId());
    data.put("farmerName", listing.getFarmer().getName());
    data.put("farmerId", listing.getFarmer().getId());

    // Keep key name as your frontend currently uses it
    data.put("Productname", listing.getProductName());

    data.put("quantityKg", listing.getQuantityKg().doubleValue());
    data.put("pricePerKg", listing.getPricePerKg().doubleValue());
    data.put("location", listing.getLocation());
    data.put("status", listing.getStatus().name().toLowerCase());
    return data;
}
}