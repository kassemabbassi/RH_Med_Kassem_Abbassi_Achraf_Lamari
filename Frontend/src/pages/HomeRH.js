



import React, { useEffect, useState } from "react";
import axios from "axios";
import NotificationItem from "../components/NotificationItem";
import AffichageJournal from "../components/AffichageJournal";
import SimpleTable from "../components/SimpleTable";
import { useRouter } from 'next/navigation';
import NotificationList from "./NotificationsList";

const HomeRH = () => {
 
  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState("notifications");
  const [isMobileView, setIsMobileView] = useState(false);
  const [isJournalVisible, setIsJournalVisible] = useState(false);
  const [isvalidation, setIsValidation] = useState(false);
  const [currentView, setCurrentView] = useState("notifications");
  const [isHovering, setIsHovering] = useState(false);
  const [userData, setUserData] = useState(null);

   const router = useRouter();

  
   // Check screen size and update view
   useEffect(() => {
    const checkScreenSize = () => {
      setIsMobileView(window.innerWidth < 1024);
    };

    checkScreenSize();
    window.addEventListener('resize', checkScreenSize);
    return () => window.removeEventListener('resize', checkScreenSize);
  }, []);


    // Fetch user data and notifications
    /*useEffect(() => {
      const user = JSON.parse(localStorage.getItem("user"));
      if (!user) {
        window.location.href = "/login";
      } else {
        setUserData(user);
        fetchNotifications(user.cin);
      }
    }, []);*/

 
  const fetchNotifications = async (cin) => {
    try {
      const res = await axios.get(`http://localhost:8080/notifications/${cin}`);
      // Sort notifications with unread first, then by creation date
      const sortedNotifications = res.data.sort((a, b) => {
        if (a.statut === b.statut) {
          return new Date(b.createdAt) - new Date(a.createdAt);
        }
        return a.statut ? 1 : -1;
      });
      setNotifications(sortedNotifications);
    } catch (error) {
      console.error("Erreur lors de la récupération des notifications:", error);
    } finally {
      setLoading(false);
    }
  };


  const markAsRead = async (notificationId) => {
    try {
      await axios.put(
        `http://localhost:8080/notifications/${notificationId}/mark-read`
      );
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
     
      console.error("Erreur lors de la mise à jour du statut:", error);
    }
  };
  const handleDeleteNotification = async (notificationId) => {
    try {
      await axios.delete(`http://localhost:8080/notifications/${notificationId}/delete`);
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
    } catch (error) {
      console.error("Erreur lors de la suppression de la notification:", error);
    }
  };  

  const navButtons = [
    { id: "utilisateurs", label: "Gestion des utilisateurs", route: "/GestionUtilisateurs" },
    { id: "taches", label: "Taches", route: "/GestionTaches" },
    { id: "recherche", label: "Recherche", route: "/Recherche" },
    { id: "stats", label: "Statistiques", route: "/Statistiques" },
    { id: "params", label: "Paramétres", route: "/Parametres" },
  ];
  
  const handleNavigation = (button) => {
    if (button.route) {
      router.push(button.route);
    } else {
      setActiveTab(button.id);
    }
  };

  const renderContent = () => {
    if (isMobileView) {
      return (
        <div className="flex flex-col">
          {/* Barre de navigation mobile */}
          <div className="flex overflow-x-auto bg-white shadow-md">
            {navButtons.map((button) => (
              <button
                key={button.id}
                onClick={() => handleNavigation(button)}
                className={`flex-1 px-4 py-3 text-sm font-medium border-b-2 transition-colors ${
                  activeTab === button.id
                    ? "border-[#7091E6] text-[#3D52A0]"
                    : "border-transparent text-[#8697C4] hover:text-[#3D52A0]"
                }`}
              >
                {button.label}
              </button>
            ))}
          </div>
  
          {/* Boutons de vue (Notifications, Data Table, Journal) */}
          <div className="flex justify-around bg-[#EDE8F5] py-2">
            <button
              onClick={() => setCurrentView("notifications")}
              className={`px-4 py-2 rounded-lg ${
                currentView === "notifications" 
                  ? "bg-[#7091E6] text-white" 
                  : "bg-white text-[#8697C4] hover:bg-[#F5F3FB]"
              }`}
            >
              Notifications
            </button>
            <button
              onClick={() => setCurrentView("data")}
              className={`px-4 py-2 rounded-lg ${
                currentView === "data" 
                  ? "bg-[#7091E6] text-white" 
                  : "bg-white text-[#8697C4] hover:bg-[#F5F3FB]"
              }`}
            >
              Data Table
            </button>
            <button
              onClick={() => {
                setCurrentView("journal");
                setIsJournalVisible(true);
              }}
              className={`px-4 py-2 rounded-lg ${
                currentView === "journal" 
                  ? "bg-[#7091E6] text-white" 
                  : "bg-white text-[#8697C4] hover:bg-[#F5F3FB]"
              }`}
            >
              Journal
            </button>
            <button
              onClick={() => {
                setCurrentView("validation");
                setIsValidation(true);
              }}
              className={`px-4 py-2 rounded-lg ${
                currentView === "validation" 
                  ? "bg-[#7091E6] text-white" 
                  : "bg-white text-[#8697C4] hover:bg-[#F5F3FB]"
              }`}
            >
              Notifications a valider
            </button>
          </div>
  
          {/* Contenu principal */}
          <div className="p-4">
            {currentView === "notifications" && (
              <div className="bg-white rounded-lg shadow-md p-4">
                <h1 className="text-2xl font-bold text-[#3D52A0] mb-4">
                  Centre de Notifications
                </h1>
                {loading ? (
                  <div className="flex justify-center items-center h-32">
                    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#7091E6]"></div>
                  </div>
                ) : notifications.length === 0 ? (
                  <div className="flex flex-col items-center justify-center h-32 text-[#8697C4]">
                    <svg
                      className="h-12 w-12 mb-2 text-[#EDE8F5]"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9"
                      />
                    </svg>
                    <p>Aucune notification disponible</p>
                  </div>
                ) : (
                  <div className="grid gap-4">
                    {notifications.map((notification) => (
                      <NotificationItem
                        key={notification.id}
                        notification={notification}
                        onMarkAsRead={markAsRead}
                        onDelete={handleDeleteNotification}
                      />
                    ))}
                  </div>
                )}
              </div>
            )}
  
            {currentView === "data" && (
              <SimpleTable />
            )}
  
            {currentView === "journal" && isJournalVisible && (
              <div className="mt-4">
                <AffichageJournal />
              </div>
            )}
            {currentView === "validation" && isvalidation && (
              
                <NotificationList/>
              
            )}
          </div>
        </div>
      );
    }
  
    return (
      <div className="flex w-full">
        <div 
          className="w-[70%] p-6 relative"
          onMouseEnter={() => setIsHovering(true)}
          onMouseLeave={() => setIsHovering(false)}
        >
          {isHovering && (
            <div className="absolute top-2 right-2 z-10 flex gap-2">
              {currentView === 'notifications' ? (
                <>
                  <button 
                    onClick={() => setCurrentView('data')}
                    className="bg-[#7091E6] text-white px-3 py-1 rounded-lg shadow-md hover:bg-[#3D52A0] transition-colors"
                  >
                    Voir Table
                  </button>
                  <button 
                    onClick={() => setCurrentView('notifications-validate')}
                    className="bg-[#7091E6] text-white px-3 py-1 rounded-lg shadow-md hover:bg-[#3D52A0] transition-colors"
                  >
                    Notifications à Valider
                  </button>
                   
                </>
              ) : currentView === 'data' ? (
                <>
                  <button 
                    onClick={() => setCurrentView('notifications')}
                    className="bg-[#7091E6] text-white px-3 py-1 rounded-lg shadow-md hover:bg-[#3D52A0] transition-colors"
                  >
                    Voir Notifications
                  </button>
                  <button 
                    onClick={() => setCurrentView('notifications-validate')}
                    className="bg-[#7091E6] text-white px-3 py-1 rounded-lg shadow-md hover:bg-[#3D52A0] transition-colors"
                  >
                    Notifications à Valider
                  </button>
                  
                </>
              ) : currentView === 'notifications-validate' ? (
                <>
                  <button 
                    onClick={() => setCurrentView('notifications')}
                    className="bg-[#7091E6] text-white px-3 py-1 rounded-lg shadow-md hover:bg-[#3D52A0] transition-colors"
                  >
                    Voir Notifications
                  </button>
                  <button 
                    onClick={() => setCurrentView('data')}
                    className="bg-[#7091E6] text-white px-3 py-1 rounded-lg shadow-md hover:bg-[#3D52A0] transition-colors"
                  >
                    Voir Table
                  </button>
                </>
              ) : null}
            </div>
          )}
     
          {currentView === 'notifications' ? (
            <div className="bg-white rounded-lg shadow-md p-6 mb-6">
              <h1 className="text-2xl font-bold text-[#3D52A0] mb-6">
                Centre de Notifications
              </h1>
              {loading ? (
                <div className="flex justify-center items-center h-32">
                  <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#7091E6]"></div>
                </div>
              ) : notifications.length === 0 ? (
                <div className="flex flex-col items-center justify-center h-32 text-[#8697C4]">
                  <svg
                    className="h-12 w-12 mb-2 text-[#EDE8F5]"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9"
                    />
                  </svg>
                  <p>Aucune notification disponible</p>
                </div>
              ) : (
                <div className="grid gap-4">
                  {notifications.map((notification) => (
                    <NotificationItem
                      key={notification.id}
                      notification={notification}
                      onMarkAsRead={markAsRead}
                      onDelete={handleDeleteNotification}
                    />
                  ))}
                </div>
              )}
            </div>
          ) : currentView === 'data' ? (
            <div className="bg-white rounded-lg shadow-md p-6 mb-6">
              <SimpleTable />
            </div>
          ) : currentView === 'notifications-validate' ? (
            <div className="bg-white rounded-lg shadow-md p-6 mb-6">
              <h1 className="text-2xl font-bold text-[#3D52A0] mb-6">
                Notifications à Valider
              </h1>
              <NotificationList />
            </div>
          ) : null}
        </div>
        <AffichageJournal />
      </div>
     );}
  
  return (
    <div className="min-h-screen bg-[#EDE8F5]">
      {/* Desktop Navbar (hidden on mobile) */}
      {!isMobileView && (
        <nav className="bg-white shadow-md">
          <div className="max-w-7xl mx-auto px-4">
            <div className="flex justify-between h-16">
              <div className="flex space-x-4">
                {navButtons.map((button) => (
                  <button
                    key={button.id}
                    onClick={() => handleNavigation(button)}
                    className={`inline-flex items-center px-4 py-2 border-b-2 font-medium text-sm focus:outline-none transition-colors duration-200 ease-in-out ${
                      activeTab === button.id
                        ? "border-[#7091E6] text-[#3D52A0]"
                        : "border-transparent text-[#8697C4] hover:text-[#3D52A0] hover:border-[#ADBBDA]"
                    }`}
                  >
                    {button.label}
                  </button>
                ))}
              </div>
            </div>
          </div>
        </nav>
      )}
  
      {renderContent()}
    </div>
  );
};

export default HomeRH;
