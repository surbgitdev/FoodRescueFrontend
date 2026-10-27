
package com.foodrescuett.backend;

import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

@Service
public class AppUserService {

    private final AppUserRepository userRepository;
    private final PasswordEncoder passwordEncoder;

    public AppUserService(
            AppUserRepository userRepository,
            PasswordEncoder passwordEncoder) {
        this.userRepository = userRepository;
        this.passwordEncoder = passwordEncoder;
    }

    public AppUser registerUser(AppUser user) {

        if (user.getEmail() == null ||
            user.getEmail().isBlank() ||
            user.getPassword() == null ||
            user.getPassword().isBlank()) {
            throw new IllegalArgumentException(
                "Email and password are required");
        }

        if (userRepository.existsByEmail(user.getEmail())) {
            throw new IllegalArgumentException(
                "Email is already registered");
        }

        if (user.getRole() == null ||
            !(user.getRole().equalsIgnoreCase("DONOR")
            || user.getRole().equalsIgnoreCase("NGO")
            || user.getRole().equalsIgnoreCase("VOLUNTEER"))) {
            throw new IllegalArgumentException(
                "Role must be DONOR, NGO or VOLUNTEER");
        }

        user.setRole(user.getRole().toUpperCase());
        user.setPassword(
            passwordEncoder.encode(user.getPassword()));

        return userRepository.save(user);
    }

    public AppUser loginUser(String email, String password) {

        AppUser user = userRepository.findByEmail(email)
            .orElseThrow(() -> new IllegalArgumentException(
                "Invalid email or password"));

        if (!passwordEncoder.matches(
                password, user.getPassword())) {
            throw new IllegalArgumentException(
                "Invalid email or password");
        }

        return user;
    }
}
