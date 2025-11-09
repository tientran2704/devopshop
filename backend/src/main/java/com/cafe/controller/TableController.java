package com.cafe.controller;

import com.cafe.model.CafeTable;
import com.cafe.model.TableStatus;
import com.cafe.service.TableService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/tables")
@RequiredArgsConstructor
public class TableController {
    
    private final TableService tableService;
    
    @GetMapping
    public ResponseEntity<List<CafeTable>> getAllTables() {
        return ResponseEntity.ok(tableService.getAllTables());
    }
    
    @GetMapping("/available")
    public ResponseEntity<List<CafeTable>> getAvailableTables() {
        return ResponseEntity.ok(tableService.getAvailableTables());
    }
    
    @GetMapping("/{id}")
    public ResponseEntity<CafeTable> getTableById(@PathVariable String id) {
        return ResponseEntity.ok(tableService.getTableById(id));
    }
    
    @PostMapping
    public ResponseEntity<CafeTable> createTable(@RequestBody CafeTable table) {
        return ResponseEntity.ok(tableService.createTable(table));
    }
    
    @PutMapping("/{id}")
    public ResponseEntity<CafeTable> updateTable(@PathVariable String id, @RequestBody CafeTable table) {
        return ResponseEntity.ok(tableService.updateTable(id, table));
    }
    
    @PatchMapping("/{id}/status")
    public ResponseEntity<CafeTable> updateTableStatus(@PathVariable String id, @RequestBody Map<String, String> request) {
        TableStatus status = TableStatus.valueOf(request.get("status"));
        return ResponseEntity.ok(tableService.updateTableStatus(id, status));
    }
    
    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteTable(@PathVariable String id) {
        tableService.deleteTable(id);
        return ResponseEntity.noContent().build();
    }
}
