package com.ecommerce.repository;

import com.ecommerce.entity.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

/**
 * Spring Data JPA Repository for User entity.
 */
@Repository
public interface UserRepository extends JpaRepository<User, Long> {

    // Derived Query Method to find user by unique email address
    Optional<User> findByEmail(String email);

    // Derived Query Method to check if email already exists during registration
    boolean existsByEmail(String email);
}
