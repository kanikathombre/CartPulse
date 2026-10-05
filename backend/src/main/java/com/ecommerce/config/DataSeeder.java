package com.ecommerce.config;

import com.ecommerce.entity.Coupon;
import com.ecommerce.entity.Product;
import com.ecommerce.entity.User;
import com.ecommerce.enums.Role;
import com.ecommerce.repository.CouponRepository;
import com.ecommerce.repository.ProductRepository;
import com.ecommerce.repository.UserRepository;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.boot.CommandLineRunner;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Component;

import java.math.BigDecimal;
import java.time.LocalDateTime;

/**
 * Data Seeder to initialize sample data on application startup.
 * 
 * INTERVIEW NOTE:
 * CommandLineRunner is a Spring Boot interface with a run() method that executes automatically
 * right after the Spring Application Context is fully initialized.
 */
@Component
public class DataSeeder implements CommandLineRunner {

    private final UserRepository userRepository;
    private final ProductRepository productRepository;
    private final CouponRepository couponRepository;
    private final PasswordEncoder passwordEncoder;

    @Value("${app.seed.enabled:false}")
    private boolean seedEnabled;

    @Value("${app.seed.admin-email:admin@cartpulse.com}")
    private String adminEmail;

    @Value("${app.seed.admin-password:}")
    private String adminPassword;

    @Value("${app.seed.user-email:user@cartpulse.com}")
    private String userEmail;

    @Value("${app.seed.user-password:}")
    private String userPassword;

    public DataSeeder(UserRepository userRepository, ProductRepository productRepository, CouponRepository couponRepository, PasswordEncoder passwordEncoder) {
        this.userRepository = userRepository;
        this.productRepository = productRepository;
        this.couponRepository = couponRepository;
        this.passwordEncoder = passwordEncoder;
    }

    @Override
    public void run(String... args) throws Exception {
        if (!seedEnabled) {
            return;
        }
        seedUsers();
        seedProducts();
        seedCoupons();
    }

    private void seedUsers() {
        if (adminEmail != null && !adminEmail.isBlank() && adminPassword != null && !adminPassword.isBlank()) {
            if (!userRepository.existsByEmail(adminEmail)) {
                User admin = new User(
                        "System Admin",
                        adminEmail,
                        passwordEncoder.encode(adminPassword),
                        Role.ROLE_ADMIN
                );
                userRepository.save(admin);
            }
        }

        if (userEmail != null && !userEmail.isBlank() && userPassword != null && !userPassword.isBlank()) {
            if (!userRepository.existsByEmail(userEmail)) {
                User normalUser = new User(
                        "CartPulse Customer",
                        userEmail,
                        passwordEncoder.encode(userPassword),
                        Role.ROLE_USER
                );
                userRepository.save(normalUser);
            }
        }
    }

    private void seedProducts() {
        if (productRepository.count() == 0) {
            productRepository.save(new Product(
                    "Wireless Noise-Canceling Headphones",
                    "Premium over-ear Bluetooth headphones with active noise cancellation and 30-hour battery life.",
                    new BigDecimal("2999.00"),
                    25,
                    "Electronics",
                    "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=500"
            ));

            productRepository.save(new Product(
                    "Ergonomic Gaming Mouse",
                    "High-precision 16000 DPI optical gaming mouse with customizable RGB lighting.",
                    new BigDecimal("1299.00"),
                    40,
                    "Electronics",
                    "https://images.unsplash.com/photo-1527864550417-7fd91fc51a46?w=500"
            ));

            productRepository.save(new Product(
                    "Mechanical RGB Keyboard",
                    "Tactile mechanical switches with full anti-ghosting and customizable backlight modes.",
                    new BigDecimal("3499.00"),
                    15,
                    "Electronics",
                    "https://images.unsplash.com/photo-1587829741301-dc798b83add3?w=500"
            ));

            productRepository.save(new Product(
                    "Cotton Casual Hoodie",
                    "Soft cotton blend fleece hoodie with pullover hood and kangaroo pocket.",
                    new BigDecimal("1499.00"),
                    50,
                    "Clothing",
                    "https://images.unsplash.com/photo-1556905055-8f358a7a47b2?w=500"
            ));

            productRepository.save(new Product(
                    "Stainless Steel Water Bottle",
                    "1-Liter vacuum insulated double-wall stainless steel bottle keeps drinks cold for 24 hours.",
                    new BigDecimal("799.00"),
                    60,
                    "Home & Kitchen",
                    "https://images.unsplash.com/photo-1602143407151-7111542de6e8?w=500"
            ));

            productRepository.save(new Product(
                    "Spring Boot in Action",
                    "Comprehensive hands-on guide to building production-ready Java enterprise applications with Spring Boot.",
                    new BigDecimal("899.00"),
                    30,
                    "Books",
                    "https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?w=500"
            ));
        }
    }

    private void seedCoupons() {
        if (!couponRepository.existsByCodeIgnoreCase("SAVE10")) {
            couponRepository.save(new Coupon(
                    "SAVE10",
                    10.0,
                    new BigDecimal("1000.00"),
                    new BigDecimal("500.00"),
                    LocalDateTime.now().plusMonths(6),
                    true
            ));
        }

        if (!couponRepository.existsByCodeIgnoreCase("WELCOME20")) {
            couponRepository.save(new Coupon(
                    "WELCOME20",
                    20.0,
                    new BigDecimal("500.00"),
                    new BigDecimal("200.00"),
                    LocalDateTime.now().plusMonths(3),
                    true
            ));
        }
    }
}
