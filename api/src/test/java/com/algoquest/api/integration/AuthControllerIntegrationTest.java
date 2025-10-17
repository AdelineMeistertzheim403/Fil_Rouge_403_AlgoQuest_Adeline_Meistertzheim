package com.algoquest.api.integration;

import com.algoquest.api.dto.LoginRequest;
import com.algoquest.api.model.User;
import com.algoquest.api.repository.UserRepository;
import com.algoquest.api.service.JwtService;
import com.fasterxml.jackson.databind.ObjectMapper;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.mockito.Mockito;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.boot.test.mock.mockito.MockBean;
import org.springframework.context.annotation.Import;
import org.springframework.http.MediaType;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.test.context.ActiveProfiles;
import org.springframework.test.web.servlet.MockMvc;

import com.algoquest.api.config.TestSecurityConfig;
import com.algoquest.api.config.TestCiConfig;

import java.util.Optional;

import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.post;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;

@SpringBootTest
@AutoConfigureMockMvc
@ActiveProfiles("test-ci")
@Import({TestSecurityConfig.class, TestCiConfig.class})
class AuthControllerIntegrationTest {

    @Autowired private MockMvc mockMvc;
    @Autowired private ObjectMapper objectMapper;

    @MockBean private UserRepository userRepository;
    @MockBean private PasswordEncoder passwordEncoder;
    @MockBean private JwtService jwtService;

    private User mockUser;

    @BeforeEach
    void setup() {
        mockUser = new User();
        mockUser.setId("1");
        mockUser.setPseudo("Adeline");
        mockUser.setEmail("adeline@test.fr");
        mockUser.setPassword("encoded1234");
        mockUser.setRole("USER");

        //  Simuler comportements attendus
        Mockito.when(passwordEncoder.encode(Mockito.anyString())).thenReturn("encoded1234");
        Mockito.when(passwordEncoder.matches(Mockito.anyString(), Mockito.anyString())).thenReturn(true);

        //  Adapter à ta signature réelle : (String userId, String role)
        Mockito.when(jwtService.generateToken(Mockito.anyString(), Mockito.anyString()))
                .thenReturn("fake-jwt-token");

        Mockito.when(userRepository.save(Mockito.any(User.class))).thenReturn(mockUser);
        Mockito.when(userRepository.findByEmail("adeline@test.fr")).thenReturn(Optional.of(mockUser));
        Mockito.when(userRepository.findByEmail("wrong@test.fr")).thenReturn(Optional.empty());
    }

    @Test
    void shouldRegisterAndLoginSuccessfully() throws Exception {
        //  Inscription
        User newUser = new User();
        newUser.setPseudo("Adeline");
        newUser.setEmail("adeline@test.fr");
        newUser.setPassword("1234");

        mockMvc.perform(post("/api/v1/users/register")
                .contentType(MediaType.APPLICATION_JSON)
                .content(objectMapper.writeValueAsString(newUser)))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.token").value("fake-jwt-token"))
                .andExpect(jsonPath("$.email").value("adeline@test.fr"))
                .andExpect(jsonPath("$.pseudo").value("Adeline"));

        //  Connexion
        LoginRequest loginRequest = new LoginRequest();
        loginRequest.setEmail("adeline@test.fr");
        loginRequest.setPassword("1234");

        mockMvc.perform(post("/api/v1/users/login")
                .contentType(MediaType.APPLICATION_JSON)
                .content(objectMapper.writeValueAsString(loginRequest)))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.token").value("fake-jwt-token"))
                .andExpect(jsonPath("$.pseudo").value("Adeline"));
    }

    @Test
    void shouldRejectInvalidLogin() throws Exception {
        LoginRequest invalid = new LoginRequest();
        invalid.setEmail("wrong@test.fr");
        invalid.setPassword("badpassword");

        mockMvc.perform(post("/api/v1/users/login")
                .contentType(MediaType.APPLICATION_JSON)
                .content(objectMapper.writeValueAsString(invalid)))
                .andExpect(status().isUnauthorized());
    }
}
