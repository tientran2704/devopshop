package com.cafe.repository;

import com.cafe.model.CafeTable;
import com.cafe.model.TableStatus;
import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface CafeTableRepository extends MongoRepository<CafeTable, String> {
    List<CafeTable> findByStatus(TableStatus status);
    Optional<CafeTable> findByTableNumber(Integer tableNumber);
    Boolean existsByTableNumber(Integer tableNumber);
}
