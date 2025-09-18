package com.algoquest.api.repository;

import com.algoquest.api.model.Resolution;
import org.springframework.data.mongodb.repository.MongoRepository;

import java.util.List;

public interface ResolutionRepository extends MongoRepository<Resolution, String> {
    List<Resolution> findByUserId(String userId);

    List<Resolution> findByEnigmeId(String enigmeId);

    List<Resolution> findByUserIdAndEnigmeId(String userId, String enigmeId);

}
