import React from "react";
import { TrashIcon } from 'lucide-react';


const NotificationItem = ({ notification, onMarkAsRead, onDelete }) => {
  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleString('fr-FR', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const handleDelete = async (e) => {
    e.stopPropagation(); 
    await onDelete(notification.id);
  };

  return (
    <div
      onClick={() => onMarkAsRead(notification.id)}
      className={`
        bg-white rounded-lg border-l-4 shadow-sm hover:shadow-md
        transition-all duration-200 cursor-pointer
        ${notification.statut ? "border-[#4CAF50]" : "border-[#FFA500]"}
      `}
    >
      <div className="p-4">
        <div className="flex justify-between items-start mb-2">
          <div className="flex-1">
            <h3 className="font-semibold text-[#3D52A0]">
              {notification.titre}
            </h3>
            <p className="text-sm text-[#8697C4] mt-1">
              {notification.contenu}
            </p>
          </div>
          <div className="flex items-center space-x-2">
            <span
              className={`ml-4 px-2 py-1 text-xs font-medium rounded-full ${
                notification.statut
                  ? "bg-[#E8F5E9] text-[#4CAF50]" // Vue
                  : "bg-[#FFF3E0] text-[#FFA500]" // Non vue
              }`}
            >
              {notification.statut ? "Vue" : "Non vue"}
            </span>
            <button 
              onClick={handleDelete}
              className="text-[#8697C4] hover:text-[#3D52A0]"
            >
              <span className="text-lg">×</span> {/* Icône Supprimer */}
            </button>
          </div>
        </div>
        
        <div className="flex justify-between items-center mt-3 text-xs text-[#8697C4]">
          <span className="flex items-center">
            <svg
              className="h-4 w-4 mr-1 text-[#7091E6]"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
              />
            </svg>
            De: {notification.nomexpediteur}
          </span>
          <time className="flex items-center">
            <svg
              className="h-4 w-4 mr-1 text-[#7091E6]"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
              />
            </svg>
            {formatDate(notification.createdAt)}
          </time>
        </div>
      </div>
    </div>
  );
};

export default NotificationItem;