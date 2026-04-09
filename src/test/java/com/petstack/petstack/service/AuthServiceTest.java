/*package com.petstack.petstack.service;

import static org.junit.jupiter.api.Assertions.*;

import static org.mockito.Mockito.*;

import java.util.Map;
import java.util.Optional;

import org.junit.jupiter.api.BeforeEach;

import org.junit.jupiter.api.Test;

import com.petstack.petstack.model.User;
import com.petstack.petstack.repository.UserRepository;

import org.springframework.security.crypto.password.PasswordEncoder;


public class AuthServiceTest {

    private UserRepository userRepository;
    private UserService userService;
    private PasswordEncoder passwordEncoder;
    private JwtService jwtService;

    private AuthService authService;

    @BeforeEach
    void setUp() {
        userRepository = mock(UserRepository.class);
        userService = mock(UserService.class);
        passwordEncoder = mock(PasswordEncoder.class);
        jwtService = mock(JwtService.class);

        authService = new AuthService(userRepository, userService, passwordEncoder, jwtService);
    }    

    @Test
    void login_withNonExistentEmail_shouldThrowException() {
        when(userRepository.findByEmail("fake@email.com"))
            .thenReturn(Optional.empty());

        RuntimeException exception = assertThrows(RuntimeException.class, () -> {
            authService.login("fake@email.com", "password123");
        });

        assertEquals("Email not found! Please try again.", exception.getMessage());
    }

    @Test
    void login_withCorrectEmailWrongPassword_shouldThrowException() {
        User fakeUser = new User();
        fakeUser.setEmail("real@email.com");
        fakeUser.setPasswordHash("hashedPassword123");

        when(userRepository.findByEmail("real@email.com"))
            .thenReturn(Optional.of(fakeUser));

        when(passwordEncoder.matches("wrongPassword", "hashedPassword123"))
            .thenReturn(false);

        RuntimeException exception = assertThrows(RuntimeException.class, () -> {
            authService.login("real@email.com", "wrongPassword");
        });

        assertEquals("Incorrect password! Please try again.", exception.getMessage());
    }

    @Test
    void login_withCorrectEmailCorrectPassword(){
        User fakeUser = new User();
        fakeUser.setEmail("real@email.com");
        fakeUser.setPasswordHash("hashedPassword123");

        when(userRepository.findByEmail("real@email.com"))
        .thenReturn(Optional.of(fakeUser));

        when(passwordEncoder.matches("correctPassword", "hashedPassword123"))
            .thenReturn(true);

        when(jwtService.generateToken(fakeUser))
            .thenReturn("fake-jwt-token");

        Map<String, Object> result = authService.login("real@email.com", "correctPassword");

        assertEquals("fake-jwt-token", result.get("token"));
        assertNotNull(result.get("user"));
    }

    @Test
    void signUp_withValidDetails_shouldReturnUser() {
        User fakeUser = new User("new@email.com", "hashedPassword", "NewUser");

        when(userService.createUser("new@email.com", "password123", "NewUser"))
            .thenReturn(fakeUser);

        User result = authService.signUp("new@email.com", "password123", "NewUser");

        assertEquals(fakeUser, result);
        assertEquals("new@email.com", result.getEmail());
        assertEquals("NewUser", result.getDisplayName());
    }

    @Test
    void signUp_withExistingEmail_shouldThrowException() {
        when(userService.createUser("taken@email.com", "password123", "SomeUser"))
            .thenThrow(new RuntimeException("An account already exists for this email!"));

        RuntimeException exception = assertThrows(RuntimeException.class, () -> {
            authService.signUp("taken@email.com", "password123", "SomeUser");
        });

        assertEquals("An account already exists for this email!", exception.getMessage());
    }
}
*/