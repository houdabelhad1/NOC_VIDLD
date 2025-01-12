import React, { useState } from 'react';
import Register from './components/Register';
import Login from './components/Login';
import './App.css'; // Import the styles

function App() {
  const [isRegisterPage, setIsRegisterPage] = useState(true);

  const togglePage = () => {
    setIsRegisterPage(!isRegisterPage);
  };

  return (
    <div className="App">
      <div className="form-container">
        <div className="text-center mb-3">
          <button className="btn btn-primary" onClick={togglePage}>
            {isRegisterPage ? 'Go to Login' : 'Go to Register'}
          </button>
        </div>
        {isRegisterPage ? <Register /> : <Login />}
      </div>
    </div>
  );
}

export default App;
