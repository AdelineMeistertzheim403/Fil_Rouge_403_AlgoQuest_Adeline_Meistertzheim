package com.algoquest.api.dto;

import lombok.AllArgsConstructor;
import lombok.Data;

@Data
@AllArgsConstructor
public class UserDTO {
    private String id;
    private String pseudo;
    private String email;
    private String role;
    private String refreshToken;
}
