package com.algoquest.api.service;

import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.Optional;
import java.util.UUID;
import java.util.stream.Collectors;

import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import com.algoquest.api.dto.UserDTO;
import com.algoquest.api.model.Role;
import com.algoquest.api.model.User;
import com.algoquest.api.repository.UserRepository;

@Service
public class UserService {
    private final UserRepository userRepository;

    private final PasswordEncoder passwordEncoder;

    // stockage en mémoire des tokens simples (à remplacer par JWT plus tard)
    private final Map<String, String> tokens = new HashMap<>();

    public UserService(UserRepository userRepository, PasswordEncoder passwordEncoder) {
        this.userRepository = userRepository;
        this.passwordEncoder = passwordEncoder;
    }

    public User create(User user) {
        user.setPassword(passwordEncoder.encode(user.getPassword()));
        return userRepository.save(user);
    }

    public List<UserDTO> findAll() {
        return userRepository.findAll()
                .stream()
                .map(this::convertToDTO)
                .collect(Collectors.toList());
    }

    public Optional<UserDTO> findById(String id) {
        return userRepository.findById(id).map(this::convertToDTO);
    }

    private UserDTO convertToDTO(User user) {
        final UserDTO dto = new UserDTO(null, null, null, null);
        dto.setId(user.getId());
        dto.setPseudo(user.getPseudo());
        dto.setEmail(user.getEmail());
        dto.setRole(user.getRole());
        return dto;
    }

    // --------- Auth ---------
    public Optional<User> findByEmailAndPassword(String email, String rawPassword) {
        final Optional<User> userOpt = userRepository.findByEmail(email);
        if (userOpt.isPresent()) {
            final User user = userOpt.get();
            if (passwordEncoder.matches(rawPassword, user.getPassword())) {
                return Optional.of(user);
            }
        }
        return Optional.empty();
    }

    public String generateToken(User user) {
        final String token = UUID.randomUUID().toString();
        tokens.put(token, user.getId());
        return token;
    }

    public Optional<User> findByToken(String token) {
        final String userId = tokens.get(token);
        if (userId != null) {
            return userRepository.findById(userId);
        }
        return Optional.empty();
    }

    public User updateRole(String id, Role newRole) {
        final User user = userRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("User not found"));
        user.setRole(newRole);
        return userRepository.save(user);
    }

    public boolean existsAdmin() {
        return userRepository.existsByRole(Role.ADMIN);
    }
}
