package com.ecommerce.service;

import com.ecommerce.dto.CouponDTO;
import com.ecommerce.dto.CouponRequest;
import com.ecommerce.dto.CouponValidationResponse;
import com.ecommerce.entity.Coupon;
import com.ecommerce.exception.InvalidCouponException;
import com.ecommerce.exception.ResourceNotFoundException;
import com.ecommerce.repository.CouponRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.math.RoundingMode;
import java.time.LocalDateTime;
import java.util.List;
import java.util.stream.Collectors;

/**
 * Service containing business logic for discount coupon operations and validation rules.
 */
@Service
public class CouponService {

    private final CouponRepository couponRepository;

    public CouponService(CouponRepository couponRepository) {
        this.couponRepository = couponRepository;
    }

    @Transactional(readOnly = true)
    public List<CouponDTO> getAllCoupons() {
        return couponRepository.findAll().stream()
                .map(CouponDTO::fromEntity)
                .collect(Collectors.toList());
    }

    @Transactional(readOnly = true)
    public CouponDTO getCouponById(Long id) {
        Coupon coupon = couponRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Coupon not found with id: " + id));
        return CouponDTO.fromEntity(coupon);
    }

    @Transactional
    public CouponDTO createCoupon(CouponRequest request) {
        if (couponRepository.existsByCodeIgnoreCase(request.getCode())) {
            throw new IllegalArgumentException("Coupon code already exists: " + request.getCode());
        }

        Coupon coupon = new Coupon(
                request.getCode(),
                request.getDiscountPercentage(),
                request.getMinimumOrderAmount(),
                request.getMaximumDiscount(),
                request.getExpiryDate(),
                request.isActive()
        );

        Coupon savedCoupon = couponRepository.save(coupon);
        return CouponDTO.fromEntity(savedCoupon);
    }

    @Transactional
    public CouponDTO updateCoupon(Long id, CouponRequest request) {
        Coupon coupon = couponRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Coupon not found with id: " + id));

        coupon.setCode(request.getCode());
        coupon.setDiscountPercentage(request.getDiscountPercentage());
        coupon.setMinimumOrderAmount(request.getMinimumOrderAmount());
        coupon.setMaximumDiscount(request.getMaximumDiscount());
        coupon.setExpiryDate(request.getExpiryDate());
        coupon.setActive(request.isActive());

        Coupon updatedCoupon = couponRepository.save(coupon);
        return CouponDTO.fromEntity(updatedCoupon);
    }

    @Transactional
    public void deleteCoupon(Long id) {
        if (!couponRepository.existsById(id)) {
            throw new ResourceNotFoundException("Coupon not found with id: " + id);
        }
        couponRepository.deleteById(id);
    }

    /**
     * Validates coupon eligibility and calculates discount amount.
     * 
     * Rules checked:
     * 1. Coupon exists
     * 2. Coupon is active
     * 3. Expiry date has not passed
     * 4. Order subtotal satisfies minimum order amount
     */
    @Transactional(readOnly = true)
    public CouponValidationResponse validateCoupon(String code, BigDecimal orderAmount) {
        if (code == null || code.trim().isEmpty()) {
            throw new InvalidCouponException("Coupon code cannot be empty");
        }

        Coupon coupon = couponRepository.findByCodeIgnoreCase(code.trim())
                .orElseThrow(() -> new InvalidCouponException("Invalid coupon code: " + code));

        if (!coupon.isActive()) {
            throw new InvalidCouponException("Coupon is no longer active: " + code);
        }

        if (coupon.getExpiryDate().isBefore(LocalDateTime.now())) {
            throw new InvalidCouponException("Coupon has expired: " + code);
        }

        if (orderAmount.compareTo(coupon.getMinimumOrderAmount()) < 0) {
            throw new InvalidCouponException("Minimum order amount of ₹" + coupon.getMinimumOrderAmount() + " required to use coupon " + code);
        }

        // Calculate discount: orderAmount * (discountPercentage / 100)
        BigDecimal percentage = BigDecimal.valueOf(coupon.getDiscountPercentage()).divide(BigDecimal.valueOf(100), 4, RoundingMode.HALF_UP);
        BigDecimal discount = orderAmount.multiply(percentage).setScale(2, RoundingMode.HALF_UP);

        // Cap discount if maximum discount is specified
        if (coupon.getMaximumDiscount() != null && discount.compareTo(coupon.getMaximumDiscount()) > 0) {
            discount = coupon.getMaximumDiscount();
        }

        BigDecimal finalAmount = orderAmount.subtract(discount);
        if (finalAmount.compareTo(BigDecimal.ZERO) < 0) {
            finalAmount = BigDecimal.ZERO;
        }

        return new CouponValidationResponse(
                coupon.getCode(),
                coupon.getDiscountPercentage(),
                discount,
                finalAmount,
                true,
                "Coupon applied successfully!"
        );
    }

    @Transactional(readOnly = true)
    public Coupon getCouponEntityByCode(String code) {
        return couponRepository.findByCodeIgnoreCase(code)
                .orElseThrow(() -> new InvalidCouponException("Coupon not found with code: " + code));
    }
}
