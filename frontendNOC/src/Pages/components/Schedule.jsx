import React, { useState, useEffect, useCallback, useRef } from "react";
import FullCalendar from "@fullcalendar/react";
import dayGridPlugin from "@fullcalendar/daygrid";
import timeGridPlugin from "@fullcalendar/timegrid";
import interactionPlugin from "@fullcalendar/interaction";
import axios from "axios";

function Schedule() {
  // État initial vide, nous ajouterons le créneau personnel et les rendez-vous récupérés depuis l'API.
  const [events, setEvents] = useState([]);

  // Ref pour éviter de lancer plusieurs fois l'appel à l'API (surtout en mode Strict de React 18).
  const didFetchRef = useRef(false);

  /**
   * Calcule l'heure de fin en ajoutant une durée d'une heure à l'heure de début.
   *
   * @param {string} date - La date au format YYYY-MM-DD.
   * @param {string} startTime - L'heure de début au format HH:MM (ou HH:MM:SS).
   * @returns {string} L'heure de fin au format ISO (sans les millisecondes).
   */
  const calculateEndTime = (date, startTime) => {
    const start = new Date(`${date}T${startTime}`);
    const end = new Date(start.getTime() + 60 * 60 * 1000); // Ajoute 1 heure
    return end.toISOString().split('.')[0];
  };

  // Récupération des rendez-vous depuis l'API lors du montage du composant
  useEffect(() => {
    // Si l'appel a déjà été effectué, on ne le refait pas.
    if (didFetchRef.current) return;
    didFetchRef.current = true;

    const fetchAppointments = async () => {
      try {
        const response = await axios.get(
          "http://localhost:8085/appointment-service/api/appointments"
        );

        // On suppose que chaque rendez-vous contient patientId, date et time.
        // On ajoute un identifiant unique (ici en se basant sur l'index).
        const appointments = response.data.map(({ patientId, date, time }, index) => ({
          id: `appointment-${index}`,
          title: `Patient ${patientId}`,
          start: `${date}T${time}`,
          end: calculateEndTime(date, time),
          color: "#3788d8",
          allDay: false
        }));

        // Créneau personnel à ajouter
        const personalTimeEvent = {
          id: "personal-time",
          title: "Personal Time",
          start: "2023-06-02T14:00:00",
          end: "2023-06-02T16:00:00",
          color: "green"
        };

        // Combine les événements et filtre les doublons (basé sur l'id)
        const combinedEvents = [personalTimeEvent, ...appointments];
        const uniqueEvents = Array.from(
          new Map(combinedEvents.map(event => [event.id, event])).values()
        );
        setEvents(uniqueEvents);
      } catch (error) {
        console.error("Erreur de chargement des rendez-vous:", error);
      }
    };

    fetchAppointments();
  }, []);

  // Gère la sélection d'une plage horaire pour ajouter un créneau personnel
  const handleDateSelect = useCallback((selectInfo) => {
    const title = prompt("Nom du créneau personnel:");
    if (title) {
      const newEvent = {
        id: `personal-${selectInfo.startStr}`, // Génère un id unique en fonction de l'heure de début
        title,
        start: selectInfo.startStr,
        end: selectInfo.endStr,
        color: "green",
        allDay: selectInfo.allDay
      };
      setEvents(prevEvents => {
        // Ajoute le nouvel événement et filtre les doublons
        const updatedEvents = [...prevEvents, newEvent];
        const uniqueEvents = Array.from(
          new Map(updatedEvents.map(event => [event.id, event])).values()
        );
        return uniqueEvents;
      });
    }
  }, []);

  return (
    <div className="schedule-container">
      <h2>Emploi du temps</h2>
      <FullCalendar
        plugins={[dayGridPlugin, timeGridPlugin, interactionPlugin]}
        initialView="timeGridWeek"
        headerToolbar={{
          left: "prev,next today",
          center: "title",
          right: "dayGridMonth,timeGridWeek,timeGridDay"
        }}
        // Affiche la journée complète (de 00:00 à 24:00)
        slotMinTime="00:00:00"
        slotMaxTime="24:00:00"
        events={events}
        selectable={true}
        select={handleDateSelect}
        eventDidMount={(info) => {
          info.el.style.cursor = "pointer";
          info.el.title = info.event.title;
        }}
      />
    </div>
  );
}

export default Schedule;
