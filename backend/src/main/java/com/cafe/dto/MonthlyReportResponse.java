package com.cafe.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.math.BigDecimal;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class MonthlyReportResponse {
    private Integer year;
    private Integer month;
    private Long totalOrders;
    private Long totalCustomers;
    private BigDecimal totalRevenue;
    private Long completedOrders;
    private Long pendingOrders;
    private Long cancelledOrders;
}
