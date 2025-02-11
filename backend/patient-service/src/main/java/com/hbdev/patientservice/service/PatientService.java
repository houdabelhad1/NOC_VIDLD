package com.hbdev.patientservice.service;

import com.hbdev.patientservice.client.UserClient;
import com.hbdev.patientservice.entity.Patient;
import com.hbdev.patientservice.repository.PatientRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import java.io.File;
import java.io.IOException;

@Service
public class PatientService {
    @Autowired
    private final PatientRepository patientRepository;
    private final UserClient userClient;

    public PatientService(PatientRepository patientRepository, UserClient userClient) {
        this.patientRepository = patientRepository;
        this.userClient = userClient;
    }

    public Patient savePatient(Patient patient, MultipartFile file) {
        UserClient.UserResponse user = userClient.getUserById(patient.getUserId());
        if (!"patient".equals(user.getRole())) {
            throw new IllegalStateException("User is not a patient!");
        }
        if (file != null && !file.isEmpty()) {
            try {
                String filePath = storeCinDocument(patient.getId(), file);
                patient.setCinDocumentPath(filePath);
            } catch (IOException e) {
                throw new RuntimeException("Erreur lors de l'enregistrement du fichier : " + e.getMessage());
            }
        }
        return patientRepository.save(patient);
    }

    public Patient getPatientById(Long id) {
        return patientRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Patient introuvable"));
    }

    private static final String UPLOAD_DIR = "C:\\Users\\HoudHoud Belhad\\Documents\\uploads";

    public String storeCinDocument(Long patientId, MultipartFile file) throws IOException {
        if (!file.getContentType().equals("application/pdf")) {
            throw new IllegalArgumentException("Le fichier doit être au format PDF!");
        }
        String fileName = "cin" + patientId + "-" + file.getOriginalFilename();
        File destinationFile = new File(UPLOAD_DIR, fileName);
        file.transferTo(destinationFile);
        return destinationFile.getAbsolutePath();
    }
    public Patient findById(Long id) {
        return patientRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Patient not found"));
    }
}
