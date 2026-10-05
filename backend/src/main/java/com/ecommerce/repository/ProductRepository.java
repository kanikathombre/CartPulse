package com.ecommerce.repository;

import com.ecommerce.entity.Product;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.math.BigDecimal;
import java.util.List;

/**
 * Spring Data JPA Repository for Product entity.
 * 
 * INTERVIEW NOTE:
 * @Repository marks this interface as a Data Access Object (DAO). Spring automatically creates an implementation
 * of this interface at runtime via Proxy patterns.
 * By extending JpaRepository<Product, Long>, we automatically gain full CRUD methods (save, findById, findAll, deleteById, count)
 * without writing any SQL queries!
 * 
 * We also use Spring Data JPA Derived Query Methods and JPQL @Query to handle search, category filtering, and price range filtering.
 */
@Repository
public interface ProductRepository extends JpaRepository<Product, Long> {

    // Derived Query Method: Spring Data JPA automatically parses the method name to construct SQL:
    // SELECT * FROM products WHERE LOWER(category) = LOWER(?1)
    List<Product> findByCategoryIgnoreCase(String category);

    // Derived Query Method: Searches product name containing the keyword (case-insensitive)
    // SELECT * FROM products WHERE LOWER(name) LIKE %?1%
    List<Product> findByNameContainingIgnoreCase(String name);

    // Derived Query Method: Finds products with price between minPrice and maxPrice
    List<Product> findByPriceBetween(BigDecimal minPrice, BigDecimal maxPrice);

    // JPQL (Java Persistence Query Language) Custom Query for flexible multi-criteria search
    // Allows combining category, name keyword, minPrice, and maxPrice filtering seamlessly!
    @Query("SELECT p FROM Product p WHERE " +
           "(:category IS NULL OR :category = '' OR LOWER(p.category) = LOWER(:category)) AND " +
           "(:name IS NULL OR :name = '' OR LOWER(p.name) LIKE LOWER(CONCAT('%', :name, '%'))) AND " +
           "(:minPrice IS NULL OR p.price >= :minPrice) AND " +
           "(:maxPrice IS NULL OR p.price <= :maxPrice)")
    List<Product> searchProducts(
            @Param("category") String category,
            @Param("name") String name,
            @Param("minPrice") BigDecimal minPrice,
            @Param("maxPrice") BigDecimal maxPrice
    );
}
