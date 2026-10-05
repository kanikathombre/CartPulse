package com.ecommerce.exception;

/**
 * Custom exception thrown for authentication failures (e.g. invalid credentials).
 */
public class UnauthorizedException extends RuntimeException {

    public UnauthorizedException(String message) {
        super(message);
    }
}
