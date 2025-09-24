package com.algoquest.api.dto;

import java.time.LocalDateTime;

import com.algoquest.api.model.StatusResolution;

import lombok.Data;

@Data
public class ResolutionDTO {
    private String id;
    private String codeSoumis;
    private boolean estCorrecte;
    private String userId;
    private String enigmeId;
    private LocalDateTime dateSoumission;
    private StatusResolution status;
}
