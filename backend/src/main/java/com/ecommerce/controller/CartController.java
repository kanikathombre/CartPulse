package com.ecommerce.controller;

import com.ecommerce.dto.AddToCartRequest;
import com.ecommerce.dto.CartDTO;
import com.ecommerce.dto.UpdateCartItemRequest;
import com.ecommerce.entity.User;
import com.ecommerce.service.AuthService;
import com.ecommerce.service.CartService;
import jakarta.validation.Valid;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

/**
 * Controller exposing REST APIs for Cart Operations.
 */
@RestController
@RequestMapping("/api/cart")
@CrossOrigin(origins = "*")
public class CartController {

    private final CartService cartService;
    private final AuthService authService;

    public CartController(CartService cartService, AuthService authService) {
        this.cartService = cartService;
        this.authService = authService;
    }

    private User getAuthenticatedUser(Authentication authentication) {
        String email = authentication.getName();
        return authService.getUserEntityByEmail(email);
    }

    /**
     * GET /api/cart
     */
    @GetMapping
    public ResponseEntity<CartDTO> getCart(Authentication authentication) {
        User user = getAuthenticatedUser(authentication);
        CartDTO cart = cartService.getCartByUser(user);
        return ResponseEntity.ok(cart);
    }

    /**
     * POST /api/cart/items
     */
    @PostMapping("/items")
    public ResponseEntity<CartDTO> addToCart(
            Authentication authentication,
            @Valid @RequestBody AddToCartRequest request
    ) {
        User user = getAuthenticatedUser(authentication);
        CartDTO cart = cartService.addToCart(user, request);
        return ResponseEntity.ok(cart);
    }

    /**
     * PUT /api/cart/items/{itemId}
     */
    @PutMapping("/items/{itemId}")
    public ResponseEntity<CartDTO> updateItemQuantity(
            Authentication authentication,
            @PathVariable Long itemId,
            @Valid @RequestBody UpdateCartItemRequest request
    ) {
        User user = getAuthenticatedUser(authentication);
        CartDTO cart = cartService.updateCartItemQuantity(user, itemId, request);
        return ResponseEntity.ok(cart);
    }

    /**
     * DELETE /api/cart/items/{itemId}
     */
    @DeleteMapping("/items/{itemId}")
    public ResponseEntity<CartDTO> removeItem(
            Authentication authentication,
            @PathVariable Long itemId
    ) {
        User user = getAuthenticatedUser(authentication);
        CartDTO cart = cartService.removeCartItem(user, itemId);
        return ResponseEntity.ok(cart);
    }

    /**
     * DELETE /api/cart
     */
    @DeleteMapping
    public ResponseEntity<CartDTO> clearCart(Authentication authentication) {
        User user = getAuthenticatedUser(authentication);
        CartDTO cart = cartService.clearCart(user);
        return ResponseEntity.ok(cart);
    }
}
