package com.ecommerce.exception;

/**
 * Custom exception thrown when a coupon is invalid, expired, inactive, or fails minimum order criteria.
 */
public class InvalidCouponException extends RuntimeException {

    public InvalidCouponException(String message) {
        super(message);
    }
}
