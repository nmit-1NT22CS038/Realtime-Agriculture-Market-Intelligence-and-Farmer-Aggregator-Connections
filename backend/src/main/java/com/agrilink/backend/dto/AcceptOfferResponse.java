package com.agrilink.backend.dto;

public record AcceptOfferResponse(
        OfferDto offer,
        String otpForTesting
) {
}
