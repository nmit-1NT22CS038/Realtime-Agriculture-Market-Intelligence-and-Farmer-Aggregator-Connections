package com.agrilink.backend.dto;

public record OfferDto(
        Long id,
        Long listingId,
        String farmerName,
        String farmerEmail,
        String aggregatorName,
        String aggregatorEmail,
        String productName,
        double quantityKg,
        double pricePerKg,
        Double bidPrice,
        String location,
        String status
) {
}
