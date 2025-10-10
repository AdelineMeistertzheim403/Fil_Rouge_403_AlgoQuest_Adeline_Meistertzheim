package com.algoquest.api.config;

import org.springframework.boot.test.context.TestConfiguration;
import org.springframework.context.annotation.Bean;
import org.springframework.data.mongodb.core.MongoTemplate;

import com.mongodb.client.MongoClient;
import com.mongodb.client.MongoClients;

import de.flapdoodle.embed.mongo.MongodExecutable;
import de.flapdoodle.embed.mongo.MongodStarter;
import de.flapdoodle.embed.mongo.config.MongodConfig;
import de.flapdoodle.embed.mongo.config.Net;
import de.flapdoodle.embed.mongo.distribution.Version;
import de.flapdoodle.embed.process.runtime.Network;

@TestConfiguration
public class EmbeddedMongoTestConfig {

    private static final String HOST = "localhost";
    private static final int PORT = 27018; // différent de ton Mongo Docker éventuel

    private MongodExecutable mongodExecutable;

    @Bean(destroyMethod = "stop")
    public MongodExecutable embeddedMongoServer() throws Exception {
        MongodStarter starter = MongodStarter.getDefaultInstance();

        MongodConfig mongodConfig = MongodConfig.builder()
                .version(Version.Main.V6_0)
                .net(new Net(HOST, PORT, Network.localhostIsIPv6()))
                .build();

        mongodExecutable = starter.prepare(mongodConfig);
        mongodExecutable.start();
        return mongodExecutable;
    }

    @Bean
    public MongoClient mongoClient() {
        return MongoClients.create("mongodb://" + HOST + ":" + PORT);
    }

    @Bean
    public MongoTemplate mongoTemplate(MongoClient mongoClient) {
        return new MongoTemplate(mongoClient, "algoquest_test");
    }
}
