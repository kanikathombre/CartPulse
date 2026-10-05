package com.ecommerce.config;

import com.ecommerce.security.JwtAuthenticationFilter;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.http.HttpMethod;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.config.annotation.authentication.configuration.AuthenticationConfiguration;
import org.springframework.security.config.annotation.method.configuration.EnableMethodSecurity;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity;
import org.springframework.security.config.http.SessionCreationPolicy;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.security.web.SecurityFilterChain;
import org.springframework.security.web.authentication.UsernamePasswordAuthenticationFilter;

/**
 * Spring Security 6 Configuration.
 *
 * Configures:
 * - JWT authentication
 * - Stateless sessions
 * - Password encoding
 * - Role-based access control
 * - Endpoint access rules
 */
@Configuration
@EnableWebSecurity
@EnableMethodSecurity
public class SecurityConfig {

    private final JwtAuthenticationFilter jwtAuthFilter;

    public SecurityConfig(JwtAuthenticationFilter jwtAuthFilter) {
        this.jwtAuthFilter = jwtAuthFilter;
    }

    /**
     * Password encoder used for securely hashing user passwords.
     */
    @Bean
    public PasswordEncoder passwordEncoder() {
        return new BCryptPasswordEncoder();
    }

    /**
     * AuthenticationManager used by the authentication service
     * during login.
     */
    @Bean
    public AuthenticationManager authenticationManager(
            AuthenticationConfiguration config) throws Exception {
        return config.getAuthenticationManager();
    }

    /**
     * Main Spring Security filter chain.
     */
    @Bean
    public SecurityFilterChain securityFilterChain(
            HttpSecurity http) throws Exception {

        http

                // Disable CSRF because this is a stateless REST API
                .csrf(csrf -> csrf.disable())

                // Enable CORS
                .cors(cors -> cors.configure(http))

                // JWT authentication is stateless
                .sessionManagement(session -> session.sessionCreationPolicy(
                        SessionCreationPolicy.STATELESS))

                .authorizeHttpRequests(auth -> auth

                        // =====================================================
                        // PUBLIC ENDPOINTS
                        // =====================================================

                        .requestMatchers(
                                "/api/auth/**",
                                "/api/health")
                        .permitAll()

                        // Product browsing is public
                        .requestMatchers(
                                HttpMethod.GET,
                                "/api/products/**")
                        .permitAll()

                        // Swagger / OpenAPI
                        .requestMatchers(
                                "/v3/api-docs/**",
                                "/swagger-ui/**",
                                "/swagger-ui.html")
                        .permitAll()

                        // =====================================================
                        // COUPON VALIDATION
                        // =====================================================
                        // Logged-in users and admins can validate coupons.
                        //
                        // IMPORTANT:
                        // This rule must appear before the admin-only
                        // coupon management rules.
                        // =====================================================

                        .requestMatchers(
                                HttpMethod.POST,
                                "/api/coupons/validate")
                        .authenticated()

                        // =====================================================
                        // ADMIN-ONLY PRODUCT MANAGEMENT
                        // =====================================================

                        .requestMatchers(
                                HttpMethod.POST,
                                "/api/products/**")
                        .hasAuthority("ROLE_ADMIN")

                        .requestMatchers(
                                HttpMethod.PUT,
                                "/api/products/**")
                        .hasAuthority("ROLE_ADMIN")

                        .requestMatchers(
                                HttpMethod.DELETE,
                                "/api/products/**")
                        .hasAuthority("ROLE_ADMIN")

                        // =====================================================
                        // ADMIN-ONLY ADMIN APIs
                        // =====================================================

                        .requestMatchers(
                                "/api/admin/**")
                        .hasAuthority("ROLE_ADMIN")

                        // =====================================================
                        // ADMIN-ONLY COUPON MANAGEMENT
                        // =====================================================

                        // Creating coupons
                        .requestMatchers(
                                HttpMethod.POST,
                                "/api/coupons")
                        .hasAuthority("ROLE_ADMIN")

                        // Updating coupons
                        .requestMatchers(
                                HttpMethod.PUT,
                                "/api/coupons/**")
                        .hasAuthority("ROLE_ADMIN")

                        // Deleting coupons
                        .requestMatchers(
                                HttpMethod.DELETE,
                                "/api/coupons/**")
                        .hasAuthority("ROLE_ADMIN")

                        // =====================================================
                        // AUTHENTICATED USER + ADMIN ENDPOINTS
                        // =====================================================

                        // Shopping cart
                        .requestMatchers(
                                "/api/cart/**")
                        .authenticated()

                        // Orders
                        .requestMatchers(
                                "/api/orders/**")
                        .authenticated()

                        // Viewing coupons
                        .requestMatchers(
                                HttpMethod.GET,
                                "/api/coupons/**")
                        .authenticated()

                        // =====================================================
                        // DEFAULT RULE
                        // =====================================================

                        // Everything else requires authentication
                        .anyRequest().authenticated())

                // Run our JWT filter before Spring Security's
                // username/password authentication filter.
                .addFilterBefore(
                        jwtAuthFilter,
                        UsernamePasswordAuthenticationFilter.class);

        return http.build();
    }
}