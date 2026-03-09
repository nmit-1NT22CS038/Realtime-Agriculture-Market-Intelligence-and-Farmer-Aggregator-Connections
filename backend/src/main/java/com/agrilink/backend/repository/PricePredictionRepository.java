package com.agrilink.backend.repository;

import com.agrilink.backend.model.PricePrediction;
import org.springframework.data.jpa.repository.JpaRepository;

public interface PricePredictionRepository extends JpaRepository<PricePrediction, Long> {
}
