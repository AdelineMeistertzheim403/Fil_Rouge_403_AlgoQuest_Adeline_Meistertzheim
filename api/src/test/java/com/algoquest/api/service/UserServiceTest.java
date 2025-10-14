package com.algoquest.api.service;

import com.algoquest.api.dto.UserDTO;
import com.algoquest.api.model.User;
import com.algoquest.api.repository.UserRepository;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.mockito.*;
import org.springframework.security.crypto.password.PasswordEncoder;

import java.util.Arrays;
import java.util.List;
import java.util.Optional;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.Mockito.*;

class UserServiceTest {

    @Mock
    private UserRepository userRepository;

    @Mock
    private PasswordEncoder passwordEncoder;

    @Mock
    private JwtService jwtService;

    @InjectMocks
    private UserService userService;

    private User mockUser;

    @BeforeEach
    void setup() {
        MockitoAnnotations.openMocks(this);

        mockUser = new User();
        mockUser.setId("u1");
        mockUser.setPseudo("Adeline");
        mockUser.setEmail("adeline@test.fr");
        mockUser.setPassword("encodedPwd");
        mockUser.setRole("USER");
    }

    // 🔹 Test create()
    @Test
    void shouldCreateUserWithEncodedPassword() {
        when(passwordEncoder.encode("plainPwd")).thenReturn("encodedPwd");
        when(userRepository.save(any(User.class))).thenAnswer(invocation -> invocation.getArgument(0));

        User user = new User();
        user.setPassword("plainPwd");

        User result = userService.create(user);

        assertEquals("encodedPwd", result.getPassword());
        verify(userRepository, times(1)).save(any(User.class));
    }

    // 🔹 Test findAll()
    @Test
    void shouldReturnAllUsersAsDTOs() {
        when(userRepository.findAll()).thenReturn(Arrays.asList(mockUser));

        List<UserDTO> result = userService.findAll();

        assertEquals(1, result.size());
        assertEquals("Adeline", result.get(0).getPseudo());
    }

    // 🔹 Test findById()
    @Test
    void shouldFindUserById() {
        when(userRepository.findById("u1")).thenReturn(Optional.of(mockUser));

        Optional<UserDTO> result = userService.findById("u1");

        assertTrue(result.isPresent());
        assertEquals("Adeline", result.get().getPseudo());
    }

    // 🔹 Test findByEmailAndPassword() - succès
    @Test
    void shouldFindUserByEmailAndValidPassword() {
        when(userRepository.findByEmail("adeline@test.fr")).thenReturn(Optional.of(mockUser));
        when(passwordEncoder.matches("plain", "encodedPwd")).thenReturn(true);

        Optional<User> result = userService.findByEmailAndPassword("adeline@test.fr", "plain");

        assertTrue(result.isPresent());
        assertEquals("u1", result.get().getId());
    }

    // 🔹 Test findByEmailAndPassword() - mauvais mot de passe
    @Test
    void shouldReturnEmptyWhenPasswordInvalid() {
        when(userRepository.findByEmail("adeline@test.fr")).thenReturn(Optional.of(mockUser));
        when(passwordEncoder.matches("wrong", "encodedPwd")).thenReturn(false);

        Optional<User> result = userService.findByEmailAndPassword("adeline@test.fr", "wrong");

        assertTrue(result.isEmpty());
    }

    // 🔹 Test generateToken()
    @Test
    void shouldGenerateTokenForUser() {
        when(jwtService.generateToken("u1", "USER")).thenReturn("token123");

        String token = userService.generateToken(mockUser);

        assertEquals("token123", token);
        verify(jwtService).generateToken("u1", "USER");
    }

    // 🔹 Test findByToken() - token valide
    @Test
    void shouldFindUserByValidToken() {
        when(jwtService.extractUserId("token123")).thenReturn("u1");
        when(jwtService.isTokenValid("token123", "u1")).thenReturn(true);
        when(userRepository.findById("u1")).thenReturn(Optional.of(mockUser));

        Optional<User> result = userService.findByToken("token123");

        assertTrue(result.isPresent());
        assertEquals("Adeline", result.get().getPseudo());
    }

    // 🔹 Test findByToken() - token invalide
    @Test
    void shouldReturnEmptyForInvalidToken() {
        when(jwtService.extractUserId("badToken")).thenThrow(new RuntimeException("Invalid token"));

        Optional<User> result = userService.findByToken("badToken");

        assertTrue(result.isEmpty());
    }

    // 🔹 Test updateRole()
    @Test
    void shouldUpdateUserRole() {
        when(userRepository.findById("u1")).thenReturn(Optional.of(mockUser));
        when(userRepository.save(any(User.class))).thenAnswer(invocation -> invocation.getArgument(0));

        User updated = userService.updateRole("u1", "ADMIN");

        assertEquals("ADMIN", updated.getRole());
        verify(userRepository).save(any(User.class));
    }

    // 🔹 Test existsAdmin()
    @Test
    void shouldReturnTrueIfAdminExists() {
        when(userRepository.existsByRole("ADMIN")).thenReturn(true);

        assertTrue(userService.existsAdmin());
    }
}
