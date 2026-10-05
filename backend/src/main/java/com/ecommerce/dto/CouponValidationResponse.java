package com.ecommerce.dto;

import java.math.BigDecimal;

public class CouponValidationResponse {

    private String code;
    private Double discountPercentage;
    private BigDecimal calculatedDiscount;
    private BigDecimal finalAmount;
    private boolean valid;
    private String message;

    public CouponValidationResponse() {
    }

    public CouponValidationResponse(String code, Double discountPercentage, BigDecimal calculatedDiscount, BigDecimal finalAmount, boolean valid, String message) {
        this.code = code;
        this.discountPercentage = discountPercentage;
        this.calculatedDiscount = calculatedDiscount;
        this.finalAmount = finalAmount;
        this.valid = valid;
        this.message = message;
    }

    public String getCode() {
        return code;
    }

    public void setCode(String code) {
        this.code = code;
    }

    public Double getDiscountPercentage() {
        return discountPercentage;
    }

    public void setDiscountPercentage(Double discountPercentage) {
        this.discountPercentage = discountPercentage;
    }

    public BigDecimal getCalculatedDiscount() {
        return calculatedDiscount;
    }

    public void setCalculatedDiscount(BigDecimal calculatedDiscount) {
        this.calculatedDiscount = calculatedDiscount;
    }

    public BigDecimal getFinalAmount() {
        return finalAmount;
    }

    public void setFinalAmount(BigDecimal finalAmount) {
        this.finalAmount = finalAmount;
    }

    public boolean isValid() {
        return valid;
    }

    public void setValid(boolean valid) {
        this.valid = valid;
    }

    public String getMessage() {
        return message;
    }

    public void setMessage(String message) {
        this.message = message;
    }
}
