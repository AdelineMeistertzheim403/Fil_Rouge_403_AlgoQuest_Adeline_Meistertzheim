package com.algoquest.api;

import org.springframework.boot.ApplicationRunner;
import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.context.annotation.Bean;
import org.springframework.core.env.Environment;

@SpringBootApplication
public class AlgoquestApiApplication {

    public static void main(String[] args) {
        SpringApplication.run(AlgoquestApiApplication.class, args);
    }

    @Bean
    ApplicationRunner runner(Environment env) {
        return args -> System.out.println(">>> Active profiles: " + String.join(", ", env.getActiveProfiles()));
    }

}
