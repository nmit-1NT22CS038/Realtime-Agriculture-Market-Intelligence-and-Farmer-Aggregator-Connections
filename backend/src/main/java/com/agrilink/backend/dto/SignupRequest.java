package com.agrilink.backend.dto;

import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;

public record SignupRequest(
        @NotBlank String name,
        @Email @NotBlank String email,
        @NotBlank @Size(min = 6) String password,
        @NotBlank String role
) {
}
