
import { useState } from "react";
import axios from "axios";
import { useAuth } from "@/context/AuthContext";

export default function CreationTacheForm({ closeModal }) {
    const { api } = useAuth();
  const [formData, setFormData] = useState({
    cin: "",
    dateFin: null,
    titre:'',
    dateDebut:null,
    description:'',
    etat:'A-FAIRE'
   
  });
  const [errorMessage, setErrorMessage] = useState("");
  const formatDates = (data) => {
    return {
      ...data,
      dateFin: data.dateFin ? data.dateFin.split('T')[0] : '',
      dateDebut: data.dateDebut ? data.dateDebut.split('T')[0] : ''
    };
  };
  
  

  

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };
  

 
  const handleSubmit = async (e) => {
    e.preventDefault();
  
    const formattedData = formatDates(formData);
  
    try {
      const response = await api.post("/taches", formattedData);
      
      closeModal(); 
  
      afficherNotification('✔️ Tâche créée avec succès', true);
  
    } catch (error) {
      if (error.response) {
        // Vérifiez si le backend a envoyé un message d'erreur structuré
        const errorMessage = error.response.data.error || "Erreur inconnue du serveur.";
        setErrorMessage(errorMessage);
        afficherNotification(errorMessage,false); // Appelle la fonction affichererreur avec le message reçu
      } else if (error.request) {
        setErrorMessage("Aucune réponse du serveur. Veuillez réessayer.");
        afficherNotification("Aucune réponse du serveur.",false);
      } else {
        setErrorMessage("Erreur inconnue : " + error.message);
        afficherNotification("Erreur inconnue : " + error.message,false);
      }
    }
  };
  
 
  
  
  
 

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
    <div
      className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50"
      onClick={closeModal}
    >
      <div
        className="bg-white rounded-lg shadow-lg w-11/12 md:w-2/3 lg:w-1/2 xl:w-1/3 p-4 md:p-6 relative border border-[#ADBBDA]"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Bouton de fermeture */}
        <button
          onClick={closeModal}
          className="absolute top-2 right-2 md:top-4 md:right-4 text-white bg-[#3D52A0] w-8 h-8 rounded-full flex items-center justify-center shadow-md hover:bg-[#7091E6] transition-colors"
        >
          &times;
        </button>
  
        {/* Titre du formulaire */}
        <h2 className="text-xl md:text-2xl font-bold text-[#3D52A0] mb-4">
          Formulaire de création d'une tâche
        </h2>
  
        {/* Formulaire */}
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Section Informations */}
          <>
            <h3 className="text-lg font-semibold text-[#3D52A0]">Informations de la Tâche</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {/* Champ CIN */}
              <input
                type="text"
                name="cin"
                placeholder="CIN"
                value={formData.cin}
                onChange={handleInputChange}
                className="p-2 md:p-3 border border-[#ADBBDA] rounded-md focus:ring-2 focus:ring-[#7091E6] focus:border-[#7091E6] text-[#3D52A0] text-sm md:text-base"
              />
              {/* Champ Titre */}
              <input
                type="text"
                name="titre"
                placeholder="Titre"
                value={formData.titre}
                onChange={handleInputChange}
                className="p-2 md:p-3 border border-[#ADBBDA] rounded-md focus:ring-2 focus:ring-[#7091E6] focus:border-[#7091E6] text-[#3D52A0] text-sm md:text-base"
              />
            </div>
  
            {/* Champ Description */}
            <div>
              <textarea
                name="description"
                placeholder="Description"
                value={formData.description}
                onChange={handleInputChange}
                rows="4"
                className="w-full p-2 md:p-3 border border-[#ADBBDA] rounded-md focus:ring-2 focus:ring-[#7091E6] focus:border-[#7091E6] text-[#3D52A0] text-sm md:text-base"
              />
            </div>
  
            {/* Dates de Début et de Fin */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {/* Date de Début */}
              <div className="relative">
                <label
                  htmlFor="datedebut"
                  className="absolute -top-2 left-2 md:-top-3 md:left-3 text-xs md:text-sm bg-white px-1 text-[#3D52A0]"
                >
                  Date de Début
                </label>
                <input
                  id="datedebut"
                  type="date"
                  name="dateDebut"
                  value={formData.dateDebut}
                  onFocus={(e) => (e.target.type = "date")}
                  onChange={handleInputChange}
                  className="w-full p-2 md:p-3 border border-[#ADBBDA] rounded-md focus:ring-2 focus:ring-[#7091E6] focus:border-[#7091E6] text-[#3D52A0] text-sm md:text-base"
                />
              </div>
  
              {/* Date de Fin */}
              <div className="relative">
                <label
                  htmlFor="datefin"
                  className="absolute -top-2 left-2 md:-top-3 md:left-3 text-xs md:text-sm bg-white px-1 text-[#3D52A0]"
                >
                  Date de Fin
                </label>
                <input
                  id="datefin"
                  type="date"
                  name="dateFin"
                  value={formData.dateFin}
                  onFocus={(e) => (e.target.type = "date")}
                  onChange={handleInputChange}
                  className="w-full p-2 md:p-3 border border-[#ADBBDA] rounded-md focus:ring-2 focus:ring-[#7091E6] focus:border-[#7091E6] text-[#3D52A0] text-sm md:text-base"
                />
              </div>
            </div>
  
            {/* Bouton "Créer la Tâche" */}
            <button
              type="submit"
              className="w-full bg-gradient-to-r from-[#7091E6] to-[#3D52A0] text-white py-2 md:py-3 rounded-lg shadow-md hover:from-[#3D52A0] hover:to-[#7091E6] focus:ring-4 focus:ring-[#7091E6] transition-all duration-300"
            >
              Créer la Tâche
            </button>
          </>
        </form>
      </div>
    </div>
  );
}
