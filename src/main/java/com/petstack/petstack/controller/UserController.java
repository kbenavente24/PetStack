package com.petstack.petstack.controller;

import com.petstack.petstack.model.User;
import com.petstack.petstack.service.UserService;
import org.springframework.web.bind.annotation.*;

@RestController  // Tells Spring: "This handles HTTP requests and returns JSON"
@RequestMapping("/api/users")  // Base path for all endpoints in this controller
public class UserController {

    private final UserService userService;

    // Constructor injection - Spring automatically provides the UserService
    public UserController(UserService userService) {
        this.userService = userService;
    }

    /**
     * POST /api/users
     * Creates a new user
     *
     * Example request body:
     * {
     *   "email": "test@example.com",
     *   "password": "password123",
     *   "displayName": "Test User"
     * }
     */
    @PostMapping
    public User createUser(@RequestBody CreateUserRequest request) {
        return userService.createUser(
            request.getEmail(),
            request.getPassword(),
            request.getDisplayName()
        );
    }

    // Inner class to represent the incoming JSON request
    // You could also put this in a separate "dto" package
    public static class CreateUserRequest {
        private String email;
        private String password;
        private String displayName;

        // Getters and setters (required for JSON deserialization)
        public String getEmail() { return email; }
        public void setEmail(String email) { this.email = email; }

        public String getPassword() { return password; }
        public void setPassword(String password) { this.password = password; }

        public String getDisplayName() { return displayName; }
        public void setDisplayName(String displayName) { this.displayName = displayName; }
    }
}
