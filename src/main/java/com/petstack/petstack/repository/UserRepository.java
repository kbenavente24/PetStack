package com.petstack.petstack.repository;

import com.petstack.petstack.model.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository  // Marks this as a Spring-managed repository component
public interface UserRepository extends JpaRepository<User, Integer> {

    Optional<User> findByEmail(String email);
    boolean existsByEmail(String email);
    java.util.List<User> findByDisplayNameContaining(String displayName);
}
