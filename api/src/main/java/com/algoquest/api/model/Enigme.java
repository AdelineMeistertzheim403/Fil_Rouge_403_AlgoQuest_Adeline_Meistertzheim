package com.algoquest.api.model;

import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;

import lombok.Data;

@Data
@Document(collection = "enigme")

public class Enigme {
    @Id
    private String id;
    private String titre;
    private String enonce;
    private String entree;
    private String sortieAttendue;

    public Enigme() {}

    public Enigme(String titre, String enonce, String entree, String sortieAttendue) {
        this.titre = titre;
        this.enonce = enonce;
        this.entree = entree;
        this.sortieAttendue = sortieAttendue;
    }

    public String getId() {
        return this.id;
    }

    public String getTitre() {
        return this.titre;
    }

    public String getEnonce() {
        return this.enonce;
    }

    public String getEntree() {
        return this.entree;
    }

    public String getSotieAttendue() {
        return this.sortieAttendue;
    }

    public void setId(String id) {
        this.id = id;
    }

    public void setEnonce(String enonce) {
        this.enonce = enonce;
    }

    public void setTitre(String titre) {
        this.titre = titre;
    }

    public void setEntree(String entree) {
        this.entree = entree;
    }

    public void setSortieAttendue(String sortieAttendue) {
        this.sortieAttendue = sortieAttendue;
    }
}
