package com.algoquest.api.config;

import com.algoquest.api.repository.*;
import com.algoquest.api.service.JwtService;
import org.mockito.Mockito;
import org.springframework.boot.test.context.TestConfiguration;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Primary;

@TestConfiguration
public class TestCiConfig {

    @Bean
    @Primary
    public UserRepository userRepository() {
        return Mockito.mock(UserRepository.class);
    }

    @Bean
    @Primary
    public EnigmeRepository enigmeRepository() {
        return Mockito.mock(EnigmeRepository.class);
    }

    @Bean
    @Primary
    public ResolutionRepository resolutionRepository() {
        return Mockito.mock(ResolutionRepository.class);
    }

    @Bean
    @Primary
    public JwtService jwtService() {
        return Mockito.mock(JwtService.class);
    }
}
