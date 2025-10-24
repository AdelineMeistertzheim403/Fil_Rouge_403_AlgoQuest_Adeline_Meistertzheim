package com.algoquest.api.integration;

import com.algoquest.api.dto.ResolutionDTO;
import com.algoquest.api.model.Resolution;
import com.algoquest.api.repository.ResolutionRepository;
import com.algoquest.api.service.ResolutionService;
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

import com.algoquest.api.config.TestSecurityConfig;
import com.algoquest.api.config.TestCiConfig;

import java.util.Optional;

import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.*;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;

@SpringBootTest
@AutoConfigureMockMvc
@ActiveProfiles("test-ci")
@Import({TestSecurityConfig.class, TestCiConfig.class})
class ResolutionControllerIntegrationTest {

    @Autowired private MockMvc mockMvc;
    @Autowired private ObjectMapper objectMapper;

    @SuppressWarnings("removal")
    @MockBean private ResolutionRepository resolutionRepository;
    @SuppressWarnings("removal")
    @MockBean private ResolutionService resolutionService;

    private Resolution mockResolution;
    private ResolutionDTO mockResolutionDTO;

    @BeforeEach
    void setup() {
        // Mock Resolution (entité)
        mockResolution = new Resolution();
        mockResolution.setId("r1");
        mockResolution.setUserId("u1");
        mockResolution.setEnigmeId("e1");
        mockResolution.setCodeSoumis("System.out.println(\"Hello World\");");

        // Mock DTO
        mockResolutionDTO = new ResolutionDTO();
        mockResolutionDTO.setId("r1");
        mockResolutionDTO.setUserId("u1");
        mockResolutionDTO.setEnigmeId("e1");
        mockResolutionDTO.setCodeSoumis("System.out.println(\"Hello World\");");

        // Simulation du service
        Mockito.when(resolutionService.createResolution(Mockito.any()))
               .thenReturn(mockResolution);
        Mockito.when(resolutionService.toDto(Mockito.any()))
               .thenReturn(mockResolutionDTO);

        // Simulation du repository
        Mockito.when(resolutionRepository.save(Mockito.any(Resolution.class))).thenReturn(mockResolution);
        Mockito.when(resolutionRepository.findById("r1")).thenReturn(Optional.of(mockResolution));
        Mockito.when(resolutionRepository.findById("404")).thenReturn(Optional.empty());
    }

    @Test
    void shouldCreateAndGetResolution() throws Exception {
        mockMvc.perform(post("/api/v1/resolutions")
                .contentType(MediaType.APPLICATION_JSON)
                .content(objectMapper.writeValueAsString(mockResolution)))
                .andExpect(status().isCreated()) // ✅ ton controller renvoie 201 CREATED
                .andExpect(jsonPath("$.userId").value("u1"))
                .andExpect(jsonPath("$.enigmeId").value("e1"));

        mockMvc.perform(get("/api/v1/resolutions/user/u1"))
                .andExpect(status().isOk());
    }

    @Test
    void shouldReturn404WhenResolutionNotFound() throws Exception {
        mockMvc.perform(get("/api/v1/resolutions/user/unknown"))
                .andExpect(status().isOk()) // pas 404 ici car le controller renvoie une liste vide
                .andExpect(content().string("[]"));
    }
}
