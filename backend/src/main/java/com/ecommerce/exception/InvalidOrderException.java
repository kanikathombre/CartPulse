package com.ecommerce.exception;

/**
 * Custom exception thrown when order business rules are violated (e.g. empty cart, cancelling delivered order).
 */
public class InvalidOrderException extends RuntimeException {

    public InvalidOrderException(String message) {
        super(message);
    }
}
