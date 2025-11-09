package com.cafe.config;

import com.cafe.model.*;
import com.cafe.repository.*;
import lombok.RequiredArgsConstructor;
import org.springframework.boot.CommandLineRunner;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Component;

import java.math.BigDecimal;

@Component
@RequiredArgsConstructor
public class DataInitializer implements CommandLineRunner {
    
    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;
    private final MenuItemRepository menuItemRepository;
    private final CafeTableRepository tableRepository;
    
    @Override
    public void run(String... args) {
        // Create root user if not exists
        if (!userRepository.existsByUsername("root")) {
            User rootUser = new User();
            rootUser.setUsername("root");
            rootUser.setPassword(passwordEncoder.encode("root123"));
            rootUser.setFullName("Root Administrator");
            rootUser.setEmail("root@cafe.com");
            rootUser.setRole(Role.ADMIN);
            userRepository.save(rootUser);
            System.out.println("✓ Root user created successfully!");
            System.out.println("  Username: root");
            System.out.println("  Password: root123");
        }
        
        // Create sample menu items if not exists
        if (menuItemRepository.count() == 0) {
            // Cà phê
            createMenuItem("Cà phê đen", "Cà phê phin truyền thống", 25000, "Cà phê", true);
            createMenuItem("Cà phê sữa", "Cà phê phin với sữa đặc", 30000, "Cà phê", true);
            createMenuItem("Bạc xỉu", "Cà phê sữa nhiều sữa", 32000, "Cà phê", true);
            createMenuItem("Cà phê đá xay", "Cà phê xay với đá", 45000, "Cà phê", true);
            
            // Trà
            createMenuItem("Trà đào", "Trà đen với đào tươi", 35000, "Trà", true);
            createMenuItem("Trà sữa trân châu", "Trà sữa với trân châu đen", 40000, "Trà", true);
            createMenuItem("Trà xanh", "Trà xanh nguyên chất", 30000, "Trà", true);
            createMenuItem("Trà chanh", "Trà đen với chanh tươi", 30000, "Trà", true);
            
            // Sinh tố
            createMenuItem("Sinh tố bơ", "Sinh tố bơ sánh mịn", 45000, "Sinh tố", true);
            createMenuItem("Sinh tố dâu", "Sinh tố dâu tươi", 42000, "Sinh tố", true);
            createMenuItem("Sinh tố xoài", "Sinh tố xoài ngọt", 42000, "Sinh tố", true);
            
            // Bánh ngọt
            createMenuItem("Bánh tiramisu", "Bánh tiramisu Ý", 55000, "Bánh ngọt", true);
            createMenuItem("Bánh flan", "Bánh flan caramel", 35000, "Bánh ngọt", true);
            createMenuItem("Bánh croissant", "Bánh sừng bò bơ", 40000, "Bánh ngọt", true);
            
            System.out.println("✓ Sample menu items created successfully!");
        }
        
        // Create sample tables if not exists
        if (tableRepository.count() == 0) {
            for (int i = 1; i <= 10; i++) {
                CafeTable table = new CafeTable();
                table.setTableNumber(i);
                table.setCapacity(i <= 5 ? 2 : 4); // Bàn 1-5 cho 2 người, bàn 6-10 cho 4 người
                table.setStatus(TableStatus.AVAILABLE);
                tableRepository.save(table);
            }
            System.out.println("✓ Sample tables (1-10) created successfully!");
        }
        
        System.out.println("\n=== Hệ thống đã sẵn sàng! ===");
    }
    
    private void createMenuItem(String name, String description, double price, String category, boolean available) {
        MenuItem item = new MenuItem();
        item.setName(name);
        item.setDescription(description);
        item.setPrice(BigDecimal.valueOf(price));
        item.setCategory(category);
        item.setAvailable(available);
        menuItemRepository.save(item);
    }
}
