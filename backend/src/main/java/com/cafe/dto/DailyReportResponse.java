package com.cafe.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.math.BigDecimal;
import java.time.LocalDateTime;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class DailyReportResponse {
    private LocalDateTime reportDate;
    private Long totalOrders;
    private Long totalCustomers;
    private BigDecimal totalRevenue;
    private Long completedOrders;
    private Long pendingOrders;
    private Long cancelledOrders;
}
