package com.cafe.service;

import com.cafe.model.CafeTable;
import com.cafe.model.TableStatus;
import com.cafe.repository.CafeTableRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
@RequiredArgsConstructor
public class TableService {
    
    private final CafeTableRepository tableRepository;
    
    public List<CafeTable> getAllTables() {
        return tableRepository.findAll();
    }
    
    public List<CafeTable> getAvailableTables() {
        return tableRepository.findByStatus(TableStatus.AVAILABLE);
    }
    
    public CafeTable getTableById(String id) {
        return tableRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Table not found"));
    }
    
    @Transactional
    public CafeTable createTable(CafeTable table) {
        if (tableRepository.existsByTableNumber(table.getTableNumber())) {
            throw new RuntimeException("Table number already exists");
        }
        table.setStatus(TableStatus.AVAILABLE);
        return tableRepository.save(table);
    }
    
    @Transactional
    public CafeTable updateTable(String id, CafeTable table) {
        CafeTable existing = getTableById(id);
        
        if (!existing.getTableNumber().equals(table.getTableNumber()) &&
            tableRepository.existsByTableNumber(table.getTableNumber())) {
            throw new RuntimeException("Table number already exists");
        }
        
        existing.setTableNumber(table.getTableNumber());
        existing.setCapacity(table.getCapacity());
        existing.setStatus(table.getStatus());
        return tableRepository.save(existing);
    }
    
    @Transactional
    public CafeTable updateTableStatus(String id, TableStatus status) {
        CafeTable table = getTableById(id);
        table.setStatus(status);
        return tableRepository.save(table);
    }
    
    @Transactional
    public void deleteTable(String id) {
        tableRepository.deleteById(id);
    }
}
