package com.algoquest.api.model;

import lombok.Data;

import java.time.LocalDateTime;

import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.index.CompoundIndex;
import org.springframework.data.mongodb.core.index.CompoundIndexes;
import org.springframework.data.mongodb.core.index.Indexed;
import org.springframework.data.mongodb.core.mapping.DBRef;
import org.springframework.data.mongodb.core.mapping.Document;

@Data
@Document(collection = "resolutions")
@CompoundIndexes({
    @CompoundIndex(name = "user_enigme_idx", def = "{'user.$id' : 1, 'enigme.$id' : 1}")
})
public class Resolution {
    @Id
    private String id;

    private String codeSoumis;
    private boolean estCorrecte;

    private LocalDateTime dateSoumission;

    @DBRef
    @Indexed(name = "user_idx")
    private User user;

    @DBRef
    @Indexed(name = "enigme_idx")
    private Enigme enigme;
}
