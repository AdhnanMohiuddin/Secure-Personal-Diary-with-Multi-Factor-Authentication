# Progress Tracker – Spring Boot Application

A productivity-focused web application to track progress and improve efficiency.

## Tech Stack
- Java 24
- Spring Boot 3.5.5
- Spring Data JPA
- Spring Web
- Thymeleaf
- MySQL
- Maven
- Lombok

## Features
- MVC-based Spring Boot architecture
- CRUD operations using Spring Data JPA
- Server-side rendering with Thymeleaf
- RESTful endpoints
- MySQL database integration
- Clean layered architecture (Controller, Service, Repository)

## Project Structure
src/main/java/com/app
├── controller
├── service
├── repository
├── model
└── ProgressTrackerApplication.java
## How to Run
1. Clone the repository
2. Configure MySQL in `application.properties`
3. Run the application:
bash
mvn spring-boot:run
# Open browser:
http://localhost:8080
