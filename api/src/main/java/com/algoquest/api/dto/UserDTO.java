package com.algoquest.api.dto;

import com.algoquest.api.model.Role;

import lombok.Data;

@Data
public class UserDTO {
    private String id;
    private String pseudo;
    private String email;
    private Role role;
}
