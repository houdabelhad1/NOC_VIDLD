import React, { useState, useEffect, useCallback } from "react";
import axios from "axios";

function Profile() {
  // Récupérer l'ID de l'infirmière depuis le local storage
  const nurseId = localStorage.getItem("nurseId");

  const [profile, setProfile] = useState({
    fullName: "",
    phoneNumber: "",
    address: "",
    dateOfBirth: "",
    sex: "",
    professionalIdNumber: "",
    languagesSpoken: "",
    geographicArea: "",
    profilePhoto: "",
  });

  const [error, setError] = useState("");

  /**
   * Récupère le profil de l'infirmière depuis l'API.
   */
  const fetchNurseProfile = useCallback(async () => {
    if (!nurseId) return;
    try {
      const { data: nurseData } = await axios.get(
        `http://localhost:8085/nurse-service/api/nurses/${nurseId}`
      );
      const {
        name = "",
        phoneNumber = "",
        address = "",
        dateOfBirth: rawDateOfBirth,
        sex = "Male",
        professionalId = "",
        languages = "",
        geographicArea = "",
        profilePhotoPath,
      } = nurseData;

      const profilePhotoURL = profilePhotoPath || "/placeholder.svg";
      const formattedDateOfBirth = rawDateOfBirth
        ? new Date(rawDateOfBirth).toISOString().split("T")[0]
        : "";

      setProfile({
        fullName: name,
        phoneNumber,
        address,
        dateOfBirth: formattedDateOfBirth,
        sex,
        professionalIdNumber: professionalId,
        languagesSpoken: languages,
        geographicArea,
        profilePhoto: profilePhotoURL,
      });
    } catch (err) {
      console.error("Erreur lors de la récupération du profil :", err);
      setError("Erreur de chargement du profil");
    }
  }, [nurseId]);

  // Récupérer le profil dès que le composant est monté et que nurseId est disponible
  useEffect(() => {
    if (nurseId) {
      fetchNurseProfile();
    } else {
      setError("Aucun identifiant trouvé dans le local storage.");
    }
  }, [nurseId, fetchNurseProfile]);

  /**
   * Met à jour l'état du profil lors du changement d'un champ du formulaire.
   */
  const handleInputChange = useCallback((e) => {
    const { name, value } = e.target;
    setProfile((prevProfile) => ({
      ...prevProfile,
      [name]: value,
    }));
  }, []);

  /**
   * Gère la soumission du formulaire pour mettre à jour le profil.
   */
  const handleSubmit = useCallback(
    async (e) => {
      e.preventDefault();
      try {
        const formData = new FormData();

        // Ajout des champs texte dans le FormData
        formData.append("name", profile.fullName);
        formData.append("phoneNumber", profile.phoneNumber);
        formData.append("address", profile.address);
        formData.append("dateOfBirth", profile.dateOfBirth);
        formData.append("sex", profile.sex);
        formData.append("professionalId", profile.professionalIdNumber);
        formData.append("languages", profile.languagesSpoken);
        formData.append("geographicArea", profile.geographicArea);

        // Ajout du fichier (photo de profil) s'il existe
        const fileInput = e.target.elements.profilePhoto;
        if (fileInput && fileInput.files && fileInput.files[0]) {
          formData.append("profilePhoto", fileInput.files[0]);
        }

        console.log("Nurse ID récupéré :", nurseId);

        const response = await axios.put(
          `http://localhost:8085/nurse-service/api/nurses/${nurseId}`,
          formData,
          {
            headers: {
              "Content-Type": "multipart/form-data",
            },
          }
        );

        if (response.status === 200) {
          alert("Mise à jour réussie !");
          fetchNurseProfile(); // Actualise le profil après la mise à jour
        }
      } catch (err) {
        setError(
          err.response?.data?.message || err.message || "Erreur inconnue"
        );
      }
    },
    [profile, nurseId, fetchNurseProfile]
  );

  return (
    <div className="profile-container">
      <h2>Profil de l'infirmière</h2>
      {error && <div className="alert alert-danger">{error}</div>}
      <form onSubmit={handleSubmit}>
        <div className="row">
          <div className="col-md-4">
            <img
              src={profile.profilePhoto}
              alt="Profile"
              className="img-fluid rounded-circle mb-3"
            />
            <input
              type="file"
              className="form-control mb-3"
              name="profilePhoto"
              accept="image/*"
            />
          </div>
          <div className="col-md-8">
            {[
              { name: "fullName", label: "Nom complet", type: "text" },
              { name: "phoneNumber", label: "Téléphone", type: "text" },
              { name: "address", label: "Adresse", type: "text" },
              { name: "dateOfBirth", label: "Date et heure de naissance", type: "datetime-local" },
              { name: "sex", label: "Sexe", type: "text" },
              {
                name: "professionalIdNumber",
                label: "Identifiant professionnel",
                type: "text",
              },
              { name: "languagesSpoken", label: "Langues parlées", type: "text" },
              { name: "geographicArea", label: "Zone géographique", type: "text" },
            ].map((field) => (
              <div className="mb-3" key={field.name}>
                <label htmlFor={field.name} className="form-label">
                  {field.label}
                </label>
                <input
                  type={field.type}
                  className="form-control"
                  id={field.name}
                  name={field.name}
                  value={profile[field.name] || ""}
                  onChange={handleInputChange}
                />
              </div>
            ))}
            <button type="submit" className="btn btn-primary">
              Mettre à jour le profil
            </button>
          </div>
        </div>
      </form>
    </div>
  );
}

export default Profile;
