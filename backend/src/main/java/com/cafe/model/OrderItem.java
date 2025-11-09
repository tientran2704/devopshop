package com.cafe.model;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.springframework.data.mongodb.core.mapping.DBRef;

import java.math.BigDecimal;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class OrderItem {
    @DBRef
    private MenuItem menuItem;
    
    private Integer quantity;
    
    private BigDecimal price;
    
    private String notes;
}
