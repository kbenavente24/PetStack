package com.petstack.petstack.service;

import java.util.Map;

import com.petstack.petstack.exception.InvalidCredentialsException;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import com.petstack.petstack.dto.response.UserResponse;
import com.petstack.petstack.model.User;
import com.petstack.petstack.repository.UserRepository;


@Service
public class AuthService {
    private final UserRepository userRepository;
    private final UserService userService;
    private final PasswordEncoder passwordEncoder;
    private final JwtService jwtService;

    public AuthService(UserRepository userRepository, UserService userService,
                       PasswordEncoder passwordEncoder, JwtService jwtService){
        this.userRepository = userRepository;
        this.userService = userService;
        this.passwordEncoder = passwordEncoder;
        this.jwtService = jwtService;
    }

    public Map<String, Object> login(String email, String password){
        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new InvalidCredentialsException("Invalid email or password."));

        if(!passwordEncoder.matches(password, user.getPasswordHash())){
            throw new InvalidCredentialsException("Invalid email or password.");
        }

        String token = jwtService.generateToken(user);

        return Map.of(
            "token", token,
            "user", new UserResponse(user)
        );
    }

    public User signUp(String email, String password, String displayName){
        return userService.createUser(email, password, displayName);
    }
}
