package com.agrilink.backend.dto;

public record OfferDto(
        Long id,
        Long listingId,
        String farmerName,
        String productName,
        double quantity,
        double price,
        String location,
        String status
) {
}
