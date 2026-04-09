package com.petstack.petstack.controller;


import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.petstack.petstack.dto.response.SignupResponse;
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
    public LoginResponse login(@RequestBody LoginRequest request){
        AuthService.LoginResult result = authService.login(request.getEmail(), request.getPassword());
        return new LoginResponse(result.token(), result.user().getDisplayName());
    }

    public static class LoginResponse{
        private String token;
        private String displayName;

        public LoginResponse(String token, String displayName){
            this.token = token;
            this.displayName = displayName;
        }

        public String getToken(){
            return token;
        }

        public String getDisplayName(){
            return displayName;
        }
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
    public SignupResponse signUp(@RequestBody CreateSignupRequest request){
        User user = authService.signUp(request.getEmail(), request.getPassword(), request.getDisplayName());
        return new SignupResponse(user.getEmail(), user.getDisplayName());
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
