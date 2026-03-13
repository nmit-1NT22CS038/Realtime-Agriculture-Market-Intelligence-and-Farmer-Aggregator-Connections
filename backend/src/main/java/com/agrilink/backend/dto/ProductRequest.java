package com.agrilink.backend.dto;

public record ProductRequest(
    String productName,
    double quantityKg,
    double pricePerKg,
    String location
) {}