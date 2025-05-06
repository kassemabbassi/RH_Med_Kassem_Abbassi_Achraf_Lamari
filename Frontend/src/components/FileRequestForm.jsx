import React, { useState } from "react";
import { useRouter } from "next/router";
import { useAuth } from "@/context/AuthContext";


const FileRequestForm = ({ closeModal }) => {
    const { api } = useAuth();
  const [selectedFileType, setSelectedFileType] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();
  const { cin } = router.query;

  const fileTypes = [
    { id: 1, label: "Certificat de travail" },
    { id: 2, label: "Attestation de congé" }
  ];
  const afficherNotification = (message, success = true) => {
    // Supprimer les notifications existantes
    const existingNotifications = document.querySelectorAll('.notification');
    existingNotifications.forEach(el => el.remove());
  
    // Créer l'élément de notification
    const notification = document.createElement('div');
    notification.className = `
      notification
      fixed top-5 right-5 p-4 rounded-lg shadow-md border-l-4 z-[100]
      ${success ? 'bg-[#E8F5E9] border-[#4CAF50] text-[#4CAF50]' : 'bg-[#FFEBEE] border-[#FF5252] text-[#FF5252]'}
      animate-slide-in
    `;
    notification.textContent = message;
  
    // Ajouter les styles d'animation
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
  
    // Ajouter la notification au body
    document.body.appendChild(notification);
  
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

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!selectedFileType) {
      afficherNotification("Veuillez sélectionner un type de fichier.", false);
      return;
    }

    if (!cin) {
      afficherNotification("Le CIN n'est pas défini.", false);
      return;
    }

    setIsLoading(true);

    try {
      const response = await api.post("/notifications/demande", {
        cinexpediteur: cin,
        type: selectedFileType,
      });
      
      
    
      
    
      if (response.status === 200 && response.data) {
        afficherNotification(response.data.message || `Demande envoyée avec succès pour : ${selectedFileType}`, true);
        closeModal();
      } 
    } catch (err) {
      
       
        afficherNotification(err.response   .data , false);
      
    } finally {
      setIsLoading(false);
    }
    
  };

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black/60 backdrop-blur-sm z-50 p-4">
      <div
        className="bg-white w-full max-w-md rounded-2xl shadow-2xl transform transition-all text-[#3D52A0]"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="relative p-6 border-b border-[#ADBBDA]">
          <button
            onClick={closeModal}
            className="absolute right-4 top-4 w-8 h-8 flex items-center justify-center rounded-full text-[#8697C4] hover:text-[#3D52A0] hover:bg-[#EDE8F5] transition-colors"
          >
            ✕
          </button>
          <h2 className="text-2xl font-bold bg-gradient-to-r from-[#3D52A0] to-[#7091E6] bg-clip-text text-transparent">
            Demande de fichier
          </h2>
        </div>

        {/* Formulaire */}
        <form className="p-6 space-y-6" onSubmit={handleSubmit}>
          {/* Sélection du type de fichier */}
          <div className="space-y-2">
            <label className="block text-sm font-medium text-[#3D52A0]">
              Type de fichier
            </label>
            <select
              value={selectedFileType}
              onChange={(e) => setSelectedFileType(e.target.value)}
              className="w-full px-4 py-3 bg-[#EDE8F5] rounded-xl border border-[#ADBBDA] hover:border-[#3D52A0] focus:outline-none focus:ring-2 focus:ring-[#3D52A0] focus:border-[#3D52A0] transition-colors"
            >
              <option value="" disabled>
                Sélectionnez un type de fichier
              </option>
              {fileTypes.map((fileType) => (
                <option key={fileType.id} value={fileType.label}>
                  {fileType.label}
                </option>
              ))}
            </select>
          </div>

          {/* Bouton d'envoi */}
          <button
            type="submit"
            disabled={isLoading}
            className="w-full py-3 px-6 rounded-xl bg-gradient-to-r from-[#3D52A0] to-[#7091E6] text-white font-medium 
            transform transition-all hover:shadow-lg hover:scale-[1.02] active:scale-[0.98]
            focus:outline-none focus:ring-2 focus:ring-[#3D52A0] focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isLoading ? "Envoi en cours..." : "Envoyer la demande"}
          </button>
        </form>
      </div>
    </div>
  );
};

export default FileRequestForm;