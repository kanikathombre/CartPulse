package com.ecommerce.controller;

import com.ecommerce.dto.AdminStatsDTO;
import com.ecommerce.dto.OrderDTO;
import com.ecommerce.service.AdminService;
import com.ecommerce.service.OrderService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

/**
 * Controller exposing Admin Dashboard & Management REST APIs.
 */
@RestController
@RequestMapping("/api/admin")
@CrossOrigin(origins = "*")
public class AdminController {

    private final AdminService adminService;
    private final OrderService orderService;

    public AdminController(AdminService adminService, OrderService orderService) {
        this.adminService = adminService;
        this.orderService = orderService;
    }

    /**
     * GET /api/admin/stats
     * Returns total products, total users, total orders, pending orders, and total revenue.
     */
    @GetMapping("/stats")
    public ResponseEntity<AdminStatsDTO> getAdminStats() {
        AdminStatsDTO stats = adminService.getAdminStats();
        return ResponseEntity.ok(stats);
    }

    /**
     * GET /api/admin/orders
     * Admin view all orders across all customers.
     */
    @GetMapping("/orders")
    public ResponseEntity<List<OrderDTO>> getAllOrders() {
        List<OrderDTO> orders = orderService.getAllOrders();
        return ResponseEntity.ok(orders);
    }
}
