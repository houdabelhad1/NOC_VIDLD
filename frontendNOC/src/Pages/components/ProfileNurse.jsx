import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";
import { useNotifications } from "./NotificationContext";

const ProfileNurse = () => {
  const { id } = useParams();
  const [nurse, setNurse] = useState(null);
  const [date, setDate] = useState("");
  const [time, setTime] = useState("");
  const [address, setAddress] = useState("");
  const { addNotification } = useNotifications();

  // Récupération des infos infirmier
  useEffect(() => {
    const fetchNurse = async () => {
      try {
        const response = await axios.get(`http://localhost:8085/nurse-service/api/nurses/${id}`);
        setNurse(response.data);
      } catch (error) {
        console.error("Erreur de chargement des infos infirmier:", error);
        addNotification("Erreur de chargement du profil infirmier");
      }
    };
    fetchNurse();
  }, [id, addNotification]);

  // Soumission du formulaire
  const handleReservation = async (e) => {
    e.preventDefault();
    try {
      const appointmentData = {
        nurseId: id,
        patientId: 1, // À remplacer par l'ID utilisateur réel
        date,
        time: time + ":00", // Ajout des secondes pour le format SQL
        address
      };

      const response = await axios.post(
        "http://localhost:8085/appointment-service/api/appointments",
        appointmentData
      );

      if (response.status === 200) {
        addNotification(`Rendez-vous confirmé le ${date} à ${time}`);
        setDate("");
        setTime("");
        setAddress("");
      }
    } catch (error) {
      console.error("Erreur de réservation:", error.response?.data || error.message);
      addNotification("Échec de la réservation : " + (error.response?.data?.error || "Erreur serveur"));
    }
  };

  if (!nurse) {
    return <div className="container mt-5">Chargement du profil...</div>;
  }

  return (
    <div className="container mt-5">
      <div className="row">
        <div className="col-md-6">
          <h1>{nurse.name}</h1>
          <p>📞 {nurse.phoneNumber}</p>
          <p>📍 {nurse.geographicArea}</p>
          <p className="text-muted">{nurse.bio}</p>
        </div>

        <div className="col-md-6">
          <div className="card shadow">
            <div className="card-body">
              <h2 className="card-title mb-4">Prendre rendez-vous</h2>
              <form onSubmit={handleReservation}>
                <div className="mb-3">
                  <label className="form-label">Date</label>
                  <input
                    type="date"
                    className="form-control"
                    value={date}
                    onChange={(e) => setDate(e.target.value)}
                    min={new Date().toISOString().split('T')[0]}
                    required
                  />
                </div>

                <div className="mb-3">
                  <label className="form-label">Heure</label>
                  <input
                    type="time"
                    className="form-control"
                    value={time}
                    onChange={(e) => setTime(e.target.value)}
                    min="08:00"
                    max="18:00"
                    required
                  />
                </div>

                <div className="mb-4">
                  <label className="form-label">Adresse d'intervention</label>
                  <textarea
                    className="form-control"
                    rows="3"
                    value={address}
                    onChange={(e) => setAddress(e.target.value)}
                    placeholder="Entrez l'adresse complète"
                    required
                  ></textarea>
                </div>

                <button 
                  type="submit" 
                  className="btn btn-primary w-100 py-2"
                >
                  Confirmer la réservation
                </button>
              </form>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProfileNurse;
