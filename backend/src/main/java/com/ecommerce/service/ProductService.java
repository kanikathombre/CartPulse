package com.ecommerce.service;

import com.ecommerce.dto.ProductDTO;
import com.ecommerce.dto.ProductRequest;
import com.ecommerce.entity.Product;
import com.ecommerce.exception.ResourceNotFoundException;
import com.ecommerce.repository.ProductRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.util.List;
import java.util.stream.Collectors;

/**
 * Service layer class containing business logic for Product operations.
 * 
 * INTERVIEW NOTE:
 * @Service marks this class as a Spring Service Component holding business logic.
 * Constructor-based Dependency Injection is used here: Spring injects ProductRepository via constructor.
 * Why Constructor Injection over @Autowired on fields?
 * 1. Immutability: Fields can be declared 'final'.
 * 2. Ease of Unit Testing: We can easily pass mock objects (Mockito) in test constructors without Spring reflection context.
 * 3. Prevents Circular Dependencies: Detected at compile/startup time.
 */
@Service
public class ProductService {

    private final ProductRepository productRepository;

    // Constructor-based Dependency Injection
    public ProductService(ProductRepository productRepository) {
        this.productRepository = productRepository;
    }

    /**
     * Get all products with optional filters (category, search name keyword, min price, max price).
     */
    @Transactional(readOnly = true)
    public List<ProductDTO> searchProducts(String category, String name, BigDecimal minPrice, BigDecimal maxPrice) {
        List<Product> products = productRepository.searchProducts(category, name, minPrice, maxPrice);
        return products.stream()
                .map(ProductDTO::fromEntity)
                .collect(Collectors.toList());
    }

    /**
     * Get a single product by ID.
     */
    @Transactional(readOnly = true)
    public ProductDTO getProductById(Long id) {
        Product product = productRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Product not found with id: " + id));
        return ProductDTO.fromEntity(product);
    }

    /**
     * Create a new product.
     */
    @Transactional
    public ProductDTO createProduct(ProductRequest request) {
        Product product = new Product(
                request.getName(),
                request.getDescription(),
                request.getPrice(),
                request.getStock(),
                request.getCategory(),
                request.getImageUrl()
        );
        Product savedProduct = productRepository.save(product);
        return ProductDTO.fromEntity(savedProduct);
    }

    /**
     * Update an existing product.
     */
    @Transactional
    public ProductDTO updateProduct(Long id, ProductRequest request) {
        Product product = productRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Product not found with id: " + id));

        product.setName(request.getName());
        product.setDescription(request.getDescription());
        product.setPrice(request.getPrice());
        product.setStock(request.getStock());
        product.setCategory(request.getCategory());
        if (request.getImageUrl() != null) {
            product.setImageUrl(request.getImageUrl());
        }

        Product updatedProduct = productRepository.save(product);
        return ProductDTO.fromEntity(updatedProduct);
    }

    /**
     * Delete a product by ID.
     */
    @Transactional
    public void deleteProduct(Long id) {
        if (!productRepository.existsById(id)) {
            throw new ResourceNotFoundException("Product not found with id: " + id);
        }
        productRepository.deleteById(id);
    }

    /**
     * Fetch entity directly for internal service layer use (e.g. Cart, Order placement).
     */
    @Transactional(readOnly = true)
    public Product getProductEntityById(Long id) {
        return productRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Product not found with id: " + id));
    }
}
