package com.algoquest.api.config;

import org.springframework.boot.test.context.TestConfiguration;
import org.springframework.boot.test.mock.mockito.MockBean;

/**
 * Configuration de test pour désactiver le JwtAuthFilter.
 */
@TestConfiguration
public class TestBeansConfig {

    @MockBean
    private JwtAuthFilter jwtAuthFilter;
}
