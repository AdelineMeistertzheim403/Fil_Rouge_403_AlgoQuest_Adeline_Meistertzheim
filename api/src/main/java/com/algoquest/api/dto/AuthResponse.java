package com.algoquest.api.dto;

import com.algoquest.api.model.Role;

public class AuthResponse {
    private String token;
    private String id;
    private String pseudo;
    private String email;
    private Role role;

    public AuthResponse(String token, String id, String pseudo, String email, Role role) {
        this.token = token;
        this.id = id;
        this.pseudo = pseudo;
        this.email = email;
        this.role = role;
    }

    // --- Getters et setters ---
    public String getToken() {
        return token;
    }
    public void setToken(String token) {
        this.token = token;
    }
    public String getId() {
        return id;
    }
    public void setId(String id) {
        this.id = id;
    }
    public String getPseudo() {
        return pseudo;
    }
    public void setPseudo(String pseudo) {
        this.pseudo = pseudo;
    }
    public String getEmail() {
        return email;
    }
    public void setEmail(String email) {
        this.email = email;
    }
    public Role getRole() {
        return role;
    }
    public void setRole(Role role) {
        this.role = role;
    }
}
