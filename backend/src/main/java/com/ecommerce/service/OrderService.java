package com.ecommerce.service;

import com.ecommerce.dto.CouponValidationResponse;
import com.ecommerce.dto.OrderDTO;
import com.ecommerce.entity.*;
import com.ecommerce.enums.OrderStatus;
import com.ecommerce.enums.Role;
import com.ecommerce.exception.InsufficientStockException;
import com.ecommerce.exception.InvalidOrderException;
import com.ecommerce.exception.ResourceNotFoundException;
import com.ecommerce.exception.UnauthorizedException;
import com.ecommerce.repository.OrderRepository;
import com.ecommerce.repository.ProductRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.util.List;
import java.util.stream.Collectors;

/**
 * Service managing Order placement, checkout, stock reduction, price snapshots, and status updates.
 * 
 * INTERVIEW NOTE:
 * @Transactional is CRITICAL during checkout!
 * Atomicity: If any step fails during checkout (e.g. database error while saving items or stock deduction),
 * the entire transaction is rolled back so the database remains in a consistent state without partial orders or incorrect stock!
 */
@Service
public class OrderService {

    private final OrderRepository orderRepository;
    private final CartService cartService;
    private final CouponService couponService;
    private final ProductRepository productRepository;

    public OrderService(OrderRepository orderRepository, CartService cartService, CouponService couponService, ProductRepository productRepository) {
        this.orderRepository = orderRepository;
        this.cartService = cartService;
        this.couponService = couponService;
        this.productRepository = productRepository;
    }

    /**
     * Checkout user's cart and create a new Order.
     */
    @Transactional
    public OrderDTO checkoutCart(User user, String couponCode) {
        Cart cart = cartService.getOrCreateCartEntity(user);
        if (cart.getItems() == null || cart.getItems().isEmpty()) {
            throw new InvalidOrderException("Cannot checkout an empty shopping cart");
        }

        // Validate stock for all items
        for (CartItem cartItem : cart.getItems()) {
            Product product = cartItem.getProduct();
            if (product.getStock() < cartItem.getQuantity()) {
                throw new InsufficientStockException("Product '" + product.getName() + "' does not have enough stock available (Requested: " + cartItem.getQuantity() + ", Available: " + product.getStock() + ")");
            }
        }

        BigDecimal subtotal = cart.calculateSubtotal();
        BigDecimal discount = BigDecimal.ZERO;
        Coupon coupon = null;

        // Apply coupon if provided
        if (couponCode != null && !couponCode.trim().isEmpty()) {
            CouponValidationResponse couponResponse = couponService.validateCoupon(couponCode, subtotal);
            discount = couponResponse.getCalculatedDiscount();
            coupon = couponService.getCouponEntityByCode(couponCode);
        }

        BigDecimal totalAmount = subtotal.subtract(discount);
        if (totalAmount.compareTo(BigDecimal.ZERO) < 0) {
            totalAmount = BigDecimal.ZERO;
        }

        // Create Order Entity
        Order order = new Order(user, subtotal, discount, totalAmount, coupon, OrderStatus.PLACED);

        // Create OrderItems & Deduct Product Stock
        for (CartItem cartItem : cart.getItems()) {
            Product product = cartItem.getProduct();
            
            // PRICE SNAPSHOT: Store current product price permanently for this historical order item!
            OrderItem orderItem = new OrderItem(order, product, cartItem.getQuantity(), product.getPrice());
            order.addItem(orderItem);

            // Deduct product stock in database
            product.setStock(product.getStock() - cartItem.getQuantity());
            productRepository.save(product);
        }

        Order savedOrder = orderRepository.save(order);

        // Clear user's cart after successful checkout
        cart.clearItems();

        return OrderDTO.fromEntity(savedOrder);
    }

    /**
     * Get order history for a user.
     */
    @Transactional(readOnly = true)
    public List<OrderDTO> getUserOrders(User user) {
        return orderRepository.findByUserOrderByCreatedAtDesc(user).stream()
                .map(OrderDTO::fromEntity)
                .collect(Collectors.toList());
    }

    /**
     * Get a single order by ID. Regular users can only access their own orders.
     */
    @Transactional(readOnly = true)
    public OrderDTO getOrderById(Long id, User currentUser) {
        Order order = orderRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Order not found with id: " + id));

        if (!currentUser.getRole().equals(Role.ROLE_ADMIN) && !order.getUser().getId().equals(currentUser.getId())) {
            throw new UnauthorizedException("You are not authorized to view this order");
        }

        return OrderDTO.fromEntity(order);
    }

    /**
     * Get all orders (Admin feature).
     */
    @Transactional(readOnly = true)
    public List<OrderDTO> getAllOrders() {
        return orderRepository.findAllByOrderByCreatedAtDesc().stream()
                .map(OrderDTO::fromEntity)
                .collect(Collectors.toList());
    }

    /**
     * Update order status (Admin feature).
     */
    @Transactional
    public OrderDTO updateOrderStatus(Long id, OrderStatus newStatus) {
        Order order = orderRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Order not found with id: " + id));

        order.setStatus(newStatus);
        Order updatedOrder = orderRepository.save(order);
        return OrderDTO.fromEntity(updatedOrder);
    }

    /**
     * Cancel an order and restore product stock.
     */
    @Transactional
    public OrderDTO cancelOrder(Long id, User currentUser) {
        Order order = orderRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Order not found with id: " + id));

        if (!currentUser.getRole().equals(Role.ROLE_ADMIN) && !order.getUser().getId().equals(currentUser.getId())) {
            throw new UnauthorizedException("You are not authorized to cancel this order");
        }

        if (order.getStatus().equals(OrderStatus.DELIVERED)) {
            throw new InvalidOrderException("Cannot cancel an order that has already been DELIVERED");
        }

        if (order.getStatus().equals(OrderStatus.CANCELLED)) {
            throw new InvalidOrderException("Order is already CANCELLED");
        }

        order.setStatus(OrderStatus.CANCELLED);

        // Restore product stock upon cancellation
        for (OrderItem item : order.getItems()) {
            Product product = item.getProduct();
            product.setStock(product.getStock() + item.getQuantity());
            productRepository.save(product);
        }

        Order cancelledOrder = orderRepository.save(order);
        return OrderDTO.fromEntity(cancelledOrder);
    }
}
