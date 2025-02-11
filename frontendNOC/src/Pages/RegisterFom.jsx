import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom'; // Pour la redirection
import './RegisterForm.css'; // Importez le fichier CSS

export function RegisterForm() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [userType, setUserType] = useState('patient');
  const [message, setMessage] = useState(''); // Pour afficher un message de succès ou d'erreur
  const navigate = useNavigate(); // Hook pour la redirection

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Créez un objet avec les données du formulaire
    const userData = {
      email,
      password,
      role: userType, // Assurez-vous que le backend attend un champ "role"
    };

    try {
      // Envoyez les données au backend
      const response = await fetch('http://localhost:8085/user-service/api/auth/register', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(userData),
      });

      if (!response.ok) {
        const errorData = await response.json(); // Parse the error response
        console.error('Error response:', errorData);
        throw new Error(errorData.error || 'Erreur lors de l\'enregistrement');
      }

      const data = await response.json();
      console.log('Registration response:', data); // Log the response

      if (!data.userId) {
        throw new Error('userId non défini dans la réponse du serveur');
      }

      setMessage(`Inscription réussie ! ID utilisateur : ${data.userId}`);

      // Stocker l'ID de l'utilisateur dans le localStorage en tant que nombre
      localStorage.setItem('userId', data.userId.toString()); // Convert to string for localStorage

      // Rediriger vers le formulaire approprié en fonction du type d'utilisateur
      if (userType === 'patient') {
        navigate('/patient-info'); // Rediriger vers PatientInfoForm
      } else if (userType === 'nurse') {
        navigate('/nurse-info'); // Rediriger vers NurseInfoForm
      }
    } catch (error) {
      setMessage(`Erreur : ${error.message}`);
    }
  };

  return (
    <div className="form-container">
      <h2>Register</h2>
      <p>Create a new account to access our services.</p>
      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <label htmlFor="email">Email address</label>
          <input
            type="email"
            id="email"
            placeholder="Enter email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
        </div>

        <div className="form-group">
          <label htmlFor="password">Password</label>
          <input
            type="password"
            id="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
        </div>

        <div className="form-group">
          <label>User Type</label>
          <div className="radio-group">
            <label>
              <input
                type="radio"
                name="userType"
                value="patient"
                checked={userType === 'patient'}
                onChange={(e) => setUserType(e.target.value)}
              />
              Patient
            </label>
            <label>
              <input
                type="radio"
                name="userType"
                value="nurse"
                checked={userType === 'nurse'}
                onChange={(e) => setUserType(e.target.value)}
              />
              Nurse
            </label>
          </div>
        </div>

        <button type="submit" className="submit-button">
          Register
        </button>
      </form>
      {message && <p className="message">{message}</p>}
      <p className="login-link">
        Already have an account? <a href="/login">Login</a>
      </p>
    </div>
  );
}