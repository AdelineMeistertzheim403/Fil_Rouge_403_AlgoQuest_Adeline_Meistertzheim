package com.algoquest.api.integration;

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

import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.*;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;

@SpringBootTest
@AutoConfigureMockMvc
@ActiveProfiles("test-ci")
@Import({TestSecurityConfig.class, TestCiConfig.class})
class UserControllerIntegrationTest {

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

        Mockito.when(passwordEncoder.encode(Mockito.anyString())).thenReturn("encoded1234");
        Mockito.when(passwordEncoder.matches(Mockito.anyString(), Mockito.anyString())).thenReturn(true);
        Mockito.when(jwtService.generateToken(Mockito.anyString(), Mockito.anyString())).thenReturn("fake-jwt-token");
        Mockito.when(userRepository.findById("1")).thenReturn(Optional.of(mockUser));
        Mockito.when(userRepository.save(Mockito.any(User.class))).thenReturn(mockUser);
    }

    @Test
    void shouldCreateAndFetchUser() throws Exception {
        mockMvc.perform(post("/api/v1/users/register")
                .contentType(MediaType.APPLICATION_JSON)
                .content(objectMapper.writeValueAsString(mockUser)))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.email").value("adeline@test.fr"));

        mockMvc.perform(get("/api/v1/users/1"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.pseudo").value("Adeline"));
    }

    @Test
    void shouldReturn404WhenUserNotFound() throws Exception {
        Mockito.when(userRepository.findById("2")).thenReturn(Optional.empty());

        mockMvc.perform(get("/api/v1/users/2"))
                .andExpect(status().isNotFound());
    }
}
