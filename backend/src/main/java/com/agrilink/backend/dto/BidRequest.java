package com.agrilink.backend.dto;

import jakarta.validation.constraints.DecimalMin;
import jakarta.validation.constraints.NotNull;

import java.math.BigDecimal;

public record BidRequest(
        @NotNull @DecimalMin("0.1") BigDecimal bidPrice
) {
}
