package com.cafe.repository;

import com.cafe.model.Order;
import com.cafe.model.OrderStatus;
import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.data.mongodb.repository.Query;
import org.springframework.stereotype.Repository;

import java.time.LocalDateTime;
import java.util.List;

@Repository
public interface OrderRepository extends MongoRepository<Order, String> {
    List<Order> findByStatus(OrderStatus status);
    List<Order> findByTableId(String tableId);
    List<Order> findByUserId(String userId);
    
    @Query("{ 'orderTime' : { $gte: ?0, $lt: ?1 } }")
    List<Order> findOrdersByDateRange(LocalDateTime startDate, LocalDateTime endDate);
}
