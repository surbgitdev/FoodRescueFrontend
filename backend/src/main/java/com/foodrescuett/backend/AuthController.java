
package com.foodrescuett.backend;

import java.util.Map;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/auth")
public class AuthController {

    private final AppUserService userService;

    public AuthController(AppUserService userService) {
        this.userService = userService;
    }

    @PostMapping("/register")
    public ResponseEntity<?> register(
            @RequestBody AppUser user) {
        try {
            AppUser savedUser =
                userService.registerUser(user);

            return ResponseEntity.status(HttpStatus.CREATED)
                .body(Map.of(
                    "message", "Registration successful",
                    "id", savedUser.getId(),
                    "name", savedUser.getFullName() == null
                        ? "" : savedUser.getFullName(),
                    "email", savedUser.getEmail(),
                    "role", savedUser.getRole()
                ));

        } catch (IllegalArgumentException e) {
            return ResponseEntity.badRequest()
                .body(Map.of("error", e.getMessage()));
        }
    }

    @PostMapping("/login")
    public ResponseEntity<?> login(
            @RequestBody Map<String, String> data) {
        try {
            String email = data.get("email");
            String password = data.get("password");

            if (email == null || password == null) {
                return ResponseEntity.badRequest()
                    .body(Map.of(
                        "error", "Email and password are required"));
            }

            AppUser user =
                userService.loginUser(email, password);

            return ResponseEntity.ok(Map.of(
                "message", "Login successful",
                "id", user.getId(),
                "name", user.getFullName() == null
                    ? "" : user.getFullName(),
                "email", user.getEmail(),
                "role", user.getRole()
            ));

        } catch (IllegalArgumentException e) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED)
                .body(Map.of("error", e.getMessage()));
        }
    }
}
