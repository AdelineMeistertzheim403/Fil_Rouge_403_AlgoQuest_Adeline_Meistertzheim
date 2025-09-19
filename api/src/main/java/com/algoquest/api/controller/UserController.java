package com.algoquest.api.controller;

import com.algoquest.api.dto.UserDTO;
import com.algoquest.api.model.Role;
import com.algoquest.api.model.User;
import com.algoquest.api.service.UserService;
import com.algoquest.api.dto.LoginRequest;
import com.algoquest.api.dto.AuthResponse;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PatchMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestHeader;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;
import java.util.Map;
import java.util.Optional;

@RestController
@RequestMapping("users")
public class UserController {
    private final UserService userService;

    public UserController(UserService userService) {
        this.userService = userService;
    }

    // -------------------
    // Auth
    // -------------------
    @PostMapping("/register")
    public ResponseEntity<AuthResponse> register(@RequestBody User user) {
        final User created = userService.create(user);
        // génère un token simplifié basé sur l'id (à remplacer plus tard par JWT)
        final String token = userService.generateToken(created);
        return ResponseEntity.ok(new AuthResponse(token, created));
    }

    @PostMapping("/login")
    public ResponseEntity<AuthResponse> login(@RequestBody LoginRequest loginRequest) {
        final Optional<User> userOpt = userService.findByEmailAndpassword(loginRequest.getEmail(),
                loginRequest.getPassword());
        if (userOpt.isPresent()) {
            final User user = userOpt.get();
            final String token = userService.generateToken(user);
            return ResponseEntity.ok(new AuthResponse(token, user));
        }
        return ResponseEntity.status(401).build();
    }

    @GetMapping("/me")
    public ResponseEntity<UserDTO> me(@RequestHeader("Authorization") String authHeader) {
        if (authHeader != null && authHeader.startsWith("Bearer ")) {
            final String token = authHeader.substring(7);
            final Optional<User> userOpt = userService.findByToken(token);
            if (userOpt.isPresent()) {
                final User user = userOpt.get();
                return ResponseEntity.ok(new UserDTO(user.getId(), user.getPseudo(), user.getEmail(), user.getRole()));
            }
        }
        return ResponseEntity.status(401).build();
    }

    @GetMapping
    public ResponseEntity<List<UserDTO>> getAllUsers() {
        return ResponseEntity.ok(userService.findAll());
    }

    @GetMapping("/{id}")
    public ResponseEntity<UserDTO> getUserById(@PathVariable String id) {
        return userService.findById(id)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    @PatchMapping("/users/{id}")
    public ResponseEntity<User> updateUserRole(
            @PathVariable String id,
            @RequestBody Map<String, String> updates) {

        final String newRoleStr = updates.get("role");
        final Role newRole = Role.valueOf(newRoleStr.toUpperCase());
        final User updatedUser = userService.updateRole(id, newRole);
        return ResponseEntity.ok(updatedUser);
    }
}
