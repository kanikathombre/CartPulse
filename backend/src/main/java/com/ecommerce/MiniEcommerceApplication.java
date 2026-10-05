package com.ecommerce;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;

/**
 * Main entry point for the Mini E-Commerce Spring Boot Application.
 * 
 * INTERVIEW NOTE:
 * @SpringBootApplication is a convenience annotation that combines three key annotations:
 * 1. @Configuration: Tags the class as a source of bean definitions for the application context.
 * 2. @EnableAutoConfiguration: Tells Spring Boot to automatically configure beans based on classpath settings (e.g., setting up DataSource when mysql-connector is present).
 * 3. @ComponentScan: Scans the current package (com.ecommerce) and its sub-packages for Spring components like @RestController, @Service, and @Repository.
 */
@SpringBootApplication
public class MiniEcommerceApplication {

    public static void main(String[] args) {
        SpringApplication.run(MiniEcommerceApplication.class, args);
    }
}
