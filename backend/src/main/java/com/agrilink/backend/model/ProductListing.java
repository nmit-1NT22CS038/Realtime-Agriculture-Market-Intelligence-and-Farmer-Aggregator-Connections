package com.agrilink.backend.model;

import jakarta.persistence.*;
import java.math.BigDecimal;
import java.time.LocalDateTime;

@Entity
@Table(name = "product_listings")
public class ProductListing {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(optional = false)
    @JoinColumn(name = "farmer_id")
    private User farmer;

    @Column(nullable = false)
    private String productName;

    @Column(name = "quantity_kg",nullable = false, precision = 10, scale = 2)
    private BigDecimal quantityKg;

    @Column(name = "price_per_kg",nullable = false, precision = 10, scale = 2)
    private BigDecimal pricePerKg;

    @Column(nullable = false)
    private String location;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private ListingStatus status = ListingStatus.OPEN;

    @Column(nullable = false)
    private LocalDateTime createdAt = LocalDateTime.now();

    @PrePersist
    protected void onCreate() {
        if (createdAt == null) createdAt = LocalDateTime.now();
    }

    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }

    public User getFarmer() { return farmer; }
    public void setFarmer(User farmer) { this.farmer = farmer; }

    public String getProductName() { return productName; }
    public void setProductName(String productName) { this.productName = productName; }

    public BigDecimal getQuantityKg() { return quantityKg; }
    public void setQuantityKg(BigDecimal quantityKg) { this.quantityKg = quantityKg; }

    public BigDecimal getPricePerKg() { return pricePerKg; }
    public void setPricePerKg(BigDecimal pricePerKg) { this.pricePerKg = pricePerKg; }

    public String getLocation() { return location; }
    public void setLocation(String location) { this.location = location; }

    public ListingStatus getStatus() { return status; }
    public void setStatus(ListingStatus status) { this.status = status; }

    public LocalDateTime getCreatedAt() { return createdAt; }
    public void setCreatedAt(LocalDateTime createdAt) { this.createdAt = createdAt; }

    // Bridge getters for FarmerController legacy calls
    public String getName() { return productName; }
    public void setName(String name) { this.productName = name; }

    public double getQuantity() { return quantityKg != null ? quantityKg.doubleValue() : 0; }
    public void setQuantity(double quantity) { this.quantityKg = BigDecimal.valueOf(quantity); }

    public double getAskingPrice() { return pricePerKg != null ? pricePerKg.doubleValue() : 0; }
    public void setAskingPrice(double price) { this.pricePerKg = BigDecimal.valueOf(price); }
}

// package com.agrilink.backend.model;

// import jakarta.persistence.*;
// import lombok.Getter;
// import lombok.Setter;

// import java.math.BigDecimal;
// import java.time.LocalDateTime;

// @Entity
// @Table(name = "product_listings")
// @Getter
// @Setter
// public class ProductListing {
//     @Id
//     @GeneratedValue(strategy = GenerationType.IDENTITY)
//     private Long id;

//     @ManyToOne(optional = false)
//     @JoinColumn(name = "farmer_id")
//     private User farmer;

//     @Column(nullable = false)
//     private String productName;

//     @Column(nullable = false, precision = 10, scale = 2)
//     private BigDecimal quantityKg;

//     @Column(nullable = false, precision = 10, scale = 2)
//     private BigDecimal pricePerKg;

//     @Column(nullable = false)
//     private String location;

//     @Enumerated(EnumType.STRING)
//     @Column(nullable = false)
//     private ListingStatus status = ListingStatus.OPEN;

//     @Column(nullable = false)
//     private LocalDateTime createdAt = LocalDateTime.now();

//     @PrePersist
//     protected void onCreate() {
//         if (createdAt == null) {
//             createdAt = LocalDateTime.now();
//         }
//     }
// }