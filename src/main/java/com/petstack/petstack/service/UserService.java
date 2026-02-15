package com.petstack.petstack.service;

import com.petstack.petstack.model.User;
import com.petstack.petstack.repository.UserRepository;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

@Service
public class UserService {

    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;

    public UserService(UserRepository userRepository, PasswordEncoder passwordEncoder) {
        this.userRepository = userRepository;
        this.passwordEncoder = passwordEncoder;
    }

    public User createUser(String email, String password, String displayName) {
        if(userRepository.existsByEmail(email)){
            throw new RuntimeException("An account already exists for this email!");
        }

        // Hash the password before storing
        String hashedPassword = passwordEncoder.encode(password);
        User user = new User(email, hashedPassword, displayName);
        userRepository.save(user);
        return user;
    }

    public Boolean login(String email, String password){
        return true;
    }

    public User getUserByID(Integer userId){
        return userRepository.findById(userId).orElseThrow(() -> new RuntimeException("User not found!"));
    }
}
