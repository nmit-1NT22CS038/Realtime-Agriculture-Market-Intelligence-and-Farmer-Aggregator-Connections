package com.agrilink.backend.dto;

import jakarta.validation.constraints.NotBlank;

public record VerifyOtpRequest(@NotBlank String otp) {
}
