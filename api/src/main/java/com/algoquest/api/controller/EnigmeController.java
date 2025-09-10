package com.algoquest.api.controller;

import com.algoquest.api.model.Enigme;
import com.algoquest.api.service.EnigmeService;
import com.algoquest.api.dto.EnigmeDTO;
import com.algoquest.api.dto.EnigmeResumeDTO;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.bind.annotation.RequestMapping;

import java.util.List;

@RestController
@RequestMapping("/enigmes")
public class EnigmeController {

    @Autowired
    private EnigmeService enigmeService;

    // creer une enigme
    @PostMapping
    public Enigme createEnigme(@RequestBody EnigmeDTO enigmeDTO) {
        return enigmeService.createEnigme(enigmeDTO);
    }

    // recuperer toutes les enigmes
    @GetMapping
    public List<EnigmeResumeDTO> getAllEnigmes() {
        return enigmeService.getAllEnigmes();
    }

    // recuperer une enigme par son id
    @GetMapping("/{id}")
    public Enigme getEnigmeById(@PathVariable String id) {
        return enigmeService.getEnigmeById(id);
    }
}
