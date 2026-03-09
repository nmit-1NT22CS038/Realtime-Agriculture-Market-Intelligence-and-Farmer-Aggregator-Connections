package com.agrilink.backend.model;

import jakarta.persistence.*;
import lombok.Getter;
import lombok.Setter;

import java.math.BigDecimal;
import java.time.LocalDateTime;

@Entity
@Table(name = "price_predictions")
@Getter
@Setter
public class PricePrediction {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne
    @JoinColumn(name = "requested_by")
    private User requestedBy;

    @Column(nullable = false)
    private String cropName;

    @Column(nullable = false)
    private String district;

    @Column(nullable = false, precision = 12, scale = 2)
    private BigDecimal predictedPricePerKg;

    @Column(nullable = false, precision = 5, scale = 2)
    private BigDecimal confidence;

    @Column(nullable = false)
    private String modelSource;

    @Column(nullable = false)
    private LocalDateTime createdAt = LocalDateTime.now();
}
