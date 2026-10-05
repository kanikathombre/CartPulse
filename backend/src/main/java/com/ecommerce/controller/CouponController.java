package com.ecommerce.controller;

import com.ecommerce.dto.CouponDTO;
import com.ecommerce.dto.CouponRequest;
import com.ecommerce.dto.CouponValidationRequest;
import com.ecommerce.dto.CouponValidationResponse;
import com.ecommerce.service.CouponService;
import jakarta.validation.Valid;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

/**
 * Controller exposing REST APIs for Coupons.
 */
@RestController
@RequestMapping("/api/coupons")
@CrossOrigin(origins = "*")
public class CouponController {

    private final CouponService couponService;

    public CouponController(CouponService couponService) {
        this.couponService = couponService;
    }

    /**
     * GET /api/coupons
     */
    @GetMapping
    public ResponseEntity<List<CouponDTO>> getAllCoupons() {
        List<CouponDTO> coupons = couponService.getAllCoupons();
        return ResponseEntity.ok(coupons);
    }

    /**
     * GET /api/coupons/{id}
     */
    @GetMapping("/{id}")
    public ResponseEntity<CouponDTO> getCouponById(@PathVariable Long id) {
        CouponDTO coupon = couponService.getCouponById(id);
        return ResponseEntity.ok(coupon);
    }

    /**
     * POST /api/coupons
     * (Admin feature)
     */
    @PostMapping
    public ResponseEntity<CouponDTO> createCoupon(@Valid @RequestBody CouponRequest request) {
        CouponDTO createdCoupon = couponService.createCoupon(request);
        return ResponseEntity.status(HttpStatus.CREATED).body(createdCoupon);
    }

    /**
     * PUT /api/coupons/{id}
     * (Admin feature)
     */
    @PutMapping("/{id}")
    public ResponseEntity<CouponDTO> updateCoupon(
            @PathVariable Long id,
            @Valid @RequestBody CouponRequest request
    ) {
        CouponDTO updatedCoupon = couponService.updateCoupon(id, request);
        return ResponseEntity.ok(updatedCoupon);
    }

    /**
     * DELETE /api/coupons/{id}
     * (Admin feature)
     */
    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteCoupon(@PathVariable Long id) {
        couponService.deleteCoupon(id);
        return ResponseEntity.noContent().build();
    }

    /**
     * POST /api/coupons/validate
     * Validates coupon code against order subtotal.
     */
    @PostMapping("/validate")
    public ResponseEntity<CouponValidationResponse> validateCoupon(@Valid @RequestBody CouponValidationRequest request) {
        CouponValidationResponse response = couponService.validateCoupon(request.getCode(), request.getOrderAmount());
        return ResponseEntity.ok(response);
    }
}
