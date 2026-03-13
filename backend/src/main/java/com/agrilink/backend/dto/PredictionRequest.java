package com.agrilink.backend.dto;

public record PredictionRequest(
    String district,
    String market,
    String commodity,
    String variety,
    String season,
    int year,
    int month
) {}