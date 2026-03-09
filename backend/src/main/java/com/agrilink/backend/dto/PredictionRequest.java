package com.agrilink.backend.dto;

import jakarta.validation.constraints.DecimalMin;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;

public record PredictionRequest(
        @NotBlank String cropName,
        @NotBlank String district,
        @NotNull @DecimalMin("0.1") Double quantityKg
) {
}
