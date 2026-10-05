package com.ecommerce.service;

import com.ecommerce.dto.AddToCartRequest;
import com.ecommerce.dto.CartDTO;
import com.ecommerce.dto.UpdateCartItemRequest;
import com.ecommerce.entity.Cart;
import com.ecommerce.entity.CartItem;
import com.ecommerce.entity.Product;
import com.ecommerce.entity.User;
import com.ecommerce.exception.InsufficientStockException;
import com.ecommerce.exception.ResourceNotFoundException;
import com.ecommerce.repository.CartItemRepository;
import com.ecommerce.repository.CartRepository;
import com.ecommerce.repository.ProductRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.Optional;

/**
 * Service managing user shopping cart operations.
 */
@Service
public class CartService {

    private final CartRepository cartRepository;
    private final CartItemRepository cartItemRepository;
    private final ProductRepository productRepository;

    public CartService(CartRepository cartRepository, CartItemRepository cartItemRepository, ProductRepository productRepository) {
        this.cartRepository = cartRepository;
        this.cartItemRepository = cartItemRepository;
        this.productRepository = productRepository;
    }

    /**
     * Get or create a cart for the specified user.
     */
    @Transactional
    public Cart getOrCreateCartEntity(User user) {
        return cartRepository.findByUser(user)
                .orElseGet(() -> cartRepository.save(new Cart(user)));
    }

    @Transactional
    public CartDTO getCartByUser(User user) {
        Cart cart = getOrCreateCartEntity(user);
        return CartDTO.fromEntity(cart);
    }

    /**
     * Add a product to the user's cart or increase quantity if already present.
     */
    @Transactional
    public CartDTO addToCart(User user, AddToCartRequest request) {
        Product product = productRepository.findById(request.getProductId())
                .orElseThrow(() -> new ResourceNotFoundException("Product not found with id: " + request.getProductId()));

        if (product.getStock() < request.getQuantity()) {
            throw new InsufficientStockException("Requested quantity (" + request.getQuantity() + ") exceeds available stock (" + product.getStock() + ")");
        }

        Cart cart = getOrCreateCartEntity(user);

        // Check if item already exists in cart
        Optional<CartItem> existingItem = cart.getItems().stream()
                .filter(item -> item.getProduct().getId().equals(product.getId()))
                .findFirst();

        if (existingItem.isPresent()) {
            CartItem item = existingItem.get();
            int newQuantity = item.getQuantity() + request.getQuantity();
            if (product.getStock() < newQuantity) {
                throw new InsufficientStockException("Total cart quantity (" + newQuantity + ") exceeds available stock (" + product.getStock() + ")");
            }
            item.setQuantity(newQuantity);
        } else {
            CartItem newItem = new CartItem(cart, product, request.getQuantity());
            cart.addItem(newItem);
        }

        Cart savedCart = cartRepository.save(cart);
        return CartDTO.fromEntity(savedCart);
    }

    /**
     * Update quantity of a cart item.
     */
    @Transactional
    public CartDTO updateCartItemQuantity(User user, Long itemId, UpdateCartItemRequest request) {
        Cart cart = getOrCreateCartEntity(user);

        CartItem cartItem = cartItemRepository.findById(itemId)
                .orElseThrow(() -> new ResourceNotFoundException("Cart item not found with id: " + itemId));

        if (!cartItem.getCart().getId().equals(cart.getId())) {
            throw new IllegalArgumentException("Cart item does not belong to user's cart");
        }

        Product product = cartItem.getProduct();
        if (product.getStock() < request.getQuantity()) {
            throw new InsufficientStockException("Requested quantity (" + request.getQuantity() + ") exceeds available stock (" + product.getStock() + ")");
        }

        cartItem.setQuantity(request.getQuantity());
        Cart savedCart = cartRepository.save(cart);
        return CartDTO.fromEntity(savedCart);
    }

    /**
     * Remove an item from the cart.
     */
    @Transactional
    public CartDTO removeCartItem(User user, Long itemId) {
        Cart cart = getOrCreateCartEntity(user);

        CartItem cartItem = cartItemRepository.findById(itemId)
                .orElseThrow(() -> new ResourceNotFoundException("Cart item not found with id: " + itemId));

        if (!cartItem.getCart().getId().equals(cart.getId())) {
            throw new IllegalArgumentException("Cart item does not belong to user's cart");
        }

        cart.removeItem(cartItem);
        Cart savedCart = cartRepository.save(cart);
        return CartDTO.fromEntity(savedCart);
    }

    /**
     * Clear all items from cart.
     */
    @Transactional
    public CartDTO clearCart(User user) {
        Cart cart = getOrCreateCartEntity(user);
        cart.clearItems();
        Cart savedCart = cartRepository.save(cart);
        return CartDTO.fromEntity(savedCart);
    }
}
