package com.hbdev.nurseservice.web;

import com.fasterxml.jackson.core.JsonProcessingException;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.hbdev.nurseservice.entity.Nurse;
import com.hbdev.nurseservice.service.NurseService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.text.ParseException;
import java.text.SimpleDateFormat;
import java.util.Date;
import java.util.List;


@RestController
@RequiredArgsConstructor
public class NurseController {

    private final NurseService nurseService;
    private final ObjectMapper objectMapper;

    @PostMapping(value = "/api/nurses", consumes = MediaType.MULTIPART_FORM_DATA_VALUE)
    public ResponseEntity<?> createNurse(
            @RequestParam("nurse") String nurseJson,
            @RequestParam(value = "profilePhoto", required = false) MultipartFile profilePhoto,
            @RequestParam(value = "insuranceDocument", required = false) MultipartFile insuranceDocument,
            @RequestParam(value = "cinDocument", required = false) MultipartFile cinDocument) {

        try {
            Nurse nurse = objectMapper.readValue(nurseJson, Nurse.class);
            Nurse savedNurse = nurseService.createNurse(nurse, profilePhoto, insuranceDocument, cinDocument);
            return ResponseEntity.ok(savedNurse);
        } catch (JsonProcessingException e) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body("Invalid nurse data format");
        } catch (IllegalArgumentException e) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(e.getMessage());
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body("Error processing request");
        }
    }
    @PutMapping(value = "/api/nurses/{id}", consumes = MediaType.MULTIPART_FORM_DATA_VALUE)
    public ResponseEntity<?> updateNurse(
            @PathVariable Long id,
            @RequestParam(value = "name", required = false) String name,
            @RequestParam(value = "phoneNumber", required = false) String phoneNumber,
            @RequestParam(value = "address", required = false) String address,
            @RequestParam(value = "dateOfBirth", required = false) String dateOfBirth,
            @RequestParam(value = "sex", required = false) String sex,
            @RequestParam(value = "professionalId", required = false) String professionalId,
            @RequestParam(value = "languages", required = false) String languages,
            @RequestParam(value = "geographicArea", required = false) String geographicArea,
            @RequestParam(value = "profilePhoto", required = false) MultipartFile profilePhoto,
            @RequestParam(value = "insuranceDocument", required = false) MultipartFile insuranceDocument,
            @RequestParam(value = "cinDocument", required = false) MultipartFile cinDocument) {

        try {
            Nurse nurse = new Nurse();
            nurse.setId(id);
            nurse.setName(name);
            nurse.setPhoneNumber(phoneNumber);
            nurse.setAddress(address);

            if (dateOfBirth != null) {
                SimpleDateFormat dateFormat = new SimpleDateFormat("yyyy-MM-dd");
                Date parsedDate = dateFormat.parse(dateOfBirth);
                nurse.setDateOfBirth(parsedDate);
            }

            nurse.setSex(sex);
            nurse.setProfessionalId(professionalId);
            nurse.setLanguages(languages);
            nurse.setGeographicArea(geographicArea);

            Nurse updatedNurse = nurseService.updateNurse(id, nurse, profilePhoto, insuranceDocument, cinDocument);
            return ResponseEntity.ok(updatedNurse);
        } catch (IllegalArgumentException e) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(e.getMessage());
        } catch (ParseException e) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body("Invalid date format. Use yyyy-MM-dd.");
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body("Error processing request");
        }
    }

    @GetMapping("/api/nurses/{id}")
    public ResponseEntity<?> getNurseById(@PathVariable Long id) {
        try {
            Nurse nurse = nurseService.getNurseById(id);

            // Compléter l'URL de la photo de profil si elle existe
            if (nurse.getProfilePhotoPath() != null) {
                String fullProfilePhotoUrl = "http://localhost:8085/profimg/" + nurse.getProfilePhotoPath();
                nurse.setProfilePhotoPath(fullProfilePhotoUrl);  // Remplacer l'URL relative par l'URL complète
            }

            return ResponseEntity.ok(nurse);
        } catch (IllegalArgumentException e) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body(e.getMessage());
        }
    }

    @GetMapping("/api/nurses")
    public ResponseEntity<List<Nurse>> getAllNurses() {
        List<Nurse> nurses = nurseService.getAllNurses();
        return ResponseEntity.ok(nurses);
    }
    @GetMapping("/api/nurses/by-city/{city}")
    public ResponseEntity<List<Nurse>> getNursesByCity(@PathVariable String city) {
        List<Nurse> nurses = nurseService.getNursesByCity(city);
        return ResponseEntity.ok(nurses);
    }

}