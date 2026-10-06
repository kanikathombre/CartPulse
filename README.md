# CartPulse — E-Commerce System

A full-stack e-commerce management system built using **Java, Spring Boot, MySQL, Spring Security (JWT), and React.js**.

CartPulse is designed as a **modular monolith** that demonstrates clean backend architecture, REST API development, secure authentication, transactional order processing, product and cart management, and unit testing.

---

## 🏛️ System Architecture

```text
                    React.js Frontend
                           │
                           ▼
                    Axios API Client
                           │
                           ▼
              Spring Security + JWT
                           │
                           ▼
                   REST Controllers
                           │
                           ▼
                    Service Layer
                           │
                           ▼
                Spring Data JPA
                           │
                           ▼
                    MySQL Database
```

### Backend Structure

```text
Controller
    ↓
Service
    ↓
Repository
    ↓
JPA / Hibernate
    ↓
MySQL
```

The backend follows a layered architecture where controllers handle HTTP requests, services contain business logic, and repositories handle database operations.

---

## 🌟 Key Features

### 🔐 Authentication & Authorization

- JWT-based stateless authentication
- Role-based access control
- `ROLE_USER` and `ROLE_ADMIN`
- BCrypt password hashing
- Protected REST APIs using Spring Security

### 🛍️ Product Catalog

- Product listing and details
- Search by product name and description
- Category filtering
- Price range filtering
- Product stock management
- Admin product CRUD operations

### 🛒 Cart Management

- User-specific shopping carts
- Add products to cart
- Update item quantities
- Remove cart items
- Stock availability validation

### 🎟️ Coupon Management

- Percentage-based discounts
- Minimum order amount validation
- Coupon expiration validation
- Active/inactive coupon status
- Maximum discount limits
- Admin coupon management

### 📦 Order Processing

- Checkout from shopping cart
- Transactional order processing
- Stock reduction during checkout
- Order history
- Order status management
- Order cancellation
- Stock restoration after cancellation

### 💰 Price Snapshot

CartPulse uses a **price snapshot pattern** for order history.

When an order is placed, the product's current price is stored in `OrderItem.priceAtPurchase`.

This ensures that historical orders continue to show the original purchase price even if the product price changes later.

### 👨‍💼 Admin Dashboard

The admin dashboard provides:

- Total revenue
- Total orders
- Pending orders
- Total products
- Total users
- Product management
- Order status management
- Coupon management

---

## 🛠️ Technology Stack

### Backend

- Java 17+
- Spring Boot 3.2.5
- Spring Web
- Spring Data JPA
- Spring Security
- JJWT 0.12.5
- Hibernate
- MySQL
- Jakarta Bean Validation

### Frontend

- React 18
- Vite
- Axios
- React Router
- Vanilla CSS
- Lucide React

### Testing

- JUnit 5
- Mockito

### API Documentation

- SpringDoc OpenAPI
- Swagger UI

---

## 🔑 Key Technical Concepts

### Constructor-Based Dependency Injection

Services use constructor-based dependency injection with `final` dependencies.

This improves testability and avoids field injection.

### Transaction Management

Order checkout is handled using Spring's `@Transactional`.

The checkout process includes:

```text
Cart Validation
      ↓
Coupon Validation
      ↓
Stock Validation
      ↓
Stock Reduction
      ↓
Order Creation
      ↓
Cart Clearing
```

If an operation fails during the transaction, the database changes can be rolled back.

### Stateless JWT Security

The application uses:

```text
SessionCreationPolicy.STATELESS
```

Each authenticated request contains a JWT in the `Authorization` header.

The JWT authentication filter validates the token and establishes the user's security context.

### Global Exception Handling

`@RestControllerAdvice` is used to provide consistent error responses across REST APIs.

This prevents individual controllers from having to implement repetitive exception handling logic.

---

## 🚀 Getting Started

### Prerequisites

Make sure the following are installed:

- Java JDK 17 or later
- Node.js 18 or later
- npm
- MySQL 8.0 or later

---

## 1. Database Setup

Create the MySQL database:

```sql
CREATE DATABASE IF NOT EXISTS mini_ecommerce;
```

The application can also create the database automatically when configured accordingly.

---

## 2. Backend Configuration

Configure the backend using the provided:

```text
backend/.env.example
```

Example:

```properties
DB_URL=jdbc:mysql://localhost:3306/mini_ecommerce
DB_USERNAME=root
DB_PASSWORD=YOUR_MYSQL_PASSWORD

JWT_SECRET=your_secure_jwt_secret_at_least_32_characters
JWT_EXPIRATION_MS=86400000
```

Do not commit your actual `.env` file or database credentials.

---

## 3. Run the Backend

Open a terminal in the project root:

```bash
cd backend
.\mvnw.cmd spring-boot:run
```

The backend will run on:

```text
http://localhost:8080
```

### Run Backend Tests

```bash
.\mvnw.cmd test
```

---

## 4. Run the Frontend

Open another terminal:

```bash
cd frontend
npm install
npm run dev
```

The frontend runs on:

```text
http://localhost:3001
```

Frontend API configuration can be provided through:

```text
frontend/.env.example
```

Example:

```properties
VITE_API_BASE_URL=http://localhost:8080/api
```

---

## 5. Production Build

### Frontend

```bash
cd frontend
npm run build
```

### Backend

```bash
cd backend
.\mvnw.cmd clean package
```

---

## 🔐 Data Seeding

Data seeding is **disabled by default** for production safety.

For local development, it can be enabled through environment variables:

```properties
SEED_ENABLED=true
SEED_ADMIN_EMAIL=your_admin_email
SEED_ADMIN_PASSWORD=your_admin_password
SEED_USER_EMAIL=your_user_email
SEED_USER_PASSWORD=your_user_password
```

This allows test users and sample data to be configured without storing passwords directly in the source code.

---

## 📖 API Documentation

CartPulse provides interactive API documentation using Swagger UI.

When the backend is running:

```text
http://localhost:8080/swagger-ui/index.html
```

OpenAPI specification:

```text
http://localhost:8080/v3/api-docs
```

### Testing Protected APIs

1. Call `POST /api/auth/login`
2. Obtain the JWT token
3. Click **Authorize** in Swagger UI
4. Enter the JWT token
5. Test the protected endpoints

---

## 🧪 Testing

The backend contains service-level unit tests using **JUnit 5 and Mockito**.

Current tests cover areas such as:

- Cart operations
- Product operations
- Product filtering
- Stock validation
- Coupon validation
- Order checkout
- Order cancellation
- Stock restoration

Run all backend tests with:

```bash
cd backend
.\mvnw.cmd test
```

---

## 📌 API Modules

The application currently provides REST APIs for:

| Module | Description |
|---|---|
| Authentication | Registration, login and current user |
| Products | Product catalog, search and filtering |
| Cart | Cart and cart item management |
| Coupons | Coupon validation and administration |
| Orders | Checkout, order history and status management |
| Admin | Dashboard statistics and administration |
| Health | Backend health check |

---

## 💡 Interview Highlights

CartPulse demonstrates practical experience with:

- Java and Spring Boot
- REST API development
- Spring Data JPA
- Hibernate
- MySQL
- Spring Security
- JWT authentication
- Role-based authorization
- Constructor-based dependency injection
- `@Transactional`
- Global exception handling
- Stock management
- Price snapshot pattern
- JUnit and Mockito
- React and Axios
- Modular monolith architecture

---

## 📁 Project Structure

```text
CartPulse/
│
├── backend/
│   ├── src/
│   │   ├── main/
│   │   │   ├── java/
│   │   │   │   └── com/ecommerce/
│   │   │   └── resources/
│   │   └── test/
│   ├── pom.xml
│   └── mvnw.cmd
│
├── frontend/
│   ├── src/
│   │   ├── components/
│   │   ├── pages/
│   │   ├── services/
│   │   └── ...
│   ├── package.json
│   └── vite.config.js
│
├── .gitignore
└── README.md
```

---

## 🚫 Project Scope

CartPulse intentionally follows a simple modular-monolith architecture without introducing unnecessary infrastructure such as:

- Kafka
- Docker
- Microservices

The goal is to demonstrate strong fundamentals in **Java, Spring Boot, REST APIs, databases, security, and full-stack development**.

---

## 📌 Project Status

CartPulse is an interview-ready full-stack e-commerce project demonstrating practical implementation of **Java, Spring Boot, React, MySQL, REST APIs, JWT security, transactional processing, and automated testing**.

## 🚀 Live Demo

- **Frontend:** https://cartpulse-q9g1.onrender.com/
- **Backend API:** https://cartpulse-backend-661n.onrender.com/
- **GitHub:** https://github.com/kanikathombre/CartPulse