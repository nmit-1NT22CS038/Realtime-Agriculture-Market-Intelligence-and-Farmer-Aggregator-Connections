package com.agrilink.backend.repository;

import com.agrilink.backend.model.ListingStatus;
import com.agrilink.backend.model.ProductListing;
import com.agrilink.backend.model.User;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface ProductListingRepository extends JpaRepository<ProductListing, Long> {
    List<ProductListing> findByFarmerOrderByCreatedAtDesc(User farmer);
    List<ProductListing> findByStatusOrderByCreatedAtDesc(ListingStatus status);
}
