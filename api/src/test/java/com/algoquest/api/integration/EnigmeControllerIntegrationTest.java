package com.algoquest.api.integration;

import com.algoquest.api.config.EmbeddedMongoTestConfig;
import com.algoquest.api.config.TestSecurityConfig;
import com.algoquest.api.model.Enigme;
import com.algoquest.api.repository.EnigmeRepository;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.jayway.jsonpath.JsonPath;

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

import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.*;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;

@SpringBootTest
@AutoConfigureMockMvc
@ActiveProfiles("test-ci")
@Import({EmbeddedMongoTestConfig.class, TestSecurityConfig.class})
class EnigmeControllerIntegrationTest {

    @Autowired private MockMvc mockMvc;
    @Autowired private ObjectMapper objectMapper;
    @Autowired private EnigmeRepository enigmeRepository;

    @BeforeEach
    void setup() {
        enigmeRepository.deleteAll();
    }

   @Test
void shouldCreateAndGetEnigme() throws Exception {
    Enigme enigme = new Enigme();
    enigme.setTitre("Trier le tableau");
    enigme.setEnonce("Écrire un algo qui trie un tableau en ordre croissant");
    enigme.setEntree("[5,2,4,1,3]");
    enigme.setSortieAttendue("[1,2,3,4,5]");

    // Création et récupération de l'ID
    MvcResult result = mockMvc.perform(post("/api/v1/enigmes")
            .contentType(MediaType.APPLICATION_JSON)
            .content(objectMapper.writeValueAsString(enigme)))
            .andExpect(status().isOk())
            .andReturn();

    // Extraire l’ID de la réponse JSON
    String responseBody = result.getResponse().getContentAsString();
    String id = JsonPath.parse(responseBody).read("$.id");

    // Récupération complète de l’énigme via son ID
    mockMvc.perform(get("/api/v1/enigmes/" + id))
            .andExpect(status().isOk())
            .andExpect(jsonPath("$.titre").value("Trier le tableau"))
            .andExpect(jsonPath("$.sortieAttendue").value("[1,2,3,4,5]"));
}

    @Test
    void shouldReturn404ForInvalidId() throws Exception {
        mockMvc.perform(get("/api/v1/enigmes/invalid"))
                .andExpect(status().isNotFound());
    }
}
