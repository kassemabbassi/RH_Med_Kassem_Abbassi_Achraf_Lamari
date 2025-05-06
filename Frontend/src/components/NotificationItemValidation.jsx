import React from "react";

import { CheckCircle, XCircle, Trash2, User, Calendar } from "lucide-react";
const NotificationItemValidation = ({ notification, onMarkAsRead, onDelete,valider,rejetter }) => {
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

  const handleValidate = async (e) => {
    e.stopPropagation();
    await valider(notification.id)
    onMarkAsRead(notification.id)
    await new Promise(resolve => setTimeout(resolve, 3000));
    await onDelete(notification.id)
  };

  const handleReject = async (e) => {
    e.stopPropagation();
    await rejetter(notification.id)
    await new Promise(resolve => setTimeout(resolve, 3000));
    await onDelete(notification.id)
   
  };

  return (
    <div
      onClick={() => onMarkAsRead(notification.id)}
      className={`relative bg-white rounded-lg border-l-4 shadow-md hover:shadow-lg transition-all duration-300 p-6 cursor-pointer border-red-500`}
    >
      {/* Supprimer Notification */}
      <button
        onClick={handleDelete}
        className="absolute top-4 right-4 text-gray-400 hover:text-red-500 transition duration-200"
      >
        <Trash2 className="w-5 h-5" />
      </button>

      {/* Titre & Contenu */}
      <div className="flex justify-between items-start mb-4">
        <div className="flex-1">
          <h3 className="font-semibold text-gray-900 text-lg">{notification.titre}</h3>
          <p className="text-sm text-gray-600 mt-2">{notification.contenu}</p>
        </div>
        
      </div>

      {/* Infos Expéditeur & Date */}
      <div className="flex justify-between items-center text-sm text-gray-500">
        <span className="flex items-center">
          <User className="w-4 h-4 text-blue-500 mr-2" />
          {notification.nomexpediteur}
        </span>
        <span className="flex items-center">
          <Calendar className="w-4 h-4 text-blue-500 mr-2" />
          {formatDate(notification.createdAt)}
        </span>
      </div>

      <div className="flex justify-end space-x-3 mt-5">
  <button 
    onClick={handleValidate}
    className="flex items-center px-4 py-2 rounded-lg shadow-md text-white font-semibold 
      bg-[#7091E6] hover:bg-[#3D52A0] transition-all duration-300"
  >
    <CheckCircle className="w-5 h-5 mr-2" />
    Valider
  </button>
  <button 
    onClick={handleReject}
    className="flex items-center px-4 py-2 rounded-lg shadow-md text-white font-semibold 
      bg-[#E85A5A] hover:bg-[#A83232] transition-all duration-300"
  >
    <XCircle className="w-5 h-5 mr-2" />
    Rejeter
  </button>
</div>

    </div>
  );
};

export default NotificationItemValidation;