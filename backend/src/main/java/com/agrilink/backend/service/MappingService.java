package com.agrilink.backend.service;

import com.agrilink.backend.dto.OfferDto;
import com.agrilink.backend.dto.ProductDto;
import com.agrilink.backend.model.Offer;
import com.agrilink.backend.model.ProductListing;

public class MappingService {

    private MappingService() {
    }

    public static ProductDto toProductDto(ProductListing listing) {
        return new ProductDto(
                listing.getId(),
                listing.getFarmer().getName(),
                listing.getFarmer().getId(),
                listing.getProductName(),
                listing.getQuantityKg().doubleValue(),
                listing.getPricePerKg().doubleValue(),
                listing.getLocation(),
                listing.getStatus().name().toLowerCase()
        );
    }

    public static OfferDto toOfferDto(Offer offer) {
        ProductListing listing = offer.getListing();
        return new OfferDto(
                offer.getId(),
                listing.getId(),
                listing.getFarmer().getName(),
                listing.getFarmer().getEmail(),
                offer.getAggregator().getName(),
                offer.getAggregator().getEmail(),
                listing.getProductName(),
                listing.getQuantityKg().doubleValue(),
                listing.getPricePerKg().doubleValue(),
                offer.getBidPricePerKg().doubleValue(),
                listing.getLocation(),
                offer.getStatus().name().toLowerCase()
        );
    }
}
