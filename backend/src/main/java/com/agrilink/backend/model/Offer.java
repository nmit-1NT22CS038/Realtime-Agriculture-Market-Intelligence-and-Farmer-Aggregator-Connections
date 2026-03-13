package com.agrilink.backend.model;

import jakarta.persistence.*;
import java.math.BigDecimal;
import java.time.LocalDateTime;

@Entity
@Table(name = "offers")
public class Offer {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(optional = false)
    @JoinColumn(name = "listing_id")
    private ProductListing listing;

    @ManyToOne(optional = false)
    @JoinColumn(name = "aggregator_id")
    private User aggregator;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private OfferStatus status = OfferStatus.BID_PLACED;

    @Column(nullable = false, precision = 10, scale = 2)
    private BigDecimal bidPricePerKg;

    @Column(nullable = false, length = 6)
    private String otpCode;

    @Column(nullable = false)
    private LocalDateTime createdAt = LocalDateTime.now();

    private LocalDateTime completedAt;

    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }

    public ProductListing getListing() { return listing; }
    public void setListing(ProductListing listing) { this.listing = listing; }

    public User getAggregator() { return aggregator; }
    public void setAggregator(User aggregator) { this.aggregator = aggregator; }

    public OfferStatus getStatus() { return status; }
    public void setStatus(OfferStatus status) { this.status = status; }

    public BigDecimal getBidPricePerKg() { return bidPricePerKg; }
    public void setBidPricePerKg(BigDecimal bidPricePerKg) { this.bidPricePerKg = bidPricePerKg; }

    public String getOtpCode() { return otpCode; }
    public void setOtpCode(String otpCode) { this.otpCode = otpCode; }

    public LocalDateTime getCreatedAt() { return createdAt; }
    public void setCreatedAt(LocalDateTime createdAt) { this.createdAt = createdAt; }

    public LocalDateTime getCompletedAt() { return completedAt; }
    public void setCompletedAt(LocalDateTime completedAt) { this.completedAt = completedAt; }

    // Bridge for FarmerController legacy calls
    public void setOtp(String otp) { this.otpCode = otp; }
    public String getOtp() { return this.otpCode; }
}
// package com.agrilink.backend.model;

// import jakarta.persistence.*;
// import lombok.Getter;
// import lombok.Setter;

// import java.time.LocalDateTime;

// @Entity
// @Table(name = "offers")
// @Getter
// @Setter
// public class Offer {

//     @Id
//     @GeneratedValue(strategy = GenerationType.IDENTITY)
//     private Long id;

//     @ManyToOne(optional = false)
//     @JoinColumn(name = "listing_id")
//     private ProductListing listing;

//     @ManyToOne(optional = false)
//     @JoinColumn(name = "aggregator_id")
//     private User aggregator;

//     @Enumerated(EnumType.STRING)
//     @Column(nullable = false)
//     private OfferStatus status = OfferStatus.BID_PLACED;

//     @Column(nullable = false, precision = 10, scale = 2)
//     private java.math.BigDecimal bidPricePerKg;
    
//     @Column(nullable = false, length = 6)
//     private String otpCode;

//     @Column(nullable = false)
//     private LocalDateTime createdAt = LocalDateTime.now();

//     private LocalDateTime completedAt;
// }
