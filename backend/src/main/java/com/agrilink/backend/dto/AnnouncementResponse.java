package com.agrilink.backend.dto;

import java.time.LocalDateTime;

public record AnnouncementResponse(
        Long id,
        String message,
        String recipient,
        String senderName,
        LocalDateTime createdAt
) {}