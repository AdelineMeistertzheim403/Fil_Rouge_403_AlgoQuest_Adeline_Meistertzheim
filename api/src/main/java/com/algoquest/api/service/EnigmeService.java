package com.algoquest.api.service;

import com.algoquest.api.dto.EnigmeDTO;
import com.algoquest.api.dto.EnigmeResumeDTO;
import com.algoquest.api.model.Enigme;
import com.algoquest.api.repository.EnigmeRepository;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class EnigmeService {

    private final EnigmeRepository enigmeRepository;

    public EnigmeService(EnigmeRepository enigmeRepository) {
        this.enigmeRepository = enigmeRepository;
    }

    public Enigme create(Enigme enigme) {
        return enigmeRepository.save(enigme);
    }

    public List<Enigme> findAll() {
        return enigmeRepository.findAll();
    }

    public Enigme createEnigme(EnigmeDTO enigmeDTO) {
        final Enigme enigme = new Enigme();
        enigme.setTitre(enigmeDTO.getTitre());
        enigme.setEnonce(enigmeDTO.getEnonce());
        enigme.setEntree(enigmeDTO.getEntree());
        enigme.setSortieAttendue(enigmeDTO.getSortieAttendue());

        return enigmeRepository.save(enigme);
    }

    public List<EnigmeResumeDTO> getAllEnigmes() {
        return enigmeRepository.findAll().stream().map(enigme -> {
            final EnigmeResumeDTO dto = new EnigmeResumeDTO();
            dto.setId(enigme.getId());
            dto.setTitre(enigme.getTitre());
            return dto;
        }).toList();
    }

    public Enigme getEnigmeById(String id) {
        return enigmeRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Enigme non trouvée avec l'id : " + id));
    }
}
