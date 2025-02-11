import React from "react";
import { useNotifications } from "./NotificationContext";

export default function Notifications() {
  const { notifications, markAsRead } = useNotifications();

  return (
    <div className="notifications-container">
      <h2>Notifications</h2>
      <ul className="list-group">
        {notifications.map((notif) => (
          <li key={notif.id} className={`list-group-item ${notif.read ? "read" : "unread"}`}>
            <small className="text-muted">{new Date(notif.date).toLocaleDateString()}</small>
            <div>{notif.message}</div>
            {!notif.read && (
              <button 
                className="btn btn-sm btn-primary float-end" 
                onClick={() => markAsRead(notif.id)}
              >
                Marquer comme lu
              </button>
            )}
          </li>
        ))}
      </ul>
    </div>
  );
}