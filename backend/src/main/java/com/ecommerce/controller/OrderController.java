package com.ecommerce.controller;

import com.ecommerce.dto.CreateOrderRequest;
import com.ecommerce.dto.OrderDTO;
import com.ecommerce.dto.UpdateOrderStatusRequest;
import com.ecommerce.entity.User;
import com.ecommerce.service.AuthService;
import com.ecommerce.service.OrderService;
import jakarta.validation.Valid;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.util.List;

/**
 * Controller exposing REST APIs for Orders and Checkout.
 */
@RestController
@RequestMapping("/api/orders")
@CrossOrigin(origins = "*")
public class OrderController {

    private final OrderService orderService;
    private final AuthService authService;

    public OrderController(OrderService orderService, AuthService authService) {
        this.orderService = orderService;
        this.authService = authService;
    }

    private User getAuthenticatedUser(Authentication authentication) {
        String email = authentication.getName();
        return authService.getUserEntityByEmail(email);
    }

    /**
     * POST /api/orders
     * Checkout current cart and place order.
     */
    @PostMapping
    public ResponseEntity<OrderDTO> checkout(
            Authentication authentication,
            @RequestBody(required = false) CreateOrderRequest request
    ) {
        User user = getAuthenticatedUser(authentication);
        String couponCode = request != null ? request.getCouponCode() : null;
        OrderDTO order = orderService.checkoutCart(user, couponCode);
        return ResponseEntity.status(HttpStatus.CREATED).body(order);
    }

    /**
     * GET /api/orders
     * Returns user's order history (or all orders if Admin).
     */
    @GetMapping
    public ResponseEntity<List<OrderDTO>> getOrders(Authentication authentication) {
        User user = getAuthenticatedUser(authentication);
        List<OrderDTO> orders = orderService.getUserOrders(user);
        return ResponseEntity.ok(orders);
    }

    /**
     * GET /api/orders/{id}
     */
    @GetMapping("/{id}")
    public ResponseEntity<OrderDTO> getOrderById(
            Authentication authentication,
            @PathVariable Long id
    ) {
        User user = getAuthenticatedUser(authentication);
        OrderDTO order = orderService.getOrderById(id, user);
        return ResponseEntity.ok(order);
    }

    /**
     * PUT /api/orders/{id}/status
     * (Admin feature to update order lifecycle status)
     */
    @PutMapping("/{id}/status")
    public ResponseEntity<OrderDTO> updateOrderStatus(
            @PathVariable Long id,
            @Valid @RequestBody UpdateOrderStatusRequest request
    ) {
        OrderDTO updatedOrder = orderService.updateOrderStatus(id, request.getStatus());
        return ResponseEntity.ok(updatedOrder);
    }

    /**
     * PUT /api/orders/{id}/cancel
     * Cancel an order.
     */
    @PutMapping("/{id}/cancel")
    public ResponseEntity<OrderDTO> cancelOrder(
            Authentication authentication,
            @PathVariable Long id
    ) {
        User user = getAuthenticatedUser(authentication);
        OrderDTO cancelledOrder = orderService.cancelOrder(id, user);
        return ResponseEntity.ok(cancelledOrder);
    }
}
