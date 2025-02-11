import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './NurseInfoForm.css';

export function NurseInfoForm() {
  const navigate = useNavigate();
  const [name, setName] = useState('');
  const [profilePhoto, setProfilePhoto] = useState(null);
  const [phoneNumber, setPhoneNumber] = useState('');
  const [address, setAddress] = useState('');
  const [dateOfBirth, setDateOfBirth] = useState('');
  const [sex, setSex] = useState('male');
  const [professionalId, setProfessionalId] = useState('');
  const [languages, setLanguages] = useState('');
  const [insuranceDocument, setInsuranceDocument] = useState(null);
  const [cinDocument, setCinDocument] = useState(null);
  const [geographicArea, setGeographicArea] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();

    console.log("Données soumises :", {
      name,
      phoneNumber,
      address,
      dateOfBirth,
      sex,
      professionalId,
      languages,
      geographicArea,
      userId: localStorage.getItem('userId')
    });

    const nurse = {
      name,
      phoneNumber,
      address,
      dateOfBirth,
      sex,
      professionalId,
      languages,
      geographicArea,
      userId: localStorage.getItem('userId')
    };

    const formData = new FormData();
    formData.append('nurse', JSON.stringify(nurse));

    if (profilePhoto) formData.append('profilePhoto', profilePhoto);
    if (insuranceDocument) formData.append('insuranceDocument', insuranceDocument);
    if (cinDocument) formData.append('cinDocument', cinDocument);

    try {
      const response = await fetch('http://localhost:8085/nurse-service/api/nurses', {
        method: 'POST',
        body: formData,
      });

      console.log("Statut HTTP :", response.status);
      
      if (!response.ok) {
        const errorData = await response.json();
        console.error('Erreur serveur:', errorData);
        throw new Error(`Erreur HTTP: ${response.status}`);
      }

      const data = await response.json();
      console.log('Réponse réussie:', data);
      localStorage.setItem("nurseId", data.id); 
      
      // Redirection après succès
      navigate('/dashboard');

    } catch (error) {
      console.error('Erreur complète:', error);
      alert(`Échec de l'enregistrement: ${error.message}`);
    }
  };

  return (
    <div className="card">
      <div className="card-header">
        <h2>Nurse Information</h2>
        <p>Please complete your nurse profile.</p>
      </div>
      <div className="card-content">
        <form onSubmit={handleSubmit}>
          <div className="form-grid">
          <div className="form-group">
              <label htmlFor="name">Full Name</label>
              <input
                id="name"
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
              />
            </div>
            <div className="form-group">
              <label htmlFor="profilePhoto">Profile Photo</label>
              <input
                id="profilePhoto"
                type="file"
                accept="image/*"
                onChange={(e) => setProfilePhoto(e.target.files?.[0] || null)}
                required
              />
            </div>
            <div className="form-group">
              <label htmlFor="phoneNumber">Phone Number</label>
              <input
                id="phoneNumber"
                type="tel"
                value={phoneNumber}
                onChange={(e) => setPhoneNumber(e.target.value)}
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
              <label>Sex</label>
              <div className="radio-group">
                <label>
                  <input
                    type="radio"
                    name="sex"
                    value="male"
                    checked={sex === 'male'}
                    onChange={(e) => setSex(e.target.value)}
                  />
                  Male
                </label>
                <label>
                  <input
                    type="radio"
                    name="sex"
                    value="female"
                    checked={sex === 'female'}
                    onChange={(e) => setSex(e.target.value)}
                  />
                  Female
                </label>
              </div>
            </div>
            <div className="form-group">
              <label htmlFor="professionalId">Professional ID Number</label>
              <input
                id="professionalId"
                type="text"
                value={professionalId}
                onChange={(e) => setProfessionalId(e.target.value)}
                required
              />
            </div>
            <div className="form-group">
              <label htmlFor="languages">Languages Spoken</label>
              <input
                id="languages"
                type="text"
                value={languages}
                onChange={(e) => setLanguages(e.target.value)}
                placeholder="e.g. English, French, Arabic"
                required
              />
            </div>
            <div className="form-group">
              <label htmlFor="insuranceDocument">Insurance Document</label>
              <input
                id="insuranceDocument"
                type="file"
                onChange={(e) => setInsuranceDocument(e.target.files?.[0] || null)}
                required
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
            <div className="form-group">
              <label htmlFor="geographicArea">Geographic Area</label>
              <input
                id="geographicArea"
                type="text"
                value={geographicArea}
                onChange={(e) => setGeographicArea(e.target.value)}
                placeholder="e.g. City, Region"
                required
              />
            </div>
          </div>
          <button type="submit" className="submit-button">
            Submit
          </button>
        </form>
      </div>
    </div>
  );
}