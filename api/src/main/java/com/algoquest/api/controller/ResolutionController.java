package com.algoquest.api.controller;

import java.util.List;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.algoquest.api.dto.ReponseDTO;
import com.algoquest.api.dto.ResolutionDTO;
import com.algoquest.api.model.Resolution;
import com.algoquest.api.service.ResolutionService;

@RestController
@RequestMapping("api/v1/resolutions")
public class ResolutionController {

    private final ResolutionService resolutionService;

    public ResolutionController(ResolutionService resolutionService) {
        this.resolutionService = resolutionService;
    }

    @PostMapping
    public ResponseEntity<ResolutionDTO> submitResolution(@RequestBody ReponseDTO dto) {
        final Resolution resolution = resolutionService.createResolution(dto);
        final ResolutionDTO resolutionDTO = resolutionService.toDto(resolution);
        return ResponseEntity.status(HttpStatus.CREATED).body(resolutionDTO);
    }

    @GetMapping("/user/{userId}")
    public ResponseEntity<List<Resolution>> getResolutionsByUserId(@PathVariable String userId) {
        final List<Resolution> resolutions = resolutionService.getResolutionsByUserId(userId);
        return ResponseEntity.ok(resolutions);
    }
}
