package com.algoquest.api.dto;

import lombok.Data;

@Data
public class EnigmeDTO {

    private String id;
    private String titre;
    private String enonce;
    private String entree;
    private String sortieAttendue;
}
