package com.algoquest.api.integration;

import com.algoquest.api.model.User;
import com.algoquest.api.dto.LoginRequest;
import com.algoquest.api.repository.UserRepository;
import com.fasterxml.jackson.databind.ObjectMapper;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.context.annotation.Import;
import org.springframework.http.MediaType;
import org.springframework.test.context.ActiveProfiles;
import org.springframework.test.web.servlet.MockMvc;

import com.algoquest.api.config.EmbeddedMongoTestConfig;
import com.algoquest.api.config.TestSecurityConfig;

import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.post;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;

@SpringBootTest
@ActiveProfiles("test")
@AutoConfigureMockMvc
@Import({EmbeddedMongoTestConfig.class, TestSecurityConfig.class})
public class AuthControllerIntegrationTest {

    @Autowired private MockMvc mockMvc;
    @Autowired private ObjectMapper objectMapper;
    @Autowired private UserRepository userRepository;

    @BeforeEach
    void setup() {
        userRepository.deleteAll();
    }

    @Test
    void shouldRegisterAndLoginSuccessfully() throws Exception {
        // 1️⃣ Inscription
        User newUser = new User();
        newUser.setPseudo("Adeline");
        newUser.setEmail("adeline@test.fr");
        newUser.setPassword("1234");

        mockMvc.perform(post("/api/v1/users/register")
                .contentType(MediaType.APPLICATION_JSON)
                .content(objectMapper.writeValueAsString(newUser)))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.token").exists())
                .andExpect(jsonPath("$.email").value("adeline@test.fr"))
                .andExpect(jsonPath("$.pseudo").value("Adeline"));

        // 2️⃣ Connexion
        LoginRequest loginRequest = new LoginRequest();
        loginRequest.setEmail("adeline@test.fr");
        loginRequest.setPassword("1234");

        mockMvc.perform(post("/api/v1/users/login")
                .contentType(MediaType.APPLICATION_JSON)
                .content(objectMapper.writeValueAsString(loginRequest)))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.token").exists())
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
