package com.algoquest.api.dto;

import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class AuthResponse {
    private String accessToken;
    private String id;
    private String pseudo;
    private String email;
    private String role;
    private String refreshToken;

    public AuthResponse(String accessToken, String id, String pseudo, String email, String role, String refreshToken) {
        this.accessToken = accessToken;
        this.id = id;
        this.pseudo = pseudo;
        this.email = email;
        this.role = role;
        this.refreshToken = refreshToken;
    }
}
