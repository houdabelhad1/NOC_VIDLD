package com.hbdev.patientservice.web;

import com.hbdev.patientservice.entity.Patient;
import com.hbdev.patientservice.service.PatientService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.HttpStatusCode;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

/*@CrossOrigin(origins = "http://localhost:5173", allowedHeaders = "*", allowCredentials = "true")*/
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
                                                 @RequestParam("gender") String gender, // Add this parameter
                                                 @RequestParam("date_of_birth") String dateOfBirth,
                                                 @RequestParam("disease") String disease,
                                                 @RequestParam("user_id") Long userId,
                                                 @RequestParam("file") MultipartFile file) {
        try {
            Patient patient = new Patient();
            patient.setFirstName(firstName);
            patient.setLastName(lastName);
            patient.setAddress(address);
            patient.setGender(gender);
            patient.setDateOfBirth(java.sql.Date.valueOf(dateOfBirth));
            patient.setDisease(disease);
            patient.setUserId(userId);

            Patient savedPatient = patientService.savePatient(patient, file);

            return ResponseEntity.status(HttpStatus.CREATED).body(savedPatient);
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(null);
        }
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

    // Add this method to PatientController
    @GetMapping("/{id}")
    public ResponseEntity<Patient> getPatientById(@PathVariable Long id) {
        try {
            Patient patient = patientService.findById(id);
            return ResponseEntity.ok(patient);
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body(null);
        }
    }
}
