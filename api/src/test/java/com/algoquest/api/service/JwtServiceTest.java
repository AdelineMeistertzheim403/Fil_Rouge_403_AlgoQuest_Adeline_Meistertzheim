package com.algoquest.api.service;

import io.jsonwebtoken.security.Keys;
import java.security.Key;
import org.junit.jupiter.api.Test;

import static org.junit.jupiter.api.Assertions.*;

class JwtServiceTest {

    @Test
    void shouldGenerateAndValidateToken() {
        JwtService jwtService = new JwtService();

        // Génère une vraie clé Base64 pour le test
        Key key = Keys.secretKeyFor(io.jsonwebtoken.SignatureAlgorithm.HS256);
        String base64Key = io.jsonwebtoken.io.Encoders.BASE64.encode(key.getEncoded());
        jwtService.setJwtSecret(base64Key);

        String token = jwtService.generateToken("user123", "ADMIN");

        System.out.println("🔎 Token: " + token);
        System.out.println("🔎 Subject in token: " + jwtService.extractUserId(token));

        assertNotNull(token);
        assertEquals("user123", jwtService.extractUserId(token)); // ✅
        assertTrue(jwtService.isTokenValid(token, "user123")); // ✅
    }
}
