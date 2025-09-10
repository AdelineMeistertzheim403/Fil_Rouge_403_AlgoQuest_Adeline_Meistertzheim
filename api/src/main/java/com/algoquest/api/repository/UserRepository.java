package com.algoquest.api.repository;

import com.algoquest.api.model.User;

import java.util.Optional;

import org.springframework.data.mongodb.repository.MongoRepository;

public interface UserRepository extends MongoRepository<User, String> {
    Optional<User> findByPseudo(String pseudo);

    boolean existsByEmail(String email);
}
