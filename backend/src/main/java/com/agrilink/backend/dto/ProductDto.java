package com.agrilink.backend.dto;

public record ProductDto(
        Long id,
        String farmerName,
        Long farmerId,
        String name,
        double quantity,
        double price,
        String location,
        String status
) {
}
