package com.algoquest.api.controller;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.algoquest.api.dto.ReponseDTO;
import com.algoquest.api.model.Resolution;
import com.algoquest.api.service.ResolutionService;

@RestController
@RequestMapping("/resolutions")
public class ResolutionController {

    private final ResolutionService resolutionService;

    public ResolutionController(ResolutionService resolutionService) {
        this.resolutionService = resolutionService;
    }

    @PostMapping
    public ResponseEntity<Resolution> submitResolution(@RequestBody ReponseDTO dto) {
        final Resolution resolution = resolutionService.createResolution(dto);
        return ResponseEntity.status(HttpStatus.CREATED).body(resolution);
    }
}
