package com.petstack.petstack.service;

import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import com.petstack.petstack.model.User;
import com.petstack.petstack.repository.UserRepository;


@Service
public class AuthService {
    private final UserRepository userRepository;
    private final UserService userService;
    private final PasswordEncoder passwordEncoder;

    public AuthService(UserRepository userRepository, UserService userService, PasswordEncoder passwordEncoder){
        this.userRepository = userRepository;
        this.userService = userService;
        this.passwordEncoder = passwordEncoder;
    }

    public User login(String email, String password){
        User user =  userRepository.findByEmail(email).orElseThrow(() -> new RuntimeException("Email not found! Please try again."));

        // Use BCrypt's matches() to compare plain password with hashed password
        if(!passwordEncoder.matches(password, user.getPasswordHash())){
            throw new RuntimeException("Incorrect password! Please try again.");
        }

        return user;
    }

    public User signUp(String email, String password, String displayName){
        User user = userService.createUser(email, password, displayName);
        return user;
    }
}
