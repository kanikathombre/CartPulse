package com.ecommerce.entity;

import jakarta.persistence.*;
import java.math.BigDecimal;

/**
 * Entity representing an individual item within an Order.
 * Maps to the 'order_items' table in MySQL.
 * 
 * INTERVIEW NOTE:
 * Price Snapshot Pattern:
 * Notice the 'priceAtPurchase' column! When a customer places an order, we MUST store the product's price
 * at that exact moment. If the product price changes in the catalog later (e.g. from ₹1000 to ₹1500),
 * the historical order item MUST retain the purchase price of ₹1000.
 */
@Entity
@Table(name = "order_items")
public class OrderItem {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "order_id", nullable = false)
    private Order order;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "product_id", nullable = false)
    private Product product;

    @Column(nullable = false)
    private Integer quantity;

    @Column(name = "price_at_purchase", nullable = false, precision = 10, scale = 2)
    private BigDecimal priceAtPurchase;

    public OrderItem() {
    }

    public OrderItem(Order order, Product product, Integer quantity, BigDecimal priceAtPurchase) {
        this.order = order;
        this.product = product;
        this.quantity = quantity;
        this.priceAtPurchase = priceAtPurchase;
    }

    public BigDecimal getSubtotal() {
        if (priceAtPurchase == null || quantity == null) {
            return BigDecimal.ZERO;
        }
        return priceAtPurchase.multiply(BigDecimal.valueOf(quantity));
    }

    // Getters and Setters
    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public Order getOrder() {
        return order;
    }

    public void setOrder(Order order) {
        this.order = order;
    }

    public Product getProduct() {
        return product;
    }

    public void setProduct(Product product) {
        this.product = product;
    }

    public Integer getQuantity() {
        return quantity;
    }

    public void setQuantity(Integer quantity) {
        this.quantity = quantity;
    }

    public BigDecimal getPriceAtPurchase() {
        return priceAtPurchase;
    }

    public void setPriceAtPurchase(BigDecimal priceAtPurchase) {
        this.priceAtPurchase = priceAtPurchase;
    }
}
