package com.algoquest.api.service;

import java.util.Map;

import org.springframework.stereotype.Service;

@Service
public class RoleMapperService {

    private static final Map<String, String>ROLE_TO_CODE = Map.of(
        "ADMIN" , "RID_A1",
        "UTILISATEUR" , "RID_U1"
    );

    private static final Map<String, String>CODE_TO_ROLE = Map.of(
        "RID_A1" , "ADMIN",
        "RID_U1" , "UTILISATEUR"
    );

    public String encodeRole(String role) {
        return ROLE_TO_CODE.getOrDefault(role, "RID_U1");
    }

    public String decodeRole(String code) {
        return CODE_TO_ROLE.getOrDefault(code, "UTILISATEUR");
    }

}
