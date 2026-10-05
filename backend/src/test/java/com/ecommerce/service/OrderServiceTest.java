package com.ecommerce.service;

import com.ecommerce.dto.OrderDTO;
import com.ecommerce.entity.*;
import com.ecommerce.enums.OrderStatus;
import com.ecommerce.enums.Role;
import com.ecommerce.exception.InsufficientStockException;
import com.ecommerce.repository.OrderRepository;
import com.ecommerce.repository.ProductRepository;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

import java.math.BigDecimal;
import java.util.Optional;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
class OrderServiceTest {

    @Mock
    private OrderRepository orderRepository;

    @Mock
    private CartService cartService;

    @Mock
    private CouponService couponService;

    @Mock
    private ProductRepository productRepository;

    @InjectMocks
    private OrderService orderService;

    private User user;
    private Product product;
    private Cart cart;

    @BeforeEach
    void setUp() {
        user = new User(1L, "Test User", "user@test.com", "pass", Role.ROLE_USER, null);
        product = new Product(10L, "Keyboard", "Mechanical", new BigDecimal("1000.00"), 5, "Electronics", null, null, null);
        
        cart = new Cart(user);
        cart.setId(100L);
        CartItem item = new CartItem(cart, product, 2);
        cart.addItem(item);
    }

    @Test
    @DisplayName("checkoutCart should create order, store price snapshot, deduct stock, and clear cart")
    void checkoutCart_Success() {
        when(cartService.getOrCreateCartEntity(user)).thenReturn(cart);

        Order createdOrder = new Order(user, new BigDecimal("2000.00"), BigDecimal.ZERO, new BigDecimal("2000.00"), null, OrderStatus.PLACED);
        createdOrder.setId(500L);
        OrderItem orderItem = new OrderItem(createdOrder, product, 2, new BigDecimal("1000.00"));
        createdOrder.addItem(orderItem);

        when(orderRepository.save(any(Order.class))).thenReturn(createdOrder);

        OrderDTO result = orderService.checkoutCart(user, null);

        assertNotNull(result);
        assertEquals(500L, result.getId());
        assertEquals(new BigDecimal("2000.00"), result.getTotalAmount());
        assertEquals(3, product.getStock()); // Stock reduced from 5 to 3!
        verify(productRepository, times(1)).save(product);
        verify(orderRepository, times(1)).save(any(Order.class));
    }

    @Test
    @DisplayName("checkoutCart should throw InsufficientStockException when requested quantity exceeds product stock")
    void checkoutCart_InsufficientStock() {
        product.setStock(1); // Only 1 available, but cart has 2
        when(cartService.getOrCreateCartEntity(user)).thenReturn(cart);

        assertThrows(InsufficientStockException.class, () -> orderService.checkoutCart(user, null));
    }

    @Test
    @DisplayName("cancelOrder should restore product stock")
    void cancelOrder_RestoresStock() {
        Order order = new Order(user, new BigDecimal("2000.00"), BigDecimal.ZERO, new BigDecimal("2000.00"), null, OrderStatus.PLACED);
        order.setId(500L);
        OrderItem orderItem = new OrderItem(order, product, 2, new BigDecimal("1000.00"));
        order.addItem(orderItem);

        when(orderRepository.findById(500L)).thenReturn(Optional.of(order));
        when(orderRepository.save(any(Order.class))).thenReturn(order);

        OrderDTO result = orderService.cancelOrder(500L, user);

        assertEquals(OrderStatus.CANCELLED, result.getStatus());
        assertEquals(7, product.getStock()); // Stock restored from 5 to 7 (5 + 2)!
        verify(productRepository, times(1)).save(product);
    }
}
