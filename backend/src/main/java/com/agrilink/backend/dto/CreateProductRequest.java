package com.agrilink.backend.dto;

import jakarta.validation.constraints.DecimalMin;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;

import java.math.BigDecimal;

public record CreateProductRequest(
        @NotBlank String productName,
        @NotNull @DecimalMin("0.1") BigDecimal quantity,
        @NotNull @DecimalMin("0.1") BigDecimal price,
        @NotBlank String location
) {
}
