package com.algoquest.api.service;

import org.junit.jupiter.api.Test;
import static org.junit.jupiter.api.Assertions.*;

class JwtServiceTest {

    @Test
    void shouldGenerateAndValidateToken() {
        JwtService jwtService = new JwtService();
        jwtService.setJwtSecret("supersecretkeysupersecretkeysupersecretkey");

        String token = jwtService.generateToken("user123", "ADMIN");

        System.out.println("🔎 Token: " + token);
        System.out.println("🔎 Subject in token: " + jwtService.extractUserId(token));

        assertNotNull(token);
        assertEquals("user123", jwtService.extractUserId(token)); // ✅
        assertTrue(jwtService.isTokenValid(token, "user123")); // ✅
    }
}
