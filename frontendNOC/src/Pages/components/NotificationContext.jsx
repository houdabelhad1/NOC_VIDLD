import { createContext, useContext, useState, useEffect } from 'react';
import axios from 'axios';

const NotificationContext = createContext();

export const NotificationProvider = ({ children }) => {
  const [notifications, setNotifications] = useState([]);

  // Fonction pour charger les notifications
  const fetchNotifications = async () => {
    try {
      const userId = localStorage.getItem('userId'); // Correction du nom de variable
if (!userId) {
  throw new Error("User ID not found in localStorage");
}
const response = await axios.get(`http://localhost:8085/api/notifications/user/${userId}`);
      setNotifications(response.data);
    } catch (error) {
      console.error("Erreur de chargement des notifications:", error);
    }
  };

  // Charger les notifications au montage du composant
  useEffect(() => {
    fetchNotifications();
  }, []);

  // Rafraîchir les notifications toutes les 10 secondes
  useEffect(() => {
    const interval = setInterval(fetchNotifications, 10000); // Rafraîchir toutes les 10 secondes
    return () => clearInterval(interval); // Nettoyer l'intervalle lors du démontage
  }, []);

  const addNotification = async (message) => {
    try {
      const newNotification = {
        message,
        read: false,
        userId: userId // Ajouter l'userId depuis le localStorage
      };
  
      const response = await axios.post('http://localhost:8085/api/notifications', newNotification);
      setNotifications(prev => [response.data, ...prev]); // Utiliser la réponse du serveur
    } catch (error) {
      console.error("Erreur d'ajout de la notification:", error);
    }
  };

  const markAsRead = async (id) => {
    try {
      // Mettre à jour la notification comme lue dans le backend
      await axios.patch(`http://localhost:8085/api/notifications/${id}/mark-as-read`);
      setNotifications(prev => 
        prev.map(notif => 
          notif.id === id ? { ...notif, read: true } : notif
        )
      );
    } catch (error) {
      console.error("Erreur de mise à jour de la notification:", error);
    }
  };

  return (
    <NotificationContext.Provider value={{ notifications, addNotification, markAsRead }}>
      {children}
    </NotificationContext.Provider>
  );
};

export const useNotifications = () => useContext(NotificationContext);