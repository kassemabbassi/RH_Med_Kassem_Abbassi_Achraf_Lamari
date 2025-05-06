
import { useState } from "react";
import { useAuth } from "@/context/AuthContext";

export default function CreationForm({ closeModal }) {
    const { api } = useAuth();
  const [formData, setFormData] = useState({
    cin: "",
    identifiant: "",
    nom: "",
    prenom: "",
    adresse: "",
    telephone: null,
    situation: "",
    sexe: "",
    datenaissance: null,
    handicape: "",
    email: "",
    role: "",
    grade: "",
    poste: "",
    dateDebut: null,
    specialite: "",
    departement: "",
    anciennete: "",
    heures_supp: null,
  });
  const formatDates = (data) => {
    return {
      ...data,
      datenaissance: data.datenaissance ? data.datenaissance.split('T')[0] : '',
      dateDebut: data.dateDebut ? data.dateDebut.split('T')[0] : ''
    };
  };
  

  const [currentStep, setCurrentStep] = useState(1);
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };
  const validateFormData = (data) => {
    // Validation CIN (numérique, longueur = 8)
    if (!/^\d{8}$/.test(data.cin)) {
      afficherNotification("❌ Le CIN doit contenir exactement 8 chiffres", false);
      return false;
    }
  
    // Validation identifiant (numérique, longueur = 5)
    if (!/^\d{5}$/.test(data.identifiant)) {
      afficherNotification("❌ L'identifiant doit contenir exactement 5 chiffres", false);
      return false;
    }
  
    // Validation nom (alphabétique, max 20 caractères)
    if (!/^[A-Za-z\s]{1,20}$/.test(data.nom)) {
      afficherNotification("❌ Le nom doit être alphabétique et ne pas dépasser 20 caractères", false);
      return false;
    }
  
    // Validation prénom (alphabétique, max 20 caractères)
    if (!/^[A-Za-z\s]{1,20}$/.test(data.prenom)) {
      afficherNotification("❌ Le prénom doit être alphabétique et ne pas dépasser 20 caractères", false);
      return false;
    }
  
    // Validation email
    const emailRegex = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
    if (!emailRegex.test(data.email)) {
      afficherNotification("❌ Format email invalide", false);
      return false;
    }
  
    // Validation téléphone (numérique, longueur = 8, commence par 2, 5 ou 9)
    if (!/^[259]\d{7}$/.test(data.telephone)) {
      afficherNotification("❌ Le téléphone doit contenir 8 chiffres et commencer par 2, 5 ou 9", false);
      return false;
    }
  
    
  
    // Validation heures supplémentaires
    if (data.heures_supp === null || (!Number.isFinite(Number(data.heures_supp)) || Number(data.heures_supp) < 0)) {
      afficherNotification("❌ Les heures supplémentaires doivent être un nombre positif", false);
      return false;
    }
  
    const currentDate = new Date();
  
    // Validation date de naissance
    if (!data.datenaissance) {
      afficherNotification("❌ La date de naissance est obligatoire", false);
      return false;
    }
    const birthDate = new Date(data.datenaissance);
    if (birthDate >= currentDate) {
      afficherNotification("❌ La date de naissance doit être antérieure à la date actuelle", false);
      return false;
    }
  
    // Validation date de début
    if (!data.dateDebut) {
      afficherNotification("❌ La date de début est obligatoire", false);
      return false;
    }
    const startDate = new Date(data.dateDebut);
    if (startDate >= currentDate) {
      afficherNotification("❌ La date de début doit être antérieure à la date actuelle", false);
      return false;
    }
    if (startDate <= birthDate) {
      afficherNotification("❌ La date de début doit être postérieure à la date de naissance", false);
      return false;
    }
    return true;
  };
  
  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validateFormData(formData)) {
      return; // Sort si la validation échoue
    }
  
    try {
      const formattedData = formatDates(formData);
      const response = await api.post("/user/create", formattedData);
      
      if (response.data && response.status === 200) {
        closeModal();
        afficherNotification('✔️ Utilisateur créé avec succès et email envoyé', true);
      } else {
        afficherNotification("❌ Erreur lors de la création de l'utilisateur", false);
      }
    } catch (error) {
      if (error.response) {
        const errorMessage = error.response.data.message || error.response.data.error || "Erreur lors de la création de l'utilisateur";
        afficherNotification(`❌ ${errorMessage}`, false);
      } else if (error.request) {
        afficherNotification("❌ Pas de réponse du serveur. Vérifiez votre connexion.", false);
      } else {
        afficherNotification(`❌ Erreur lors de l'envoi de la requête: ${error.message}`, false);
      }
    }
  };
  
  const afficherNotification = (message, success) => {
    const notification = document.createElement('div');
    notification.className = `
      fixed top-5 right-5 p-4 rounded-lg shadow-md text-white
      ${success ? 'bg-green-500' : 'bg-red-500'}
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
      .animate-slide-in {
        animation: slide-in 0.5s ease-out;
      }
    `;
    document.head.appendChild(style);
  
    // Retirer la notification après 3 secondes
    setTimeout(() => {
      notification.style.animation = 'slide-out 0.5s ease-in forwards';
      setTimeout(() => {
        document.body.removeChild(notification);
        document.head.removeChild(style);
      }, 500);
    }, 3000);
  };
  
 
  


  
  
// Options pour le champ "Role"
const roleOptions = [
  { value: "ensignant", label: "Enseignant" },
  { value: "employee", label: "Administrateur" },
];

// Options pour le champ "Département"
const departementOptions = [
  { value: "Informatique", label: "Informatique" },
  { value: "Mathématiques", label: "Mathématiques" },
];

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
        Formulaire d'ajout de client
      </h2>

      {/* Formulaire */}
      <form onSubmit={handleSubmit} className="space-y-4">
        {/* Section Utilisateur */}
        {currentStep === 1 && (
          <>
            <h3 className="text-lg font-semibold text-[#3D52A0]">Informations Utilisateur</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-2 md:gap-4">
              {/* Champs de formulaire */}
              {[
                { name: "cin", placeholder: "CIN" },
                { name: "identifiant", placeholder: "Identifiant" },
                { name: "nom", placeholder: "Nom" },
                { name: "prenom", placeholder: "Prénom" },
                { name: "adresse", placeholder: "Adresse" },
                { name: "telephone", placeholder: "Téléphone", type: "number" },
                { name: "email", placeholder: "Email", type: "email" },
              ].map((field) => (
                <input
                  key={field.name}
                  type={field.type || "text"}
                  name={field.name}
                  placeholder={field.placeholder}
                  value={formData[field.name]}
                  onChange={handleInputChange}
                  className="p-2 md:p-3 border border-[#ADBBDA] rounded-md focus:ring-2 focus:ring-[#7091E6] focus:border-[#7091E6] text-[#3D52A0] text-sm md:text-base"
                />
              ))}

              {/* Liste déroulante pour Situation */}
              <select
                name="situation"
                value={formData.situation}
                onChange={handleInputChange}
                className="p-2 md:p-3 border border-[#ADBBDA] rounded-md focus:ring-2 focus:ring-[#7091E6] focus:border-[#7091E6] text-[#3D52A0] text-sm md:text-base"
              >
                <option value="" disabled>Situation</option>
                <option value="Célibataire">Célibataire</option>
                <option value="Marié">Marié</option>
              </select>

              {/* Liste déroulante pour Sexe */}
              <select
                name="sexe"
                value={formData.sexe}
                onChange={handleInputChange}
                className="p-2 md:p-3 border border-[#ADBBDA] rounded-md focus:ring-2 focus:ring-[#7091E6] focus:border-[#7091E6] text-[#3D52A0] text-sm md:text-base"
              >
                <option value="" disabled>Sexe</option>
                <option value="Homme">Homme</option>
                <option value="Femme">Femme</option>
              </select>

              {/* Date de naissance */}
              <div className="relative w-full">
                <label
                  htmlFor="datenaissance"
                  className="absolute -top-2 left-2 md:-top-3 md:left-3 text-xs md:text-sm bg-white px-1 text-[#3D52A0]"
                >
                  Date de naissance
                </label>
                <input
                  id="datenaissance"
                  type="date"
                  name="datenaissance"
                  value={formData.datenaissance}
                  onChange={handleInputChange}
                  className="w-full p-2 md:p-3 border border-[#ADBBDA] rounded-md focus:ring-2 focus:ring-[#7091E6] focus:border-[#7091E6] text-[#3D52A0] text-sm md:text-base"
                />
              </div>

              {/* Liste déroulante pour Handicapé */}
              <select
                name="handicape"
                value={formData.handicape}
                onChange={handleInputChange}
                className="p-2 md:p-3 border border-[#ADBBDA] rounded-md focus:ring-2 focus:ring-[#7091E6] focus:border-[#7091E6] text-[#3D52A0] text-sm md:text-base"
              >
                <option value="" disabled>Handicapé</option>
                <option value="Oui">Oui</option>
                <option value="Non">Non</option>
              </select>
            </div>

            {/* Bouton Suivant */}
            <div className="flex justify-end mt-4">
              <button
                type="button"
                onClick={() => setCurrentStep(2)}
                className="text-[#7091E6] hover:text-[#3D52A0] flex items-center space-x-2 transition-colors text-sm md:text-base"
              >
                <span>Suivant</span>
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="16"
                  height="16"
                  fill="currentColor"
                  className="bi bi-arrow-right"
                  viewBox="0 0 16 16"
                >
                  <path d="M10.854 8.354a.5.5 0 0 1 0 .707l-3 3a.5.5 0 0 1-.708-.708L9.293 9H3.5a.5.5 0 0 1 0-1h5.793l-2.147-2.146a.5.5 0 1 1 .708-.708l3 3z" />
                </svg>
              </button>
            </div>
          </>
        )}

        {/* Section Rôle */}
        {currentStep === 2 && (
          <>
            <h3 className="text-lg font-semibold text-[#3D52A0]">Plus d'informations</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-2 md:gap-4">
              {/* Champ Role */}
              <select
                name="role"
                value={formData.role}
                onChange={handleInputChange}
                className="p-2 md:p-3 border border-[#ADBBDA] rounded-md focus:ring-2 focus:ring-[#7091E6] focus:border-[#7091E6] text-[#3D52A0] text-sm md:text-base"
              >
                <option value="" disabled>Role</option>
                {roleOptions.map((option) => (
                  <option key={option.value} value={option.value}>
                    {option.label}
                  </option>
                ))}
              </select>

              {/* Autres champs */}
              {[
                { name: "grade", placeholder: "Grade" },
                { name: "poste", placeholder: "Poste" },
                { name: "specialite", placeholder: "Spécialité" },
                { name: "anciennete", placeholder: "Ancienneté" },
                { name: "heures_supp", placeholder: "Heures Supplémentaires", type: "number" },
              ].map((field) => (
                <input
                  key={field.name}
                  type={field.type || "text"}
                  name={field.name}
                  placeholder={field.placeholder}
                  value={formData[field.name]}
                  onChange={handleInputChange}
                  className="p-2 md:p-3 border border-[#ADBBDA] rounded-md focus:ring-2 focus:ring-[#7091E6] focus:border-[#7091E6] text-[#3D52A0] text-sm md:text-base"
                />
              ))}

              {/* Champ Département */}
              <select
                name="departement"
                value={formData.departement}
                onChange={handleInputChange}
                className="p-2 md:p-3 border border-[#ADBBDA] rounded-md focus:ring-2 focus:ring-[#7091E6] focus:border-[#7091E6] text-[#3D52A0] text-sm md:text-base"
              >
                <option value="" disabled>Département</option>
                {departementOptions.map((option) => (
                  <option key={option.value} value={option.value}>
                    {option.label}
                  </option>
                ))}
              </select>

              {/* Date de début */}
              <div className="relative w-full">
                <label
                  htmlFor="datedebut"
                  className="absolute -top-2 left-2 md:-top-3 md:left-3 text-xs md:text-sm bg-white px-1 text-[#3D52A0]"
                >
                  Date de début
                </label>
                <input
                  id="datedebut"
                  type="date"
                  name="dateDebut"
                  value={formData.dateDebut}
                  onChange={handleInputChange}
                  className="w-full p-2 md:p-3 border border-[#ADBBDA] rounded-md focus:ring-2 focus:ring-[#7091E6] focus:border-[#7091E6] text-[#3D52A0] text-sm md:text-base"
                />
              </div>
            </div>

            {/* Boutons de navigation et Enregistrer */}
            <div className="flex justify-between items-center mt-4">
              <button
                type="button"
                onClick={() => setCurrentStep(1)}
                className="text-[#7091E6] hover:text-[#3D52A0] flex items-center space-x-2 transition-colors text-sm md:text-base"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="16"
                  height="16"
                  fill="currentColor"
                  className="bi bi-arrow-left"
                  viewBox="0 0 16 16"
                >
                  <path d="M5.854 8.354a.5.5 0 1 1-.708-.708L7.293 6H1.5a.5.5 0 0 1 0-1h5.793L5.146 3.854a.5.5 0 1 1 .708-.708l3 3a.5.5 0 0 1 0 .708l-3 3z" />
                </svg>
                <span>Précédent</span>
              </button>
              <button
                type="submit"
                className="bg-[#7091E6] text-white py-2 px-4 md:py-3 md:px-6 rounded-md hover:bg-[#3D52A0] focus:ring-2 focus:ring-[#7091E6] transition-colors text-sm md:text-base"
              >
                Enregistrer
              </button>
            </div>
          </>
        )}
      </form>
    </div>
  </div>
);
}
