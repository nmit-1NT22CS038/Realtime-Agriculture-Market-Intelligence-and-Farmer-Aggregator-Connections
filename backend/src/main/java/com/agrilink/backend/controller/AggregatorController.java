package com.agrilink.backend.controller;

// import com.agrilink.backend.dto.AcceptOfferResponse;
import com.agrilink.backend.dto.BidRequest;
import com.agrilink.backend.dto.OfferDto;
import com.agrilink.backend.dto.VerifyOtpRequest;
import com.agrilink.backend.model.*;
import com.agrilink.backend.repository.OfferRepository;
import com.agrilink.backend.repository.ProductListingRepository;
import com.agrilink.backend.service.AuthService;
import com.agrilink.backend.service.MappingService;
import jakarta.validation.Valid;
import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.server.ResponseStatusException;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Objects;

@RestController
@RequestMapping("/api/aggregator")
public class AggregatorController {

    private final AuthService authService;
    private final ProductListingRepository productListingRepository;
    private final OfferRepository offerRepository;

    public AggregatorController(
            AuthService authService,
            ProductListingRepository productListingRepository,
            OfferRepository offerRepository
    ) {
        this.authService = authService;
        this.productListingRepository = productListingRepository;
        this.offerRepository = offerRepository;
    }

    @GetMapping("/offers/available")
    public List<OfferDto> availableOffers(@RequestHeader("Authorization") String auth) {
        requireAggregator(auth);
        return productListingRepository.findByStatusOrderByCreatedAtDesc(ListingStatus.OPEN)
                .stream()
                .map(listing -> new OfferDto(
                        listing.getId(),
                        listing.getId(),
                        listing.getFarmer().getName(),
                null,
                null,
                null,
                        listing.getProductName(),
                        listing.getQuantityKg().doubleValue(),
                        listing.getPricePerKg().doubleValue(),
                null,
                        listing.getLocation(),
                        "pending"
                ))
                .toList();
    }

        @PostMapping("/offers/{listingId}/bid")
        public OfferDto placeBid(
            @RequestHeader("Authorization") String auth,
            @PathVariable Long listingId,
            @Valid @RequestBody BidRequest request
        ) {
        User user = requireAggregator(auth);
        ProductListing listing = productListingRepository.findById(Objects.requireNonNull(listingId))
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Listing not found"));

        if (listing.getStatus() != ListingStatus.OPEN) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Bidding is closed for this listing");
        }

        Offer offer = offerRepository.findByListingAndAggregator(listing, user).orElseGet(Offer::new);
        offer.setListing(listing);
        offer.setAggregator(user);
        offer.setBidPricePerKg(request.bidPrice());
        offer.setStatus(OfferStatus.BID_PLACED);
        offer.setOtpCode("000000");

        Offer saved = offerRepository.save(offer);
        return MappingService.toOfferDto(saved);
    }

    @GetMapping("/offers/my")
    public List<OfferDto> myOffers(@RequestHeader("Authorization") String auth) {
        User user = requireAggregator(auth);
        return offerRepository.findByAggregatorOrderByCreatedAtDesc(user)
                .stream()
                .map(MappingService::toOfferDto)
                .toList();
    }

    @PostMapping("/offers/{offerId}/verify")
    public OfferDto verifyOtp(
            @RequestHeader("Authorization") String auth,
            @PathVariable Long offerId,
            @Valid @RequestBody VerifyOtpRequest request
    ) {
        User user = requireAggregator(auth);
        Offer offer = offerRepository.findById(Objects.requireNonNull(offerId))
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Offer not found"));

        if (!offer.getAggregator().getId().equals(user.getId())) {
            throw new ResponseStatusException(HttpStatus.FORBIDDEN, "You cannot verify this offer");
        }

        if (offer.getStatus() != OfferStatus.SELECTED) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Farmer has not selected this bid yet");
        }

        if (!offer.getOtpCode().equals(request.otp())) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Invalid OTP");
        }

        offer.setStatus(OfferStatus.COMPLETED);
        offer.setCompletedAt(LocalDateTime.now());
        ProductListing listing = offer.getListing();
        listing.setStatus(ListingStatus.COMPLETED);
        productListingRepository.save(listing);

        return MappingService.toOfferDto(offerRepository.save(offer));
    }

    private User requireAggregator(String auth) {
        User user = authService.requireUserFromToken(auth);
        if (user.getRole() != UserRole.AGGREGATOR) {
            throw new ResponseStatusException(HttpStatus.FORBIDDEN, "Only aggregators can access this endpoint");
        }
        return user;
    }
}
