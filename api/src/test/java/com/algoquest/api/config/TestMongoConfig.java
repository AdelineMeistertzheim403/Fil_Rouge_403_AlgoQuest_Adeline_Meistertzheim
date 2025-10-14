package com.algoquest.api.config;

import org.springframework.boot.test.context.TestConfiguration;
import org.testcontainers.containers.MongoDBContainer;

@TestConfiguration
public class TestMongoConfig {

    static MongoDBContainer mongo = new MongoDBContainer("mongo:7.0.2");

    static {
        mongo.start();
        System.setProperty("spring.data.mongodb.uri", mongo.getReplicaSetUrl());
    }
}

