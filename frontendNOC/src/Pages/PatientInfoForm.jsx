import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom'; // Importez useNavigate
import './PatientInfoForm.css'; // Importez le fichier CSS

export function PatientInfoForm() {
  console.log("Composant PatientInfoForm rendu");
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [address, setAddress] = useState('');
  const [gender, setGender] = useState('male'); // Utilisez `gender` au lieu de `sex`
  const [dateOfBirth, setDateOfBirth] = useState('');
  const [medicalConditions, setMedicalConditions] = useState('');
  const [cinDocument, setCinDocument] = useState(null);
  const [message, setMessage] = useState(''); // Pour afficher un message de succès ou d'erreur

  const userId = localStorage.getItem('userId'); // Récupérer l'ID de l'utilisateur
  const navigate = useNavigate(); // Déclarez useNavigate

  // Vérifiez que navigate est bien une fonction
  console.log("navigate est une fonction :", typeof navigate === 'function');

  const handleSubmit = async (e) => {
    e.preventDefault();
  
    // Ensure the date is in the correct format (yyyy-MM-dd)
    const formattedDateOfBirth = new Date(dateOfBirth).toISOString().split('T')[0];
  
    // Create a FormData object
    const formData = new FormData();
    formData.append('first_name', firstName);
    formData.append('last_name', lastName);
    formData.append('address', address);
    formData.append('gender', gender); // Utilisez `gender` ici
    formData.append('date_of_birth', formattedDateOfBirth);
    formData.append('disease', medicalConditions);
    formData.append('user_id', userId);
    if (cinDocument) {
      formData.append('file', cinDocument);
    }
  
    // Log FormData entries
    for (let [key, value] of formData.entries()) {
      console.log(key, value);
    }
  
    try {
      const response = await fetch('http://localhost:8085/patient-service/api/patients', {
        method: 'POST',
        body: formData,
      });
    
      console.log("Réponse brute du serveur :", response); // <-- Vérifie si la réponse est vide
      
      if (!response.ok) {
        const errorData = await response.text(); // Récupère le texte brut au lieu de JSON
        console.error('Erreur du serveur:', errorData);
        throw new Error('Erreur lors de l\'enregistrement');
      }
    
      const data = await response.json();
      console.log("Données reçues du backend :", data);
      localStorage.setItem('patientId', data.id);
      setMessage('Profil patient enregistré avec succès !');
      navigate('/search-page');
    
    } catch (error) {
      console.error("Erreur lors de la soumission du formulaire :", error);
      setMessage(`Erreur : ${error.message}`);
    }
    
  };
  return (
    <div className="card">
      <div className="card-header">
        <h2>Patient Information</h2>
        <p>Please complete your patient profile.</p>
      </div>
      <div className="card-content">
        <form onSubmit={handleSubmit}>
          <div className="form-grid">
            <div className="form-group">
              <label htmlFor="firstName">First Name</label>
              <input
                id="firstName"
                type="text"
                value={firstName}
                onChange={(e) => setFirstName(e.target.value)}
                required
              />
            </div>
            <div className="form-group">
              <label htmlFor="lastName">Last Name</label>
              <input
                id="lastName"
                type="text"
                value={lastName}
                onChange={(e) => setLastName(e.target.value)}
                required
              />
            </div>
            <div className="form-group">
              <label htmlFor="address">Address</label>
              <input
                id="address"
                type="text"
                value={address}
                onChange={(e) => setAddress(e.target.value)}
                required
              />
            </div>
            <div className="form-group">
              <label>Gender</label>
              <div className="radio-group">
                <label>
                  <input
                    type="radio"
                    name="gender"
                    value="male"
                    checked={gender === 'male'}
                    onChange={(e) => setGender(e.target.value)}
                  />
                  Male
                </label>
                <label>
                  <input
                    type="radio"
                    name="gender"
                    value="female"
                    checked={gender === 'female'}
                    onChange={(e) => setGender(e.target.value)}
                  />
                  Female
                </label>
              </div>
            </div>
            <div className="form-group">
              <label htmlFor="dateOfBirth">Date of Birth</label>
              <input
                id="dateOfBirth"
                type="date"
                value={dateOfBirth}
                onChange={(e) => setDateOfBirth(e.target.value)}
                required
              />
            </div>
            <div className="form-group">
              <label htmlFor="medicalConditions">Medical Conditions</label>
              <textarea
                id="medicalConditions"
                value={medicalConditions}
                onChange={(e) => setMedicalConditions(e.target.value)}
                placeholder="List any medical conditions or allergies"
              />
            </div>
            <div className="form-group">
              <label htmlFor="cinDocument">CIN Document</label>
              <input
                id="cinDocument"
                type="file"
                onChange={(e) => setCinDocument(e.target.files?.[0] || null)}
                required
              />
            </div>
          </div>
          <button type="submit" className="submit-button">
            Submit
          </button>
        </form>
        {message && <p className="message">{message}</p>}
      </div>
    </div>
  );
}