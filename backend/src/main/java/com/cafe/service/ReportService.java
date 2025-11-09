package com.cafe.service;

import com.cafe.dto.DailyReportResponse;
import com.cafe.dto.MonthlyReportResponse;
import com.cafe.model.Order;
import com.cafe.model.OrderStatus;
import com.cafe.repository.OrderRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.time.LocalDateTime;
import java.time.LocalTime;
import java.time.YearMonth;
import java.util.List;

@Service
@RequiredArgsConstructor
public class ReportService {

    private final OrderRepository orderRepository;    public DailyReportResponse getDailyReport(LocalDate date) {
        LocalDateTime startOfDay = date.atStartOfDay();
        LocalDateTime endOfDay = date.atTime(LocalTime.MAX);
        
        List<Order> orders = orderRepository.findOrdersByDateRange(startOfDay, endOfDay);
        
        Long totalOrders = (long) orders.size();
        
        // Count unique customers (using stream instead of query)
        Long totalCustomers = orders.stream()
                .map(order -> order.getUser().getId())
                .distinct()
                .count();
        
        BigDecimal totalRevenue = orders.stream()
                .filter(order -> order.getStatus() == OrderStatus.COMPLETED)
                .map(Order::getTotalAmount)
                .reduce(BigDecimal.ZERO, BigDecimal::add);
        
        Long completedOrders = orders.stream()
                .filter(order -> order.getStatus() == OrderStatus.COMPLETED)
                .count();
        
        Long pendingOrders = orders.stream()
                .filter(order -> order.getStatus() == OrderStatus.PENDING)
                .count();
        
        Long cancelledOrders = orders.stream()
                .filter(order -> order.getStatus() == OrderStatus.CANCELLED)
                .count();
        
        DailyReportResponse response = new DailyReportResponse();
        response.setReportDate(startOfDay);
        response.setTotalOrders(totalOrders);
        response.setTotalCustomers(totalCustomers);
        response.setTotalRevenue(totalRevenue);
        response.setCompletedOrders(completedOrders);
        response.setPendingOrders(pendingOrders);
        response.setCancelledOrders(cancelledOrders);
        
        return response;
    }
    
    public DailyReportResponse getTodayReport() {
        return getDailyReport(LocalDate.now());
    }

    public MonthlyReportResponse getMonthlyReport(int year, int month) {
        YearMonth yearMonth = YearMonth.of(year, month);
        LocalDateTime startOfMonth = yearMonth.atDay(1).atStartOfDay();
        LocalDateTime endOfMonth = yearMonth.atEndOfMonth().atTime(LocalTime.MAX);

        List<Order> orders = orderRepository.findOrdersByDateRange(startOfMonth, endOfMonth);

        long totalOrders = orders.size();
        long totalCustomers = orders.stream()
                .map(Order::getUser)
                .distinct()
                .count();

        BigDecimal totalRevenue = orders.stream()
                .filter(order -> order.getStatus() == OrderStatus.COMPLETED)
                .map(Order::getTotalAmount)
                .reduce(BigDecimal.ZERO, BigDecimal::add);

        long completedOrders = orders.stream()
                .filter(order -> order.getStatus() == OrderStatus.COMPLETED)
                .count();

        long pendingOrders = orders.stream()
                .filter(order -> order.getStatus() == OrderStatus.PENDING)
                .count();

        long cancelledOrders = orders.stream()
                .filter(order -> order.getStatus() == OrderStatus.CANCELLED)
                .count();

        return new MonthlyReportResponse(
                year,
                month,
                totalOrders,
                totalCustomers,
                totalRevenue,
                completedOrders,
                pendingOrders,
                cancelledOrders
        );
    }
}
