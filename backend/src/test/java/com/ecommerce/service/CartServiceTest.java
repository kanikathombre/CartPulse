package com.ecommerce.service;

import com.ecommerce.dto.AddToCartRequest;
import com.ecommerce.dto.CartDTO;

import com.ecommerce.entity.Cart;
import com.ecommerce.entity.Product;
import com.ecommerce.entity.User;
import com.ecommerce.enums.Role;
import com.ecommerce.exception.InsufficientStockException;
import com.ecommerce.repository.CartItemRepository;
import com.ecommerce.repository.CartRepository;
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
class CartServiceTest {

    @Mock
    private CartRepository cartRepository;

    @Mock
    private CartItemRepository cartItemRepository;

    @Mock
    private ProductRepository productRepository;

    @InjectMocks
    private CartService cartService;

    private User testUser;
    private Product testProduct;
    private Cart testCart;

    @BeforeEach
    void setUp() {
        testUser = new User("John Doe", "john@example.com", "password123", Role.ROLE_USER);
        testUser.setId(1L);

        testProduct = new Product("Wireless Headphones", "Noise cancelling headphones", new BigDecimal("2999.00"), 10, "Electronics", "http://example.com/headphone.jpg");
        testProduct.setId(10L);

        testCart = new Cart(testUser);
        testCart.setId(100L);
    }

    @Test
    @DisplayName("getCartByUser should create and save new cart if user does not have an existing cart")
    void getCartByUser_NewUser_CreatesCart() {
        when(cartRepository.findByUser(testUser)).thenReturn(Optional.empty());
        when(cartRepository.save(any(Cart.class))).thenAnswer(invocation -> {
            Cart saved = invocation.getArgument(0);
            saved.setId(100L);
            return saved;
        });

        CartDTO cartDTO = cartService.getCartByUser(testUser);

        assertNotNull(cartDTO);
        assertEquals(100L, cartDTO.getId());
        verify(cartRepository, times(1)).findByUser(testUser);
        verify(cartRepository, times(1)).save(any(Cart.class));
    }

    @Test
    @DisplayName("getCartByUser should return existing cart if user already has a cart")
    void getCartByUser_ExistingCart_ReturnsCart() {
        when(cartRepository.findByUser(testUser)).thenReturn(Optional.of(testCart));

        CartDTO cartDTO = cartService.getCartByUser(testUser);

        assertNotNull(cartDTO);
        assertEquals(100L, cartDTO.getId());
        verify(cartRepository, times(1)).findByUser(testUser);
        verify(cartRepository, never()).save(any(Cart.class));
    }

    @Test
    @DisplayName("addToCart should add item to cart when stock is available")
    void addToCart_Success() {
        AddToCartRequest request = new AddToCartRequest(10L, 2);

        when(productRepository.findById(10L)).thenReturn(Optional.of(testProduct));
        when(cartRepository.findByUser(testUser)).thenReturn(Optional.of(testCart));
        when(cartRepository.save(any(Cart.class))).thenReturn(testCart);

        CartDTO result = cartService.addToCart(testUser, request);

        assertNotNull(result);
        verify(productRepository, times(1)).findById(10L);
        verify(cartRepository, times(1)).save(testCart);
    }

    @Test
    @DisplayName("addToCart should throw InsufficientStockException when requested quantity exceeds available stock")
    void addToCart_ExceedsStock_ThrowsException() {
        AddToCartRequest request = new AddToCartRequest(10L, 15);

        when(productRepository.findById(10L)).thenReturn(Optional.of(testProduct));

        assertThrows(InsufficientStockException.class, () -> cartService.addToCart(testUser, request));
        verify(cartRepository, never()).save(any(Cart.class));
    }
}
