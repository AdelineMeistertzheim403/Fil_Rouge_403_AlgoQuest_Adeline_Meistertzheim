package com.algoquest.api.service;

import com.algoquest.api.dto.EnigmeDTO;
import com.algoquest.api.dto.EnigmeResumeDTO;
import com.algoquest.api.model.Enigme;
import com.algoquest.api.repository.EnigmeRepository;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.mockito.*;

import java.util.List;
import java.util.Optional;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.Mockito.*;

class EnigmeServiceTest {

    @Mock
    private EnigmeRepository enigmeRepository;

    @InjectMocks
    private EnigmeService enigmeService;

    private Enigme enigme;

    @BeforeEach
    void setup() {
        MockitoAnnotations.openMocks(this);

        enigme = new Enigme();
        enigme.setId("e1");
        enigme.setTitre("Addition simple");
        enigme.setEnonce("Calcule la somme de deux nombres.");
        enigme.setEntree("2 3");
        enigme.setSortieAttendue("5");
    }

    // ✅ Test create()
    @Test
    void shouldCreateEnigme() {
        when(enigmeRepository.save(any(Enigme.class))).thenReturn(enigme);

        Enigme result = enigmeService.create(enigme);

        assertNotNull(result);
        assertEquals("Addition simple", result.getTitre());
        verify(enigmeRepository, times(1)).save(enigme);
    }

    // ✅ Test findAll()
    @Test
    void shouldFindAllEnigmes() {
        when(enigmeRepository.findAll()).thenReturn(List.of(enigme));

        List<Enigme> result = enigmeService.findAll();

        assertEquals(1, result.size());
        assertEquals("Addition simple", result.get(0).getTitre());
    }

    // ✅ Test createEnigme() avec DTO
    @Test
    void shouldCreateEnigmeFromDto() {
        EnigmeDTO dto = new EnigmeDTO();
        dto.setTitre("Multiplication");
        dto.setEnonce("Multiplie deux nombres.");
        dto.setEntree("2 4");
        dto.setSortieAttendue("8");

        when(enigmeRepository.save(any(Enigme.class))).thenAnswer(inv -> inv.getArgument(0));

        Enigme result = enigmeService.createEnigme(dto);

        assertEquals("Multiplication", result.getTitre());
        assertEquals("2 4", result.getEntree());
        verify(enigmeRepository).save(any(Enigme.class));
    }

    // ✅ Test getAllEnigmes()
    @Test
    void shouldReturnAllEnigmesAsResumes() {
        when(enigmeRepository.findAll()).thenReturn(List.of(enigme));

        List<EnigmeResumeDTO> result = enigmeService.getAllEnigmes();

        assertEquals(1, result.size());
        assertEquals("e1", result.get(0).getId());
        assertEquals("Addition simple", result.get(0).getTitre());
    }

    // ✅ Test getEnigmeById() - succès
    @Test
    void shouldReturnEnigmeById() {
        when(enigmeRepository.findById("e1")).thenReturn(Optional.of(enigme));

        Enigme result = enigmeService.getEnigmeById("e1");

        assertNotNull(result);
        assertEquals("Addition simple", result.getTitre());
    }

    // ❌ Test getEnigmeById() - non trouvée
    @Test
    void shouldThrowIfEnigmeNotFound() {
        when(enigmeRepository.findById("e404")).thenReturn(Optional.empty());

        RuntimeException ex = assertThrows(RuntimeException.class, () ->
                enigmeService.getEnigmeById("e404"));

        assertTrue(ex.getMessage().contains("Enigme non trouvée"));
    }
}
