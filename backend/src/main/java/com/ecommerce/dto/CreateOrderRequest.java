package com.ecommerce.dto;

public class CreateOrderRequest {

    private String couponCode;

    public CreateOrderRequest() {
    }

    public CreateOrderRequest(String couponCode) {
        this.couponCode = couponCode;
    }

    public String getCouponCode() {
        return couponCode;
    }

    public void setCouponCode(String couponCode) {
        this.couponCode = couponCode;
    }
}
