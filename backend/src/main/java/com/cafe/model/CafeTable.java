package com.cafe.model;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.index.Indexed;
import org.springframework.data.mongodb.core.mapping.Document;

@Document(collection = "tables")
@Data
@NoArgsConstructor
@AllArgsConstructor
public class CafeTable {
    @Id
    private String id;
    
    @Indexed(unique = true)
    private Integer tableNumber;
    
    private Integer capacity;
    
    private TableStatus status = TableStatus.AVAILABLE;
}
