import React, { useEffect, useState } from "react";
import NotificationItemValidation from "../components/NotificationItemValidation";
import { useAuth } from "@/context/AuthContext";

const NotificationList = () => {
  const [notifications, setNotifications] = useState([]);
  const { api } = useAuth();

  useEffect(() => {
    const fetchNotifications = async (cin) => {
      try {
        const res = await api.get("/notifications/11111111");
        const sortedNotifications = res.data.sort((a, b) => {
          if (a.statut === b.statut) {
            return new Date(b.createdAt) - new Date(a.createdAt);
          }
          return a.statut ? 1 : -1;
        });
        setNotifications(sortedNotifications);
      } catch (error) {
        
      } finally {
        
      }
    };
    fetchNotifications(12345678);
  }, []);

  const markAsRead = async (notificationId) => {
    try {
      await api.put(`/notifications/${notificationId}/mark-read`);
      
      setNotifications((prevNotifications) =>
        prevNotifications.map((notification) =>
          notification.id === notificationId
            ? { ...notification, statut: true }
            : notification
        ).sort((a, b) => {
          if (a.statut === b.statut) {
            return new Date(b.createdAt) - new Date(a.createdAt);
          }
          return a.statut ? 1 : -1;
        })
      );
    } catch (error) {
     
      
    }
  };

  const handleDeleteNotification = async (notificationId) => {
    try {
        // Attempt to delete the notification
        await api.delete(`/notifications/${notificationId}/delete`);
        // Update the state after successful deletion
        setNotifications((prevNotifications) =>
            prevNotifications
                .filter(notification => notification.id !== notificationId)
                .sort((a, b) => {
                    if (a.statut === b.statut) {
                        return new Date(b.createdAt) - new Date(a.createdAt);
                    }
                    return a.statut ? 1 : -1;
                })
        );
        // Show success notification
        afficherNotification("Notification supprimée avec succès", true);

    } catch (error) {
        // Handle different types of errors
        let errorMessage = "Une erreur est survenue lors de la suppression";

        // Check if error response exists
        if (error.response) {
            // Server responded with a status code outside 2xx
            if (error.response.status === 404) {
                errorMessage = "La notification n'a pas été trouvée";
            } else if (error.response.status === 403) {
                errorMessage = "Vous n'êtes pas autorisé à supprimer cette notification";
            } else if (error.response.status === 500) {
                errorMessage = "Erreur serveur, veuillez réessayer plus tard";
            }
        } else if (error.request) {
            // No response received (network error)
            errorMessage = "Erreur réseau, veuillez vérifier votre connexion";
        }
        // Show error notification
        afficherNotification(errorMessage, false);
    }
};
const valider = async (notificationId) => {
  try {
      // Make the API call to validate the notification
      const response = await api.get(`/notifications/valider/${notificationId}`);
      // Handle success case based on response status
      if (response.status === 200) {
          afficherNotification(`✅ Notification validée avec succès : ${response.data.message || response.data}`, true);
      } else {
          // Handle unexpected success status codes
          afficherNotification(`⚠️ Réponse inattendue (status ${response.status}) : ${response.data.message || response.data}`, false);
      }
  } catch (error) {
      // Handle different types of errors
      let errorMessage = "Une erreur est survenue lors de la validation";

      if (error.response) {
          // Server responded with a status code outside 2xx
          const { status, data } = error.response;
          if (status === 404) {
              errorMessage = "❌ Notification non trouvée";
          } else if (status === 403) {
              errorMessage = "❌ Vous n'êtes pas autorisé à valider cette notification";
          } else if (status === 400) {
              errorMessage = `❌ Requête invalide : ${data.message || data}`;
          } else if (status === 500) {
              errorMessage = "❌ Erreur serveur, veuillez réessayer plus tard";
          } else {
              errorMessage = `❌ Erreur : ${data.message || data}`;
          }
      } else if (error.request) {
          // No response received (network error)
          errorMessage = "❌ Erreur réseau : Aucun retour du serveur";
      } else {
          // Other errors (e.g., setup error in the request)
          errorMessage = `❌ Erreur : ${error.message}`;
      }

      // Show error notification
      afficherNotification(errorMessage, false);

  }
};

  const rejetter=async (notificationId)=>{
   
    try {
      const response=await api.get(`/notifications/rejetter/${notificationId}`)
       // Handle success case based on response status
       if (response.status === 200) {
        afficherNotification(`✅  ${response.data.message || response.data}`, true);
    } else {
        // Handle unexpected success status codes
        afficherNotification(`⚠️ Réponse inattendue (status ${response.status}) : ${response.data.message || response.data}`, false);
    }
      


    }
    catch (error) {
      // Handle different types of errors
      let errorMessage = "Une erreur est survenue lors de la suppression";

      if (error.response) {
          // Server responded with a status code outside 2xx
          const { status, data } = error.response;
          if (status === 404) {
              errorMessage = "❌ Notification non trouvée";
          } else if (status === 403) {
              errorMessage = "❌ Vous n'êtes pas autorisé à supprimer cette notification";
          } else if (status === 400) {
              errorMessage = `❌ Requête invalide : ${data.message || data}`;
          } else if (status === 500) {
              errorMessage = "❌ Erreur serveur, veuillez réessayer plus tard";
          } else {
              errorMessage = `❌ Erreur : ${data.message || data}`;
          }
      } else if (error.request) {
          // No response received (network error)
          errorMessage = "❌ Erreur réseau : Aucun retour du serveur";
      } else {
          // Other errors (e.g., setup error in the request)
          errorMessage = `❌ Erreur : ${error.message}`;
      }

      // Show error notification
      afficherNotification(errorMessage, false);

  }
    }
  const afficherNotification = (message, success) => {
    const notification = document.createElement('div');
    notification.className = `
      fixed top-5 right-5 p-4 rounded-lg shadow-md border-l-4
      ${success ? 'bg-[#E8F5E9] border-[#4CAF50] text-[#4CAF50]' : 'bg-[#FFEBEE] border-[#FF5252] text-[#FF5252]'}
      animate-slide-in
    `;
    notification.textContent = message;
  
    document.body.appendChild(notification);
  
    // Ajouter l'animation
    const style = document.createElement('style');
    style.textContent = `
      @keyframes slide-in {
        from {
          transform: translateX(100%);
          opacity: 0;
        }
        to {
          transform: translateX(0);
          opacity: 1;
        }
      }
      @keyframes slide-out {
        from {
          transform: translateX(0);
          opacity: 1;
        }
        to {
          transform: translateX(100%);
          opacity: 0;
        }
      }
      .animate-slide-in {
        animation: slide-in 0.5s ease-out;
      }
      .animate-slide-out {
        animation: slide-out 0.5s ease-in forwards;
      }
    `;
    document.head.appendChild(style);
  
    // Retirer la notification après 3 secondes
    setTimeout(() => {
      notification.classList.remove('animate-slide-in');
      notification.classList.add('animate-slide-out');
      setTimeout(() => {
        document.body.removeChild(notification);
        document.head.removeChild(style);
      }, 500);
    }, 3000);
  };

  return (
    <div className="space-y-4">
      {notifications.map(notification => (
        <NotificationItemValidation
          key={notification.id}
          notification={notification}
          onMarkAsRead={markAsRead}
          onDelete={handleDeleteNotification}
          valider={valider}
          rejetter={rejetter}
        />
      ))}
    </div>
  );
};

export default NotificationList;