package com.agrilink.backend.dto;

import jakarta.validation.constraints.NotBlank;

public record AnnouncementRequest(
        @NotBlank String recipient,
        @NotBlank String message
) {
}
