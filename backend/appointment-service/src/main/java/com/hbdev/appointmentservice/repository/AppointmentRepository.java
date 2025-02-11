package com.hbdev.appointmentservice.repository;


import com.hbdev.appointmentservice.entity.Appointment;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.time.LocalDate;
import java.time.LocalTime;
import java.util.List;

@Repository
public interface AppointmentRepository extends JpaRepository<Appointment, Long> {
    List<Appointment> findByNurseId(Long nurseId);
    List<Appointment> findByPatientId(Long patientId);
    List<Appointment> findByDate(LocalDate date);
    List<Appointment> findByNurseIdAndDateAndTime(Long nurseId, LocalDate date, LocalTime time);// Récupérer les rendez-vous pour une date donnée
}
