package com.agrilink.backend.model;

import jakarta.persistence.*;
import java.math.BigDecimal;
import java.time.LocalDateTime;

@Entity
@Table(name = "price_predictions")
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

    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }

    public User getRequestedBy() { return requestedBy; }
    public void setRequestedBy(User requestedBy) { this.requestedBy = requestedBy; }

    public String getCropName() { return cropName; }
    public void setCropName(String cropName) { this.cropName = cropName; }

    public String getDistrict() { return district; }
    public void setDistrict(String district) { this.district = district; }

    public BigDecimal getPredictedPricePerKg() { return predictedPricePerKg; }
    public void setPredictedPricePerKg(BigDecimal predictedPricePerKg) { this.predictedPricePerKg = predictedPricePerKg; }

    public BigDecimal getConfidence() { return confidence; }
    public void setConfidence(BigDecimal confidence) { this.confidence = confidence; }

    public String getModelSource() { return modelSource; }
    public void setModelSource(String modelSource) { this.modelSource = modelSource; }

    public LocalDateTime getCreatedAt() { return createdAt; }
    public void setCreatedAt(LocalDateTime createdAt) { this.createdAt = createdAt; }
}

// package com.agrilink.backend.model;

// import jakarta.persistence.*;
// import lombok.Getter;
// import lombok.Setter;

// import java.math.BigDecimal;
// import java.time.LocalDateTime;

// @Entity
// @Table(name = "price_predictions")
// @Getter
// @Setter
// public class PricePrediction {

//     @Id
//     @GeneratedValue(strategy = GenerationType.IDENTITY)
//     private Long id;

//     @ManyToOne
//     @JoinColumn(name = "requested_by")
//     private User requestedBy;

//     @Column(nullable = false)
//     private String cropName;

//     @Column(nullable = false)
//     private String district;

//     @Column(nullable = false, precision = 12, scale = 2)
//     private BigDecimal predictedPricePerKg;

//     @Column(nullable = false, precision = 5, scale = 2)
//     private BigDecimal confidence;

//     @Column(nullable = false)
//     private String modelSource;

//     @Column(nullable = false)
//     private LocalDateTime createdAt = LocalDateTime.now();
// }
