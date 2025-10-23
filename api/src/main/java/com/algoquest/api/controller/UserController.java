package com.algoquest.api.controller;

import com.algoquest.api.dto.UserDTO;
import com.algoquest.api.model.User;
import com.algoquest.api.service.RefreshTokenService;
import com.algoquest.api.service.UserService;

import jakarta.servlet.http.HttpServletRequest;

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
@RequestMapping("api/v1/users")
public class UserController {
    private final UserService userService;
    private final RefreshTokenService refreshTokenService;

    public UserController(UserService userService, RefreshTokenService refreshTokenService) {
        this.userService = userService;
        this.refreshTokenService = refreshTokenService;
    }

    // -------------------
    // Auth
    // -------------------
    @PostMapping("/register")
    public ResponseEntity<AuthResponse> register(@RequestBody User user, HttpServletRequest request) {
        final User created = userService.create(user);
        final String accessToken = userService.generateToken(created);
        final String refreshToken = refreshTokenService.issueRefreshToken(
                created,
                "rn-device",
                request.getHeader("User-Agent"),
                request.getRemoteAddr());
        final AuthResponse response = new AuthResponse(
                accessToken,
                created.getId(),
                created.getPseudo(),
                created.getEmail(),
                created.getRole(),
                refreshToken);
        return ResponseEntity.ok(response);
    }

    @PostMapping("/login")
    public ResponseEntity<AuthResponse> login(@RequestBody LoginRequest loginRequest, HttpServletRequest request) {
        final Optional<User> userOpt = userService.findByEmailAndPassword(
                loginRequest.getEmail(),
                loginRequest.getPassword());

        if (userOpt.isEmpty()) {
            return ResponseEntity.status(401).build();
        }

        final User user = userOpt.get();

        // Génération de l’access token (JWT court)
        final String accessToken = userService.generateToken(user);

        // Génération du refresh token sécurisé
        final String refreshToken = refreshTokenService.issueRefreshToken(
                user,
                "rn-device", // ou deviceId réel
                request.getHeader("User-Agent"),
                request.getRemoteAddr());

        // Retourne les deux
        final AuthResponse response = new AuthResponse(
                accessToken,
                user.getId(),
                user.getPseudo(),
                user.getEmail(),
                user.getRole(),
                refreshToken // ajoute ce champ à ton DTO
        );

        return ResponseEntity.ok(response);
    }

    @GetMapping("/me")
    public ResponseEntity<UserDTO> me(@RequestHeader("Authorization") String authHeader) {
        if (authHeader != null && authHeader.startsWith("Bearer ")) {
            final String token = authHeader.substring(7);
            final Optional<User> userOpt = userService.findByToken(token);
            if (userOpt.isPresent()) {
                final User user = userOpt.get();
                return ResponseEntity.ok(new UserDTO(user.getId(), user.getPseudo(), user.getEmail(), user.getRole(),
                        user.getRefreshToken()));
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

    @PatchMapping("/{id}")
    public ResponseEntity<User> updateUserRole(
            @PathVariable String id,
            @RequestBody Map<String, String> updates) {

        final String newRole = updates.get("role");
        final User updatedUser = userService.updateRole(id, newRole);
        return ResponseEntity.ok(updatedUser);
    }

    @PostMapping("/create-admin")
    public ResponseEntity<?> createAdmin(@RequestBody User user, HttpServletRequest request) {
        if (userService.existsAdmin()) {
            return ResponseEntity.status(403).body("Un administrateur existe déjà !");
        }

        user.setRole("ADMIN");

        final User created = userService.create(user);
        final String accessToken = userService.generateToken(created);
        final String refreshToken = refreshTokenService.issueRefreshToken(
                created,
                "rn-device",
                request.getHeader("User-Agent"),
                request.getRemoteAddr());

        final AuthResponse response = new AuthResponse(accessToken, user.getId(), user.getPseudo(), user.getEmail(),
                user.getRole(), refreshToken);
        return ResponseEntity.ok(response);
    }
}
