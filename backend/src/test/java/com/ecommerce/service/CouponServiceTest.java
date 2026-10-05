package com.ecommerce.service;

import com.ecommerce.dto.CouponValidationResponse;
import com.ecommerce.entity.Coupon;
import com.ecommerce.exception.InvalidCouponException;
import com.ecommerce.repository.CouponRepository;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.Optional;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
class CouponServiceTest {

    @Mock
    private CouponRepository couponRepository;

    @InjectMocks
    private CouponService couponService;

    private Coupon validCoupon;

    @BeforeEach
    void setUp() {
        validCoupon = new Coupon(
                1L,
                "SAVE10",
                10.0,
                new BigDecimal("1000.00"),
                new BigDecimal("500.00"),
                LocalDateTime.now().plusDays(30),
                true
        );
    }

    @Test
    @DisplayName("validateCoupon should return correct discount when coupon is valid")
    void validateCoupon_Success() {
        when(couponRepository.findByCodeIgnoreCase("SAVE10")).thenReturn(Optional.of(validCoupon));

        CouponValidationResponse response = couponService.validateCoupon("SAVE10", new BigDecimal("2000.00"));

        assertNotNull(response);
        assertTrue(response.isValid());
        assertEquals(new BigDecimal("200.00"), response.getCalculatedDiscount());
        assertEquals(new BigDecimal("1800.00"), response.getFinalAmount());
    }

    @Test
    @DisplayName("validateCoupon should throw InvalidCouponException when order does not satisfy minimum order amount")
    void validateCoupon_BelowMinimumAmount() {
        when(couponRepository.findByCodeIgnoreCase("SAVE10")).thenReturn(Optional.of(validCoupon));

        assertThrows(InvalidCouponException.class, () -> couponService.validateCoupon("SAVE10", new BigDecimal("500.00")));
    }

    @Test
    @DisplayName("validateCoupon should cap discount at maximumDiscount limit")
    void validateCoupon_MaxDiscountCapped() {
        // 10% of 10,000 is 1000, but max discount is capped at 500
        when(couponRepository.findByCodeIgnoreCase("SAVE10")).thenReturn(Optional.of(validCoupon));

        CouponValidationResponse response = couponService.validateCoupon("SAVE10", new BigDecimal("10000.00"));

        assertEquals(new BigDecimal("500.00"), response.getCalculatedDiscount());
        assertEquals(new BigDecimal("9500.00"), response.getFinalAmount());
    }
}
