import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import axios from "axios";
import { FaBell } from "react-icons/fa";
import "./ChatbotStyles.css";

const SearchPage = () => {
  const [city, setCity] = useState("");
  const [nurses, setNurses] = useState([]);
  const [allNurses, setAllNurses] = useState([]);
  const [notifications, setNotifications] = useState([]);
  const [showNotifications, setShowNotifications] = useState(false);
  const [chatMessages, setChatMessages] = useState([]);
  const [userMessage, setUserMessage] = useState("");

  const patientId = localStorage.getItem("patientId");

  useEffect(() => {
    const fetchNurses = async () => {
      try {
        const response = await axios.get("http://localhost:8085/nurse-service/api/nurses");
        setNurses(response.data);
        setAllNurses(response.data);
      } catch (error) {
        console.error("Erreur lors de la récupération des infirmières :", error);
      }
    };
    fetchNurses();
  }, []);

  useEffect(() => {
    const fetchNotifications = async () => {
      try {
        const response = await axios.get(`http://localhost:8085/notifications?patientId=${patientId}`);
        setNotifications(response.data);
      } catch (error) {
        console.error("Erreur lors de la récupération des notifications :", error);
      }
    };

    const interval = setInterval(fetchNotifications, 15000);
    fetchNotifications();
    return () => clearInterval(interval);
  }, [patientId]);

  const handleSearch = (e) => {
    e.preventDefault();
    const filteredNurses = city.trim()
      ? allNurses.filter((nurse) =>
          nurse.geographicArea.toLowerCase().includes(city.toLowerCase())
        )
      : allNurses;
    setNurses(filteredNurses);
  };

  const handleUserMessage = async (e) => {
    e.preventDefault();
    if (userMessage.trim()) {
      setChatMessages((prevMessages) => [...prevMessages, { sender: "user", text: userMessage }]);

      try {
        const response = await axios.get(
          `http://localhost:8089/ask-health-advice?question=${encodeURIComponent(userMessage)}`
        );
        setChatMessages((prevMessages) => [...prevMessages, { sender: "bot", text: response.data }]);
      } catch (error) {
        setChatMessages((prevMessages) => [
          ...prevMessages,
          { sender: "bot", text: "Désolé, je n'ai pas pu obtenir de réponse pour cette question." },
        ]);
      }
    }
    setUserMessage("");
  };

  return (
    <div className="container">
      {/* Navbar */}
      <nav className="navbar">
        <h1>Accueil</h1>
        <div className="nav-actions">
          <div className="notification-icon" onClick={() => setShowNotifications(!showNotifications)}>
            <FaBell size={24} />
            {notifications.length > 0 && <span className="notification-badge"></span>}
          </div>
          <Link to="/personal-space" className="personal-space-btn">Espace Personnel</Link>
        </div>
        {showNotifications && (
          <div className="notifications-dropdown">
            {notifications.length === 0 ? (
              <p>Aucune notification</p>
            ) : (
              notifications.map((notif, index) => (
                <div key={index} className="notification-item">{notif.message}</div>
              ))
            )}
          </div>
        )}
      </nav>

      {/* Barre de recherche */}
      <div className="search-bar">
        <form onSubmit={handleSearch}>
          <input type="text" placeholder="Ville" value={city} onChange={(e) => setCity(e.target.value)} />
          <button type="submit">Rechercher</button>
        </form>
      </div>

      {/* Liste des infirmières */}
      <div className="profiles-grid">
        {nurses.map((nurse) => (
          <div key={nurse.id} className="profile-card">
            <Link to={`/profile/${nurse.id}`}>
              <h3>{nurse.name}</h3>
              <p>{nurse.phoneNumber}</p>
              <p>{nurse.geographicArea}</p>
            </Link>
          </div>
        ))}
      </div>

      {/* Chatbot */}
      <div className="chatbot-container">
        <div className="chatbot-header">Chatbot Santé</div>
        <div className="chatbot-messages">
          {chatMessages.map((msg, index) => (
            <div key={index} className={`message ${msg.sender}`}>{msg.text}</div>
          ))}
        </div>
        <form onSubmit={handleUserMessage} className="chatbot-input">
          <input type="text" placeholder="Posez une question..." value={userMessage} onChange={(e) => setUserMessage(e.target.value)} />
          <button type="submit">Envoyer</button>
        </form>
      </div>
    </div>
  );
};

export default SearchPage;