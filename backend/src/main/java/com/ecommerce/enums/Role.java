package com.ecommerce.enums;

/**
 * Enumeration representing user security roles.
 * 
 * INTERVIEW NOTE:
 * Prefixing roles with 'ROLE_' (e.g. ROLE_USER, ROLE_ADMIN) is standard convention in Spring Security
 * when working with authority/role checkers like hasRole('ADMIN') or hasAuthority('ROLE_ADMIN').
 */
public enum Role {
    ROLE_USER,
    ROLE_ADMIN
}
