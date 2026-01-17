package com.petstack.petstack.service;

import com.petstack.petstack.model.User;
import com.petstack.petstack.repository.UserRepository;
import org.springframework.stereotype.Service;

@Service  // Tells Spring: "Create and manage an instance of this class"
public class UserService {

    private final UserRepository userRepository;  // Our database access

    // Constructor injection - Spring will automatically pass in UserRepository
    public UserService(UserRepository userRepository) {
        this.userRepository = userRepository;
    }



    // TODO: Creating a user (with email uniqueness check)

    public User createUser(String email, String password, String displayName) {
        if(userRepository.existsByEmail(email)){
            throw new RuntimeException("An account already exists for this email!");
        }

        User user = new User(email, password, displayName);
        userRepository.save(user);
        return user;
    }

    public Boolean login(String email, String password){
        return true;
    }




    // TODO: Updating user info (display name, password)



    // TODO: Finding users (by ID, by email, etc.)
}
