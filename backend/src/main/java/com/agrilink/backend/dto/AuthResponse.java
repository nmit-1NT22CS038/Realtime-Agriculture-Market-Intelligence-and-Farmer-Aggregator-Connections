package com.agrilink.backend.dto;

public record AuthResponse(
        String token,
        UserDto user
) {
}
