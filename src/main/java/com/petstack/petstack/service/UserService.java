package com.petstack.petstack.service;

import com.petstack.petstack.model.User;
import com.petstack.petstack.repository.UserRepository;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

@Service  // Tells Spring: "Create and manage an instance of this class"
public class UserService {

    private final UserRepository userRepository;  // Our database access
    private final PasswordEncoder passwordEncoder;  // For hashing passwords

    // Constructor injection - Spring will automatically pass in dependencies
    public UserService(UserRepository userRepository, PasswordEncoder passwordEncoder) {
        this.userRepository = userRepository;
        this.passwordEncoder = passwordEncoder;
    }



    // TODO: Creating a user (with email uniqueness check)

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




    // TODO: Updating user info (display name, password)



    // TODO: Finding users (by ID, by email, etc.)
}
