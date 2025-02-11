import React, { useState } from 'react';
import './LoginForm.css';

export function LoginForm() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
  
    try {
      const response = await fetch('http://localhost:8085/user-service/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username, password }),
      });
  
      const data = await response.json();
  
      if (!response.ok) throw new Error(data.error || 'Login failed');
  
      console.log('Login successful:', data);
      
      localStorage.setItem('token', data.token || '');
      localStorage.setItem('role', data.role || ''); // Stocker le rôle
  
      // Rediriger en fonction du rôle
      if (data.role === 'patient') {
        window.location.href = '/search-page';
      } else if (data.role === 'nurse') {
        window.location.href = '/dashboard';
      } else {
        window.location.href = '/'; // Redirection par défaut si le rôle est inconnu
      }
  
    } catch (err) {
      setError(err.message);
    }
  };
  

  return (
    <div className="card" style={{ width: '350px', margin: 'auto', marginTop: '50px' }}>
      <div className="card-header">
        <h5 className="card-title">Login</h5>
        <p className="card-text">Enter your credentials to access your account.</p>
      </div>
      <div className="card-body">
        <form onSubmit={handleSubmit}>
          <div className="mb-3">
            <label htmlFor="username" className="form-label">Username</label>
            <input
              id="username"
              type="text"
              className="form-control"
              placeholder="Enter your username"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              required
            />
          </div>
          <div className="mb-3">
            <label htmlFor="password" className="form-label">Password</label>
            <input
              id="password"
              type="password"
              className="form-control"
              placeholder="Enter your password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>
          {error && <div className="alert alert-danger">{error}</div>}
          <button type="submit" className="btn btn-primary w-100">Login</button>
        </form>
      </div>
      <div className="card-footer text-center">
        <p className="text-muted">
          Don't have an account? <a href="/register" className="text-primary">Register</a>
        </p>
      </div>
    </div>
  );
}
