package com.algoquest.api.service;

import com.algoquest.api.dto.ReponseDTO;
import com.algoquest.api.dto.ResolutionDTO;
import com.algoquest.api.model.Enigme;
import com.algoquest.api.model.Resolution;
import com.algoquest.api.model.StatusResolution;
import com.algoquest.api.model.User;
import com.algoquest.api.repository.EnigmeRepository;
import com.algoquest.api.repository.ResolutionRepository;
import com.algoquest.api.repository.UserRepository;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;

import org.springframework.stereotype.Service;

@Service
public class ResolutionService {
    private final ResolutionRepository resolutionRepository;
    private final EnigmeRepository enigmeRepository;
    private final UserRepository userRepository;
    private final CodeRunnerService codeRunnerService;

    public ResolutionService(ResolutionRepository resolutionRepository, EnigmeRepository enigmeRepository,
            UserRepository userRepository,
            CodeRunnerService codeRunnerService) {
        this.resolutionRepository = resolutionRepository;
        this.enigmeRepository = enigmeRepository;
        this.userRepository = userRepository;
        this.codeRunnerService = codeRunnerService;
    }

    public Resolution createResolution(ReponseDTO dto) {
        final Enigme enigme = enigmeRepository.findById(dto.getEnigmeId())
                .orElseThrow(() -> new RuntimeException("Enigme introuvable"));
        final User user = userRepository.findById(dto.getUserId())
                .orElseThrow(() -> new RuntimeException("Utilisateur introuvable"));
        final String sortieObtenue = codeRunnerService.runJavaWithDocker(dto.getCodeSoumis(), enigme.getEntree());
        final String sortieNormalisee = sortieObtenue.replaceAll("\\s+", " ");
        final String sortieAttendueNormalisee = enigme.getSotieAttendue().strip().replaceAll("\\s+", " ");
        final Logger logger = LoggerFactory.getLogger(ResolutionService.class);

        logger.info("DEBUG - Sortie obtenue: [" + sortieObtenue + "]");
        logger.info("DEBUG - Sortie attendue: [" + enigme.getSotieAttendue() + "]");

        final Resolution resolution = new Resolution();
        resolution.setCodeSoumis(dto.getCodeSoumis());
        resolution.setUserId(user.getId());
        resolution.setEnigmeId(enigme.getId());
        resolution.setDateSoumission(LocalDateTime.now());

        // Vérifie l'easter egg
        if (sortieNormalisee.equalsIgnoreCase("Florent")) {
            resolution.setStatus(StatusResolution.EASTER_EGG);
            resolution.setEstCorrecte(false);
        }
        // Vérifie si la sortie correspond à la sortie attendue
        else if (sortieNormalisee.equals(sortieAttendueNormalisee)) {
            resolution.setStatus(StatusResolution.REUSSI);
            resolution.setEstCorrecte(true);
        }
        // Sinon, c'est un échec
        else {
            resolution.setStatus(StatusResolution.ECHEC);
            resolution.setEstCorrecte(false);
        }

        return resolutionRepository.save(resolution);
    }

    public List<Resolution> getResolutionsByUserId(String userId) {
        return resolutionRepository.findByUserId(userId);
    }

    public ResolutionDTO toDto(Resolution resolution) {
        final ResolutionDTO dto = new ResolutionDTO();
        dto.setId(resolution.getId());
        dto.setCodeSoumis(resolution.getCodeSoumis());
        dto.setEstCorrecte(resolution.isEstCorrecte());
        dto.setUserId(resolution.getId());
        dto.setEnigmeId(resolution.getId());
        dto.setDateSoumission(resolution.getDateSoumission());
        dto.setStatus(resolution.getStatus());
        return dto;
    }

    public StatusResolution getStatutResolution(String userId, String enigmeId) {
        final Optional<Resolution> lastResolution = resolutionRepository
                .findTopByUserIdAndEnigmeIdOrderByDateSoumissionDesc(userId, enigmeId);

        if (lastResolution.isEmpty()) {
            return StatusResolution.A_FAIRE;
        }

        return lastResolution.get().getStatus();
    }
}
