package com.ecommerce.exception;

/**
 * Custom exception thrown when requested item quantity exceeds available product stock.
 */
public class InsufficientStockException extends RuntimeException {

    public InsufficientStockException(String message) {
        super(message);
    }
}
