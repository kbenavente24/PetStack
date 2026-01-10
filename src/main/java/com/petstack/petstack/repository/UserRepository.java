package com.petstack.petstack.repository;

import com.petstack.petstack.model.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

/**
 * UserRepository - Data access layer for User entity
 *
 * By extending JpaRepository, Spring Data JPA automatically provides:
 * - save(user)           - Insert or update a user
 * - findById(id)         - Find user by ID
 * - findAll()            - Get all users
 * - deleteById(id)       - Delete user by ID
 * - count()              - Count total users
 * - existsById(id)       - Check if user exists
 * ... and many more!
 *
 * You don't write any implementation code - Spring generates it at runtime!
 */
@Repository  // Marks this as a Spring-managed repository component
public interface UserRepository extends JpaRepository<User, Integer> {

    /**
     * Custom query method: Find a user by email
     *
     * Spring Data JPA automatically implements this based on the method name!
     * "findBy" + "Email" = SELECT * FROM user WHERE email = ?
     *
     * @param email The email to search for
     * @return Optional<User> - contains the user if found, empty if not found
     */
    Optional<User> findByEmail(String email);

    /**
     * Custom query method: Check if a user exists with given email
     *
     * Spring generates: SELECT COUNT(*) > 0 FROM user WHERE email = ?
     *
     * @param email The email to check
     * @return true if user exists, false otherwise
     */
    boolean existsByEmail(String email);

    /**
     * Custom query method: Find users by display name (partial match)
     *
     * "Containing" = LIKE '%name%' in SQL
     *
     * @param displayName The name to search for
     * @return List of users matching the name
     */
    java.util.List<User> findByDisplayNameContaining(String displayName);
}
