package com.algoquest.api.integration;

import com.algoquest.api.config.TestSecurityConfig;
import com.algoquest.api.model.User;
import com.algoquest.api.model.Enigme;
import com.algoquest.api.repository.ResolutionRepository;
import com.algoquest.api.repository.UserRepository;
import com.algoquest.api.repository.EnigmeRepository;
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
import org.springframework.test.web.servlet.MvcResult;

import static org.hamcrest.Matchers.is;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.*;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;
import static org.springframework.test.web.servlet.result.MockMvcResultHandlers.print;

@SpringBootTest
@AutoConfigureMockMvc
@ActiveProfiles("test-ci")
@Import(TestSecurityConfig.class)
class ResolutionControllerIntegrationTest {

    @Autowired
    private MockMvc mockMvc;
    @SuppressWarnings("unused")
    @Autowired
    private ObjectMapper objectMapper;
    @Autowired
    private ResolutionRepository resolutionRepository;
    @Autowired
    private UserRepository userRepository;
    @Autowired
    private EnigmeRepository enigmeRepository;

    @BeforeEach
    void cleanDb() {
        resolutionRepository.deleteAll();
        userRepository.deleteAll();
        enigmeRepository.deleteAll();
    }

    @Test
    void shouldCreateAndGetResolution() throws Exception {
        // 1️⃣ Créer un utilisateur
        User user = new User();
        user.setPseudo("Adeline");
        user.setEmail("adeline@test.fr");
        user.setPassword("1234");
        userRepository.save(user);

        // 2️⃣ Créer une énigme
        Enigme enigme = new Enigme();
        enigme.setTitre("Hello World");
        enigme.setEnonce("Affiche Hello World");
        enigme.setEntree("");
        enigme.setSortieAttendue("Hello World");
        enigmeRepository.save(enigme);

        // 3️⃣ Créer la résolution (via POST)
        String payload = """
                {
                  "userId": "%s",
                  "enigmeId": "%s",
                  "codeSoumis": "System.out.println(\\"Hello World\\");"
                }
                """.formatted(user.getId(), enigme.getId());

        @SuppressWarnings("unused")
        MvcResult result = mockMvc.perform(post("/api/v1/resolutions")
                .contentType(MediaType.APPLICATION_JSON)
                .content(payload))
                .andDo(print())
                .andExpect(status().isCreated())
                .andExpect(jsonPath("$.userId").exists())
                .andExpect(jsonPath("$.enigmeId").exists())
                .andReturn();

        // 4️⃣ Récupérer toutes les résolutions
        mockMvc.perform(get("/api/v1/resolutions/user/" + user.getId()))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$[0].codeSoumis", is("System.out.println(\"Hello World\");")));
    }

    @Test
    void shouldReturn404WhenResolutionNotFound() throws Exception {
        mockMvc.perform(get("/api/v1/resolutions/unknownId"))
                .andExpect(status().isNotFound());
    }
}
