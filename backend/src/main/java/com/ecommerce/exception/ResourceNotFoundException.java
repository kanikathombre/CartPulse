package com.ecommerce.exception;

/**
 * Custom runtime exception thrown when a requested database resource (e.g. Product, User, Order) is not found.
 */
public class ResourceNotFoundException extends RuntimeException {
    
    public ResourceNotFoundException(String message) {
        super(message);
    }
}
