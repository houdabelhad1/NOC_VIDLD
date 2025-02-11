import React, { useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, useNavigate } from 'react-router-dom';
import { RegisterForm } from './Pages/RegisterFom';
import { PatientInfoForm } from './Pages/PatientInfoForm';
import { NurseInfoForm } from './Pages/NurseInfoForm';
import { LoginForm } from './Pages/LoginForm';
import { NurseDashboard } from './Pages/NurseDashboard';
import { SearchPageLayout } from './Pages/SearchPageLayout';
import NurseProfile from './Pages/NurseProfile';
import { NotificationProvider } from './Pages/components/NotificationContext';

function ProtectedRoute({ children }) {
  const navigate = useNavigate();
  useEffect(() => {
    const role = localStorage.getItem('role');
    if (!role) {
      navigate('/login'); // Si pas connecté, rediriger vers login
    }
  }, []);

  return children;
}

function App() {
  return (
    <Router>
      <NotificationProvider>
        <Routes>
          <Route path="/register" element={<RegisterForm />} />
          <Route path="/patient-info" element={<PatientInfoForm />} />
          <Route path="/nurse-info" element={<NurseInfoForm />} />
          <Route path="/login" element={<LoginForm />} />
          <Route 
            path="/dashboard" 
            element={<ProtectedRoute><NurseDashboard /></ProtectedRoute>} 
          />
          <Route 
            path="/search-page/*" 
            element={<ProtectedRoute><SearchPageLayout /></ProtectedRoute>} 
          />
          <Route path="/nurse-profile/*" element={<NurseProfile />} />
          <Route path="/profile/:id" element={<NurseProfile />} />
        </Routes>
      </NotificationProvider>
    </Router>
  );
}

export default App;
