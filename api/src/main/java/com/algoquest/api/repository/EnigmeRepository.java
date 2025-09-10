package com.algoquest.api.repository;

import com.algoquest.api.model.Enigme;
import org.springframework.data.mongodb.repository.MongoRepository;

public interface EnigmeRepository extends MongoRepository<Enigme, String> {

}
