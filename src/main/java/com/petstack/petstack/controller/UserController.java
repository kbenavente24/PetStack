package com.petstack.petstack.controller;

import com.petstack.petstack.dto.response.UserResponse;
import com.petstack.petstack.model.User;
import com.petstack.petstack.service.UserService;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;



@RestController  // Tells Spring: "This handles HTTP requests and returns JSON"
@RequestMapping("/api/users")  // Base path for all endpoints in this controller
public class UserController {

    private final UserService userService;

    // Constructor injection - Spring automatically provides the UserService
    public UserController(UserService userService) {
        this.userService = userService;
    }

    @GetMapping("/me")
    public UserResponse getCurrentUser(Authentication authentication) {
        String email = authentication.getName();
        User user = userService.getUserByEmail(email);
        return new UserResponse(user);
    }

    @PutMapping("/me/updatename")
    public void updateDisplayName(@RequestParam String newDisplayName, Authentication authentication){
        String email = authentication.getName();
        userService.changeDisplayName(newDisplayName, email);
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
