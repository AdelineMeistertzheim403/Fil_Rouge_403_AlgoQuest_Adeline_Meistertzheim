package com.algoquest.api.dto;

import lombok.Data;

@Data
public class ResolutionDTO {
    private String id;
    private String codeSoumis;
    private boolean estCorrecte;
    private String userId;
    private String enigmeId;
}
