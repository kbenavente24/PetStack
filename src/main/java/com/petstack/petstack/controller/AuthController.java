package com.petstack.petstack.controller;

import java.util.Map;

import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.petstack.petstack.model.User;
import com.petstack.petstack.service.AuthService;

@RestController
@RequestMapping("/api/auth")
public class AuthController {

    private final AuthService authService;

    public AuthController(AuthService authService){
        this.authService = authService;
    }

    @PostMapping("/login")
    public Map<String, Object> login(@RequestBody LoginRequest request){
        return authService.login(request.getEmail(), request.getPassword());
    }

    public static class LoginRequest{
    
    private String email;
    private String password;

    public String getEmail() { return email;}
    public void setEmail(String email) { this.email = email;}

    public String getPassword() { return password; }
    public void setPassword(String password) { this.password = password; }
    
}

    @PostMapping("/signup")
    public User signUp(@RequestBody CreateSignupRequest request){
        return authService.signUp(request.getEmail(), request.getPassword(), request.getDisplayName());
    }

    public static class CreateSignupRequest {
        private String email;
        private String password;
        private String displayName;

        public String getEmail() { return email; }
        public void setEmail(String email) { this.email = email; }

        public String getPassword() { return password; }
        public void setPassword(String password) { this.password = password; }

        public String getDisplayName() { return displayName; }
        public void setDisplayName(String displayName) { this.displayName = displayName; }
    }
}
