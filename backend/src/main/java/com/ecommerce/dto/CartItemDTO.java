package com.ecommerce.dto;

import com.ecommerce.entity.CartItem;

import java.math.BigDecimal;

public class CartItemDTO {

    private Long id;
    private Long productId;
    private String productName;
    private BigDecimal productPrice;
    private String imageUrl;
    private Integer quantity;
    private BigDecimal subtotal;

    public CartItemDTO() {
    }

    public CartItemDTO(Long id, Long productId, String productName, BigDecimal productPrice, String imageUrl, Integer quantity, BigDecimal subtotal) {
        this.id = id;
        this.productId = productId;
        this.productName = productName;
        this.productPrice = productPrice;
        this.imageUrl = imageUrl;
        this.quantity = quantity;
        this.subtotal = subtotal;
    }

    public static CartItemDTO fromEntity(CartItem item) {
        if (item == null) return null;
        return new CartItemDTO(
                item.getId(),
                item.getProduct().getId(),
                item.getProduct().getName(),
                item.getProduct().getPrice(),
                item.getProduct().getImageUrl(),
                item.getQuantity(),
                item.getSubtotal()
        );
    }

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public Long getProductId() {
        return productId;
    }

    public void setProductId(Long productId) {
        this.productId = productId;
    }

    public String getProductName() {
        return productName;
    }

    public void setProductName(String productName) {
        this.productName = productName;
    }

    public BigDecimal getProductPrice() {
        return productPrice;
    }

    public void setProductPrice(BigDecimal productPrice) {
        this.productPrice = productPrice;
    }

    public String getImageUrl() {
        return imageUrl;
    }

    public void setImageUrl(String imageUrl) {
        this.imageUrl = imageUrl;
    }

    public Integer getQuantity() {
        return quantity;
    }

    public void setQuantity(Integer quantity) {
        this.quantity = quantity;
    }

    public BigDecimal getSubtotal() {
        return subtotal;
    }

    public void setSubtotal(BigDecimal subtotal) {
        this.subtotal = subtotal;
    }
}
