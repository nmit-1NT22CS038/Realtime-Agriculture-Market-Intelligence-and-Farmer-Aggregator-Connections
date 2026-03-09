package com.agrilink.backend.dto;

import java.util.List;

public record AdminStatsResponse(
        long totalSales,
        long farmers,
        long aggregators,
        List<SalesPoint> salesByMonth,
        List<ProductSalesPoint> salesByProduct
) {
    public record SalesPoint(String month, long sales) {
    }

    public record ProductSalesPoint(String product, long sales) {
    }
}
