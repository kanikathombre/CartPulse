package com.ecommerce.service;

import com.ecommerce.dto.ProductDTO;
import com.ecommerce.dto.ProductRequest;
import com.ecommerce.entity.Product;
import com.ecommerce.exception.ResourceNotFoundException;
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

/**
 * Unit Test suite for ProductService using JUnit 5 and Mockito.
 * 
 * INTERVIEW NOTE:
 * @ExtendWith(MockitoExtension.class) initializes Mockito mocks without booting the entire Spring Application Context,
 * making unit tests lightning fast!
 */
@ExtendWith(MockitoExtension.class)
class ProductServiceTest {

    @Mock
    private ProductRepository productRepository;

    @InjectMocks
    private ProductService productService;

    private Product sampleProduct;

    @BeforeEach
    void setUp() {
        sampleProduct = new Product(
                1L,
                "Test Wireless Headphones",
                "Noise canceling",
                new BigDecimal("2999.00"),
                10,
                "Electronics",
                "http://example.com/img.jpg",
                null,
                null
        );
    }

    @Test
    @DisplayName("getProductById should return ProductDTO when product exists")
    void getProductById_Success() {
        when(productRepository.findById(1L)).thenReturn(Optional.of(sampleProduct));

        ProductDTO result = productService.getProductById(1L);

        assertNotNull(result);
        assertEquals(1L, result.getId());
        assertEquals("Test Wireless Headphones", result.getName());
        verify(productRepository, times(1)).findById(1L);
    }

    @Test
    @DisplayName("getProductById should throw ResourceNotFoundException when product does not exist")
    void getProductById_NotFound() {
        when(productRepository.findById(99L)).thenReturn(Optional.empty());

        assertThrows(ResourceNotFoundException.class, () -> productService.getProductById(99L));
        verify(productRepository, times(1)).findById(99L);
    }

    @Test
    @DisplayName("createProduct should save and return ProductDTO")
    void createProduct_Success() {
        ProductRequest request = new ProductRequest("New Phone", "Latest model", new BigDecimal("49999.00"), 5, "Electronics", null);
        Product savedProduct = new Product(2L, "New Phone", "Latest model", new BigDecimal("49999.00"), 5, "Electronics", null, null, null);

        when(productRepository.save(any(Product.class))).thenReturn(savedProduct);

        ProductDTO result = productService.createProduct(request);

        assertNotNull(result);
        assertEquals(2L, result.getId());
        assertEquals("New Phone", result.getName());
        verify(productRepository, times(1)).save(any(Product.class));
    }
}
