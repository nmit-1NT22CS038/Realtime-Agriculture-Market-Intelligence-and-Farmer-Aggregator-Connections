package com.agrilink.backend.repository;

import com.agrilink.backend.model.Offer;
import com.agrilink.backend.model.ProductListing;
import com.agrilink.backend.model.User;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.Optional;

public interface OfferRepository extends JpaRepository<Offer, Long> {
    List<Offer> findByAggregatorOrderByCreatedAtDesc(User aggregator);
    Optional<Offer> findByListing(ProductListing listing);
}
