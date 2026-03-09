package com.agrilink.backend.controller;

import com.agrilink.backend.dto.CreateProductRequest;
import com.agrilink.backend.dto.PredictionRequest;
import com.agrilink.backend.dto.PredictionResponse;
import com.agrilink.backend.dto.ProductDto;
import com.agrilink.backend.model.PricePrediction;
import com.agrilink.backend.model.ProductListing;
import com.agrilink.backend.model.User;
import com.agrilink.backend.model.UserRole;
import com.agrilink.backend.repository.PricePredictionRepository;
import com.agrilink.backend.repository.ProductListingRepository;
import com.agrilink.backend.service.AuthService;
import com.agrilink.backend.service.MappingService;
import com.agrilink.backend.service.PredictionService;
import jakarta.validation.Valid;
import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.server.ResponseStatusException;

import java.util.List;

@RestController
@RequestMapping("/api/farmer")
public class FarmerController {

    private final AuthService authService;
    private final ProductListingRepository productListingRepository;
    private final PredictionService predictionService;
    private final PricePredictionRepository pricePredictionRepository;

    public FarmerController(
            AuthService authService,
            ProductListingRepository productListingRepository,
            PredictionService predictionService,
            PricePredictionRepository pricePredictionRepository
    ) {
        this.authService = authService;
        this.productListingRepository = productListingRepository;
        this.predictionService = predictionService;
        this.pricePredictionRepository = pricePredictionRepository;
    }

    @GetMapping("/products")
    public List<ProductDto> myProducts(@RequestHeader("Authorization") String auth) {
        User user = requireFarmer(auth);
        return productListingRepository.findByFarmerOrderByCreatedAtDesc(user)
                .stream()
                .map(MappingService::toProductDto)
                .toList();
    }

    @PostMapping("/products")
    public ProductDto createProduct(@RequestHeader("Authorization") String auth, @Valid @RequestBody CreateProductRequest request) {
        User user = requireFarmer(auth);
        ProductListing listing = new ProductListing();
        listing.setFarmer(user);
        listing.setProductName(request.productName());
        listing.setQuantityKg(request.quantity());
        listing.setPricePerKg(request.price());
        listing.setLocation(request.location());
        return MappingService.toProductDto(productListingRepository.save(listing));
    }

    @PostMapping("/predict")
    public PredictionResponse predict(@RequestHeader("Authorization") String auth, @Valid @RequestBody PredictionRequest request) {
        User user = requireFarmer(auth);
        PredictionResponse response = predictionService.predict(request);

        PricePrediction prediction = new PricePrediction();
        prediction.setRequestedBy(user);
        prediction.setCropName(request.cropName());
        prediction.setDistrict(request.district());
        prediction.setPredictedPricePerKg(java.math.BigDecimal.valueOf(response.predictedPricePerKg()));
        prediction.setConfidence(java.math.BigDecimal.valueOf(response.confidence()));
        prediction.setModelSource(response.modelSource());
        pricePredictionRepository.save(prediction);

        return response;
    }

    private User requireFarmer(String auth) {
        User user = authService.requireUserFromToken(auth);
        if (user.getRole() != UserRole.FARMER) {
            throw new ResponseStatusException(HttpStatus.FORBIDDEN, "Only farmers can access this endpoint");
        }
        return user;
    }
}
