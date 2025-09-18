package com.algoquest.api.model;

import lombok.Data;
import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.DBRef;
import org.springframework.data.mongodb.core.mapping.Document;

@Data
@Document(collection = "resolutions")
public class Resolution {
    @Id
    private String id;
    private String codeSoumis;
    private boolean estCorrecte;

    @DBRef
    private User user;

    @DBRef
    private Enigme enigme;

}
