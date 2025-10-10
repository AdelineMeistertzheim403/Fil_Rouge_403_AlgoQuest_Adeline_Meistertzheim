package com.algoquest.api.config;

import org.springframework.boot.CommandLineRunner;

import com.algoquest.api.model.Role;
import com.algoquest.api.repository.RoleRepository;

public class DataSeeder implements CommandLineRunner {

    private final RoleRepository roleRepository;

    public DataSeeder(RoleRepository roleRepository) {
        this.roleRepository = roleRepository;
    }

    @Override
    public void run(String... args) {
        createRoleIfNotExists("ADMIN");
        createRoleIfNotExists("UTILISATEUR");
    }

    private void createRoleIfNotExists(String name) {
        roleRepository.findByName(name).orElseGet(() -> {
            final Role role = new Role(name);
            roleRepository.save(role);
            System.out.println("Role créer : " + name);
            return role;
        });
    }

}
