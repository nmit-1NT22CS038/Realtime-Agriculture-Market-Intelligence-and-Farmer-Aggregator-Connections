package com.agrilink.backend.repository;


import com.agrilink.backend.model.ProductListing;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface ProductRepository extends JpaRepository<ProductListing, Long> {
    List<ProductListing> findByFarmerId(Long farmerId);
    List<ProductListing> findByStatus(String status);
}