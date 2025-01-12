package com.hbdev.patientservice.web;

import com.hbdev.patientservice.entity.Patient;
import com.hbdev.patientservice.service.PatientService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.HttpStatusCode;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

@RestController
@RequestMapping("/api/patients")
public class PatientController {
    @Autowired
    private final PatientService patientService;

    public PatientController(PatientService patientService){
        this.patientService = patientService;
    }

    @PostMapping
    public ResponseEntity<Patient> createPatient(@RequestParam("first_name") String firstName,
                                                 @RequestParam("last_name") String lastName,
                                                 @RequestParam("address") String address,
                                                 @RequestParam("date_of_birth") String dateOfBirth,
                                                 @RequestParam("disease") String disease,
                                                 @RequestParam("user_id") Long userId,
                                                 @RequestParam("file") MultipartFile file){
        Patient patient = new Patient();
        patient.setFirstName(firstName);
        patient.setLastName(lastName);
        patient.setAddress(address);
        patient.setDateOfBirth(java.sql.Date.valueOf(dateOfBirth));  // Assurez-vous que le format est correct
        patient.setDisease(disease);
        patient.setUserId(userId);
        // Enregistrez le patient avec le fichier PDF
        Patient savedPatient = patientService.savePatient(patient, file);

        // Retournez une réponse avec le patient créé
        return ResponseEntity.status(HttpStatus.CREATED).body(savedPatient);
    }
   /* @PostMapping("/{id}/upload-cin")
    public ResponseEntity<String> uploadCin(@PathVariable Long id, @RequestParam("file")MultipartFile file){
        try{
            String filePath = patientService.storeCinDocument(id,file);
            return ResponseEntity.ok("File CIN Succefully uploaded");
        } catch (Exception e){
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body("Erreur lors du téléchargement du file"+e.getMessage());
        }
    }*/
}
