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
    private final JwtService jwtService;

    public AuthService(UserRepository userRepository, UserService userService,
                       PasswordEncoder passwordEncoder, JwtService jwtService){
        this.userRepository = userRepository;
        this.userService = userService;
        this.passwordEncoder = passwordEncoder;
        this.jwtService = jwtService;
    }

    public record LoginResult(String token, User user){}



    public LoginResult login(String email, String password){
        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new RuntimeException("Email not found! Please try again."));

        if(!passwordEncoder.matches(password, user.getPasswordHash())){
            throw new RuntimeException("Incorrect password! Please try again.");
        }

        String token = jwtService.generateToken(user);

        return new LoginResult(token, user);
    }

    public User signUp(String email, String password, String displayName){
        User user = userService.createUser(email, password, displayName);
        return user;
    }
}
