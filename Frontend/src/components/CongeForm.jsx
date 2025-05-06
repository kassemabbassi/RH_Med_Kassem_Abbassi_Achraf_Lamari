import React, { useState } from "react";
import { useRouter } from "next/router";
import { useAuth } from "@/context/AuthContext";

const CongeForm = ({ closeModal }) => {
  const { api } = useAuth();
  const [leaveType, setLeaveType] = useState("");
  const [startDate, setStartDate] = useState("");
  const [period, setPeriod] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();
  const { cin } = router.query;

  const leaveTypes = [
    { id: 1, label: "Congé annuel" },
    { id: 2, label: "Congé maladie" },
    { id: 3, label: "Congé maternité/paternité" },
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
    if (new Date(startDate) < new Date()) {
      afficherNotification("La date de début de congé doit être après la date actuelle.", false);
      return;
  }
  
    if (!leaveType || !startDate || !period) {
      afficherNotification("Veuillez remplir tous les champs.", false);
      return;
    }
  
    if (!cin) {
      afficherNotification("Le CIN n'est pas défini.", false);
      return;
    }
  
    setIsLoading(true);
  
    try {
      const response = await api.post("/user/conge/demande", {
        cinExpediteur: cin,
        type: leaveType,
        dateDebut: startDate,
        periode: period,
      });
  
      if (response.status === 200) {
        closeModal();
        afficherNotification(`✅ Demande de congé envoyée avec succès pour le type : ${leaveType}`, true);
      } else {
        afficherNotification(response.data?.message || "Une erreur inconnue est survenue", false);
      }
    } catch (err) {
      const errorMessage =
        typeof err.response?.data === "string"
          ? err.response.data
          : err.response?.data?.message || "Erreur lors de l'envoi de la demande";
  
      afficherNotification(errorMessage, false);
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
        <div className="relative p-6 border-b border-[#ADBBDA]">
          <button
            onClick={closeModal}
            className="absolute right-4 top-4 w-8 h-8 flex items-center justify-center rounded-full text-[#8697C4] hover:text-[#3D52A0] hover:bg-[#EDE8F5] transition-colors"
          >
            ✕
          </button>
          <h2 className="text-2xl font-bold bg-gradient-to-r from-[#3D52A0] to-[#7091E6] bg-clip-text text-transparent">
            Demande de congé
          </h2>
        </div>

        <form className="p-6 space-y-4" onSubmit={handleSubmit}>
          <div>
            <label className="block text-sm font-medium text-[#3D52A0]">Type de congé</label>
            <select
              value={leaveType}
              onChange={(e) => setLeaveType(e.target.value)}
              className="w-full px-4 py-3 bg-[#EDE8F5] rounded-xl border border-[#ADBBDA] focus:ring-2 focus:ring-[#3D52A0]"
            >
              <option value="" disabled>Sélectionnez un type de congé</option>
              {leaveTypes.map((type) => (
                <option key={type.id} value={type.label}>{type.label}</option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-[#3D52A0]">Date de début</label>
            <input
              type="date"
              value={startDate}
              onChange={(e) => setStartDate(e.target.value)}
              className="w-full px-4 py-3 bg-[#EDE8F5] rounded-xl border border-[#ADBBDA] focus:ring-2 focus:ring-[#3D52A0]"
            />
          </div>

         

          <div>
            <label className="block text-sm font-medium text-[#3D52A0]">Période (en jours)</label>
            <input
              type="number"
              value={period}
              onChange={(e) => setPeriod(e.target.value)}
              className="w-full px-4 py-3 bg-[#EDE8F5] rounded-xl border border-[#ADBBDA] focus:ring-2 focus:ring-[#3D52A0]"
              min="1"
            />
          </div>

          <button
            type="submit"
            disabled={isLoading}
            className="w-full py-3 px-6 rounded-xl bg-gradient-to-r from-[#3D52A0] to-[#7091E6] text-white font-medium hover:shadow-lg hover:scale-[1.02] focus:ring-2 focus:ring-[#3D52A0]"
          >
            {isLoading ? "Envoi en cours..." : "Envoyer la demande"}
          </button>
        </form>
      </div>
    </div>
  );
};

export default CongeForm;
