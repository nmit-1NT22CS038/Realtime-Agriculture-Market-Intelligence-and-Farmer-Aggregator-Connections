package com.agrilink.backend.dto;

public record PredictionResponse(
        double predictedPricePerKg,
        double confidence,
        String modelSource
) {
}
