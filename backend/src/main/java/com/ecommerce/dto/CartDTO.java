package com.ecommerce.dto;

import com.ecommerce.entity.Cart;

import java.math.BigDecimal;
import java.util.ArrayList;
import java.util.List;
import java.util.stream.Collectors;

public class CartDTO {

    private Long id;
    private Long userId;
    private List<CartItemDTO> items = new ArrayList<>();
    private BigDecimal subtotal;

    public CartDTO() {
    }

    public CartDTO(Long id, Long userId, List<CartItemDTO> items, BigDecimal subtotal) {
        this.id = id;
        this.userId = userId;
        this.items = items;
        this.subtotal = subtotal;
    }

    public static CartDTO fromEntity(Cart cart) {
        if (cart == null) return null;
        List<CartItemDTO> itemDTOs = cart.getItems().stream()
                .map(CartItemDTO::fromEntity)
                .collect(Collectors.toList());
        return new CartDTO(
                cart.getId(),
                cart.getUser().getId(),
                itemDTOs,
                cart.calculateSubtotal()
        );
    }

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public Long getUserId() {
        return userId;
    }

    public void setUserId(Long userId) {
        this.userId = userId;
    }

    public List<CartItemDTO> getItems() {
        return items;
    }

    public void setItems(List<CartItemDTO> items) {
        this.items = items;
    }

    public BigDecimal getSubtotal() {
        return subtotal;
    }

    public void setSubtotal(BigDecimal subtotal) {
        this.subtotal = subtotal;
    }
}
