package com.ecommerce.dto;

import com.ecommerce.entity.Coupon;

import java.math.BigDecimal;
import java.time.LocalDateTime;

public class CouponDTO {

    private Long id;
    private String code;
    private Double discountPercentage;
    private BigDecimal minimumOrderAmount;
    private BigDecimal maximumDiscount;
    private LocalDateTime expiryDate;
    private boolean active;

    public CouponDTO() {
    }

    public CouponDTO(Long id, String code, Double discountPercentage, BigDecimal minimumOrderAmount, BigDecimal maximumDiscount, LocalDateTime expiryDate, boolean active) {
        this.id = id;
        this.code = code;
        this.discountPercentage = discountPercentage;
        this.minimumOrderAmount = minimumOrderAmount;
        this.maximumDiscount = maximumDiscount;
        this.expiryDate = expiryDate;
        this.active = active;
    }

    public static CouponDTO fromEntity(Coupon coupon) {
        if (coupon == null) return null;
        return new CouponDTO(
                coupon.getId(),
                coupon.getCode(),
                coupon.getDiscountPercentage(),
                coupon.getMinimumOrderAmount(),
                coupon.getMaximumDiscount(),
                coupon.getExpiryDate(),
                coupon.isActive()
        );
    }

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
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

    public BigDecimal getMinimumOrderAmount() {
        return minimumOrderAmount;
    }

    public void setMinimumOrderAmount(BigDecimal minimumOrderAmount) {
        this.minimumOrderAmount = minimumOrderAmount;
    }

    public BigDecimal getMaximumDiscount() {
        return maximumDiscount;
    }

    public void setMaximumDiscount(BigDecimal maximumDiscount) {
        this.maximumDiscount = maximumDiscount;
    }

    public LocalDateTime getExpiryDate() {
        return expiryDate;
    }

    public void setExpiryDate(LocalDateTime expiryDate) {
        this.expiryDate = expiryDate;
    }

    public boolean isActive() {
        return active;
    }

    public void setActive(boolean active) {
        this.active = active;
    }
}
