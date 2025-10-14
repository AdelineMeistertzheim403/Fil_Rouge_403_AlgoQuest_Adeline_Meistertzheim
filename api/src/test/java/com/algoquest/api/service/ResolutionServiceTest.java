package com.algoquest.api.service;

import com.algoquest.api.dto.ReponseDTO;
import com.algoquest.api.dto.ResolutionDTO;
import com.algoquest.api.model.*;
import com.algoquest.api.repository.EnigmeRepository;
import com.algoquest.api.repository.ResolutionRepository;
import com.algoquest.api.repository.UserRepository;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.mockito.*;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.Mockito.*;

class ResolutionServiceTest {

    @Mock private ResolutionRepository resolutionRepository;
    @Mock private EnigmeRepository enigmeRepository;
    @Mock private UserRepository userRepository;
    @Mock private CodeRunnerService codeRunnerService;

    @InjectMocks private ResolutionService resolutionService;

    private ReponseDTO reponseDTO;
    private Enigme enigme;
    private User user;
    private Resolution resolution;

    @BeforeEach
    void setup() {
        MockitoAnnotations.openMocks(this);

        enigme = new Enigme();
        enigme.setId("e1");
        enigme.setTitre("Trier un tableau");
        enigme.setEntree("1 2 3");
        enigme.setSortieAttendue("1 2 3");

        user = new User();
        user.setId("u1");
        user.setPseudo("Adeline");
        user.setEmail("adeline@test.fr");

        reponseDTO = new ReponseDTO();
        reponseDTO.setUserId("u1");
        reponseDTO.setEnigmeId("e1");
        reponseDTO.setCodeSoumis("System.out.println(\"1 2 3\");");

        resolution = new Resolution();
        resolution.setId("r1");
        resolution.setUserId("u1");
        resolution.setEnigmeId("e1");
        resolution.setDateSoumission(LocalDateTime.now());
        resolution.setStatus(StatusResolution.REUSSI);
        resolution.setEstCorrecte(true);
    }

    // ✅ Cas 1 : Résolution réussie (sortie correcte)
    @Test
    void shouldCreateSuccessfulResolution() {
        when(enigmeRepository.findById("e1")).thenReturn(Optional.of(enigme));
        when(userRepository.findById("u1")).thenReturn(Optional.of(user));
        when(codeRunnerService.runJavaWithDocker(any(), any())).thenReturn("1 2 3");
        when(resolutionRepository.save(any(Resolution.class))).thenAnswer(inv -> inv.getArgument(0));

        Resolution result = resolutionService.createResolution(reponseDTO);

        assertEquals(StatusResolution.REUSSI, result.getStatus());
        assertTrue(result.isEstCorrecte());
        verify(resolutionRepository, times(1)).save(any(Resolution.class));
    }

    // ✅ Cas 2 : Échec (sortie différente)
    @Test
    void shouldCreateFailedResolutionWhenOutputDiffers() {
        when(enigmeRepository.findById("e1")).thenReturn(Optional.of(enigme));
        when(userRepository.findById("u1")).thenReturn(Optional.of(user));
        when(codeRunnerService.runJavaWithDocker(any(), any())).thenReturn("3 2 1");
        when(resolutionRepository.save(any(Resolution.class))).thenAnswer(inv -> inv.getArgument(0));

        Resolution result = resolutionService.createResolution(reponseDTO);

        assertEquals(StatusResolution.ECHEC, result.getStatus());
        assertFalse(result.isEstCorrecte());
    }

    // ✅ Cas 3 : Easter egg (sortie = "Florent")
    @Test
    void shouldDetectEasterEggResolution() {
        when(enigmeRepository.findById("e1")).thenReturn(Optional.of(enigme));
        when(userRepository.findById("u1")).thenReturn(Optional.of(user));
        when(codeRunnerService.runJavaWithDocker(any(), any())).thenReturn("Florent");
        when(resolutionRepository.save(any(Resolution.class))).thenAnswer(inv -> inv.getArgument(0));

        Resolution result = resolutionService.createResolution(reponseDTO);

        assertEquals(StatusResolution.EASTER_EGG, result.getStatus());
        assertFalse(result.isEstCorrecte());
    }

    // ✅ Cas 4 : Enigme introuvable
    @Test
    void shouldThrowIfEnigmeNotFound() {
        when(enigmeRepository.findById("e1")).thenReturn(Optional.empty());

        RuntimeException ex = assertThrows(RuntimeException.class, () ->
                resolutionService.createResolution(reponseDTO));

        assertEquals("Enigme introuvable", ex.getMessage());
    }

    // ✅ Cas 5 : Utilisateur introuvable
    @Test
    void shouldThrowIfUserNotFound() {
        when(enigmeRepository.findById("e1")).thenReturn(Optional.of(enigme));
        when(userRepository.findById("u1")).thenReturn(Optional.empty());

        RuntimeException ex = assertThrows(RuntimeException.class, () ->
                resolutionService.createResolution(reponseDTO));

        assertEquals("Utilisateur introuvable", ex.getMessage());
    }

    // ✅ Cas 6 : getResolutionsByUserId()
    @Test
    void shouldReturnResolutionsByUserId() {
        when(resolutionRepository.findByUserId("u1")).thenReturn(List.of(resolution));

        List<Resolution> result = resolutionService.getResolutionsByUserId("u1");

        assertEquals(1, result.size());
        assertEquals("u1", result.get(0).getUserId());
    }

    // ✅ Cas 7 : toDto()
    @Test
    void shouldConvertResolutionToDto() {
        ResolutionDTO dto = resolutionService.toDto(resolution);

        assertEquals(resolution.getId(), dto.getId());
        assertEquals(resolution.getStatus(), dto.getStatus());
        assertEquals(resolution.isEstCorrecte(), dto.isEstCorrecte());
    }

    // ✅ Cas 8 : getStatutResolution() - dernier statut trouvé
    @Test
    void shouldReturnLastResolutionStatus() {
        when(resolutionRepository.findTopByUserIdAndEnigmeIdOrderByDateSoumissionDesc("u1", "e1"))
                .thenReturn(Optional.of(resolution));

        StatusResolution status = resolutionService.getStatutResolution("u1", "e1");

        assertEquals(StatusResolution.REUSSI, status);
    }

    // ✅ Cas 9 : getStatutResolution() - aucune résolution
    @Test
    void shouldReturnAfaireIfNoResolutionFound() {
        when(resolutionRepository.findTopByUserIdAndEnigmeIdOrderByDateSoumissionDesc("u1", "e1"))
                .thenReturn(Optional.empty());

        StatusResolution status = resolutionService.getStatutResolution("u1", "e1");

        assertEquals(StatusResolution.A_FAIRE, status);
    }
}
