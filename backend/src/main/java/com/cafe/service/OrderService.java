package com.cafe.service;

import com.cafe.dto.CreateOrderRequest;
import com.cafe.model.*;
import com.cafe.repository.*;
import lombok.RequiredArgsConstructor;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.List;

@Service
@RequiredArgsConstructor
public class OrderService {
    
    private final OrderRepository orderRepository;
    private final UserRepository userRepository;
    private final CafeTableRepository tableRepository;
    private final MenuItemRepository menuItemRepository;
    
    public List<Order> getAllOrders() {
        return orderRepository.findAll();
    }
    
    public List<Order> getOrdersByTable(String tableId) {
        return orderRepository.findByTableId(tableId);
    }
    
    public Order getOrderById(String id) {
        return orderRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Order not found"));
    }
    
    @Transactional
    public Order createOrder(CreateOrderRequest request) {
        String username = SecurityContextHolder.getContext().getAuthentication().getName();
        User user = userRepository.findByUsername(username)
                .orElseThrow(() -> new RuntimeException("User not found"));
        
        CafeTable table = tableRepository.findById(request.getTableId())
                .orElseThrow(() -> new RuntimeException("Table not found"));
        
        if (table.getStatus() != TableStatus.AVAILABLE) {
            throw new RuntimeException("Table is not available");
        }
        
        Order order = new Order();
        order.setUser(user);
        order.setTable(table);
        order.setStatus(OrderStatus.PENDING);
        order.setOrderTime(LocalDateTime.now());
        
        order = orderRepository.save(order);
        
        for (CreateOrderRequest.OrderItemRequest itemRequest : request.getItems()) {
            MenuItem menuItem = menuItemRepository.findById(itemRequest.getMenuItemId())
                    .orElseThrow(() -> new RuntimeException("Menu item not found"));
            
            OrderItem orderItem = new OrderItem();
            orderItem.setMenuItem(menuItem);
            orderItem.setQuantity(itemRequest.getQuantity());
            orderItem.setPrice(menuItem.getPrice());
            orderItem.setNotes(itemRequest.getNotes());
            
            order.getItems().add(orderItem);
        }
        
        order.calculateTotal();
        order = orderRepository.save(order);
        
        // Update table status
        table.setStatus(TableStatus.OCCUPIED);
        tableRepository.save(table);
        
        return order;
    }
    
    @Transactional
    public Order updateOrderStatus(String id, OrderStatus status) {
        Order order = getOrderById(id);
        order.setStatus(status);
        
        if (status == OrderStatus.COMPLETED) {
            order.setCompletedTime(LocalDateTime.now());
            // Update table status to AVAILABLE (đã thanh toán, bàn trống)
            CafeTable table = order.getTable();
            table.setStatus(TableStatus.AVAILABLE);
            tableRepository.save(table);
        } else if (status == OrderStatus.CANCELLED) {
            // Nếu hủy order, trả bàn về trạng thái trống
            CafeTable table = order.getTable();
            table.setStatus(TableStatus.AVAILABLE);
            tableRepository.save(table);
        }
        
        return orderRepository.save(order);
    }
    
    public List<Order> getMyOrders() {
        String username = SecurityContextHolder.getContext().getAuthentication().getName();
        User user = userRepository.findByUsername(username)
                .orElseThrow(() -> new RuntimeException("User not found"));
        return orderRepository.findByUserId(user.getId());
    }
    
    @Transactional
    public Order transferTable(String orderId, String newTableId) {
        Order order = getOrderById(orderId);
        
        // Kiểm tra đơn hàng phải ở trạng thái PENDING
        if (order.getStatus() != OrderStatus.PENDING) {
            throw new RuntimeException("Chỉ có thể chuyển bàn cho đơn hàng đang chờ");
        }
        
        // Lấy bàn cũ và bàn mới
        CafeTable oldTable = order.getTable();
        CafeTable newTable = tableRepository.findById(newTableId)
                .orElseThrow(() -> new RuntimeException("Không tìm thấy bàn mới"));
        
        // Kiểm tra bàn mới phải trống
        if (newTable.getStatus() != TableStatus.AVAILABLE) {
            throw new RuntimeException("Bàn mới không trống, không thể chuyển");
        }
        
        // Kiểm tra không chuyển sang cùng bàn
        if (oldTable.getId().equals(newTableId)) {
            throw new RuntimeException("Không thể chuyển sang cùng bàn");
        }
        
        // Cập nhật bàn cũ về trạng thái trống
        oldTable.setStatus(TableStatus.AVAILABLE);
        tableRepository.save(oldTable);
        
        // Cập nhật bàn mới thành đang sử dụng
        newTable.setStatus(TableStatus.OCCUPIED);
        tableRepository.save(newTable);
        
        // Cập nhật order với bàn mới
        order.setTable(newTable);
        return orderRepository.save(order);
    }
}
