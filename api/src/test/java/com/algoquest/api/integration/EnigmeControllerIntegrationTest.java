package com.algoquest.api.integration;

import com.algoquest.api.model.Enigme;
import com.algoquest.api.repository.EnigmeRepository;
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
import org.springframework.test.context.ActiveProfiles;
import org.springframework.test.web.servlet.MockMvc;
import com.algoquest.api.config.TestCiConfig;
import com.algoquest.api.config.TestSecurityConfig;

import java.util.Optional;

import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.*;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;

@SpringBootTest
@AutoConfigureMockMvc
@ActiveProfiles("test-ci")
@Import({TestSecurityConfig.class, TestCiConfig.class})
class EnigmeControllerIntegrationTest {

    @Autowired private MockMvc mockMvc;
    @Autowired private ObjectMapper objectMapper;

    @SuppressWarnings("removal")
    @MockBean private EnigmeRepository enigmeRepository;

    private Enigme mockEnigme;

    @BeforeEach
    void setup() {
        mockEnigme = new Enigme();
        mockEnigme.setId("123");
        mockEnigme.setTitre("Trier le tableau");
        mockEnigme.setEnonce("Écrire un algo qui trie un tableau en ordre croissant");
        mockEnigme.setEntree("[5,2,4,1,3]");
        mockEnigme.setSortieAttendue("[1,2,3,4,5]");

        Mockito.when(enigmeRepository.save(Mockito.any(Enigme.class))).thenReturn(mockEnigme);
        Mockito.when(enigmeRepository.findById("123")).thenReturn(Optional.of(mockEnigme));
        Mockito.when(enigmeRepository.findById("999")).thenReturn(Optional.empty());
    }

    @Test
    void shouldCreateAndGetEnigme() throws Exception {
        mockMvc.perform(post("/api/v1/enigmes")
                .contentType(MediaType.APPLICATION_JSON)
                .content(objectMapper.writeValueAsString(mockEnigme)))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.titre").value("Trier le tableau"));

        mockMvc.perform(get("/api/v1/enigmes/123"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.sortieAttendue").value("[1,2,3,4,5]"));
    }

    @Test
    void shouldReturn404ForInvalidId() throws Exception {
        mockMvc.perform(get("/api/v1/enigmes/999"))
                .andExpect(status().isNotFound());
    }
}
