package com.algoquest.api.config;

import org.springframework.boot.test.context.TestConfiguration;
import org.springframework.boot.test.mock.mockito.MockBean;

@TestConfiguration
public class TestBeansConfig {
    @SuppressWarnings("removal")
    @MockBean
    private JwtAuthFilter jwtAuthFilter;
}
