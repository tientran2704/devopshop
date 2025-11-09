package com.cafe.controller;

import com.cafe.dto.DailyReportResponse;
import com.cafe.dto.MonthlyReportResponse;
import com.cafe.service.ReportService;
import lombok.RequiredArgsConstructor;
import org.springframework.format.annotation.DateTimeFormat;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDate;

@RestController
@RequestMapping("/api/reports")
@RequiredArgsConstructor
public class ReportController {
    
    private final ReportService reportService;
    
    @GetMapping("/daily")
    public ResponseEntity<DailyReportResponse> getDailyReport(
            @RequestParam(required = false) @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate date) {
        if (date == null) {
            return ResponseEntity.ok(reportService.getTodayReport());
        }
        return ResponseEntity.ok(reportService.getDailyReport(date));
    }
    
    @GetMapping("/today")
    public ResponseEntity<DailyReportResponse> getTodayReport() {
        return ResponseEntity.ok(reportService.getTodayReport());
    }
    
    @GetMapping("/monthly")
    public ResponseEntity<MonthlyReportResponse> getMonthlyReport(
            @RequestParam int year,
            @RequestParam int month) {
        return ResponseEntity.ok(reportService.getMonthlyReport(year, month));
    }
}
