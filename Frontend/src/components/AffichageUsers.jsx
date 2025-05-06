
import { useState, useEffect } from "react";
import ModificationForm from "./modificationform";
import { useAuth } from "@/context/AuthContext";

const AffichageUsers = () => {
  const { api } = useAuth();
  const [users, setUsers] = useState([]);
  const [emploiDetails, setEmploiDetails] = useState(null); // Stocke les détails de l'emploi
  const [isDetailsVisible, setIsDetailsVisible] = useState(false); // Contrôle la visibilité de la div
  const [hoveredCin, setHoveredCin] = useState(null); // CIN de l'utilisateur sur lequel on survole

  const [isFormOpen, setIsFormOpen] = useState(false);


  const openForm = () => setIsFormOpen(true); // Ouvre le formulaire
  const closeForm = () => setIsFormOpen(false);
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
    date_debut: null,
    specialite: "",
    departement: "",
    anciennete: "",
    solde_conge: null,
    heures_supp: null,
  }); 
  
  
  useEffect(() => {
    api.get("/user/all")
      .then(response => {
        setUsers(response.data);
      })
      .catch(error => {
      });
  }, []);


 
    const recupererCin = (cin) => {
      // Créer le conteneur de la boîte de dialogue
      const dialogContainer = document.createElement('div');
dialogContainer.className = `
  fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50
`;

// Créer la boîte de dialogue
const dialogBox = document.createElement('div');
dialogBox.className = `
  bg-white rounded-lg shadow-lg w-11/12 md:w-96 border border-[#ADBBDA]
`;

// Titre
const dialogHeader = document.createElement('div');
dialogHeader.className = `
  bg-[#3D52A0] text-white text-lg font-bold p-4 rounded-t-lg
`;
dialogHeader.textContent = 'Confirmation de suppression';

// Message
const dialogMessage = document.createElement('p');
dialogMessage.className = `
  p-6 text-[#3D52A0] text-center
`;
dialogMessage.textContent = "Êtes-vous sûr de vouloir supprimer cet utilisateur ?";

// Boutons
const buttonContainer = document.createElement('div');
buttonContainer.className = `
  flex justify-around items-center bg-[#EDE8F5] p-4 rounded-b-lg
`;

const confirmButton = document.createElement('button');
confirmButton.className = `
  bg-[#7091E6] hover:bg-[#3D52A0] text-white px-4 py-2 rounded-md shadow-md 
  transition duration-200 ease-in-out
`;
confirmButton.textContent = 'Confirmer';
confirmButton.addEventListener('click', () => {
  document.body.removeChild(dialogContainer);
  envoyerRequeteSuppression(cin);
});

const cancelButton = document.createElement('button');
cancelButton.className = `
  bg-[#8697C4] hover:bg-[#3D52A0] text-white px-4 py-2 rounded-md shadow-md
  transition duration-200 ease-in-out
`;
cancelButton.textContent = 'Annuler';
cancelButton.addEventListener('click', () => {
  document.body.removeChild(dialogContainer);
});

// Assembler la boîte de dialogue
buttonContainer.appendChild(confirmButton);
buttonContainer.appendChild(cancelButton);
dialogBox.appendChild(dialogHeader);
dialogBox.appendChild(dialogMessage);
dialogBox.appendChild(buttonContainer);
dialogContainer.appendChild(dialogBox);
document.body.appendChild(dialogContainer);
    }
    
    // Fonction pour envoyer la requête de suppression avec Axios
    const envoyerRequeteSuppression = (cin) => {
      api.post('/user/delete', { cin })
        .then(response => {
          afficherNotification('✔️ Utilisateur supprimé avec succès', true);
        })
        .catch(error => {
          afficherNotification('❌ Erreur lors de la suppression', false);
          console.error("Erreur:", error);
        });
    };
    
    // Fonction pour afficher les notifications
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
    
  
  

  // Fonction pour récupérer les détails de l'emploi lorsque l'on survole un utilisateur
  const handleMouseOver = (cin) => {
    setHoveredCin(cin);
  api.get(`/user/${cin}/emploi`)
      .then(response => {
        setEmploiDetails(response.data);
        setIsDetailsVisible(true); // Afficher la div contenant les détails
      })
      .catch(error => {
      });
  };
 
  const formatDate = (dateString) => {
    if (!dateString) return '';
    const date = new Date(dateString);
    return date.toISOString().split('T')[0];
  };
  const recupereruserdata = async (user) => {
    try {
      const emploiResponse = await api.get(`/user/${user.cin}/emploi`);
      const emploiData = emploiResponse.data;

      setFormData({
        cin: user.cin || "",
        identifiant: user.identifiant || "",
        nom: user.nom || "",
        prenom: user.prenom || "",
        adresse: user.adresse || "",
        telephone: user.telephone || "",
        situation: user.situation || "",
        sexe: user.sexe || "",
        datenaissance: formatDate(user.datenaissance),
        handicape: user.handicape || "",
        email: user.email || "",
        role: emploiData.role || "",
        grade: emploiData.grade || "",
        poste: emploiData.poste || "",
        date_debut: formatDate(emploiData.dateDebut),
        specialite: emploiData.specialite || "",
        departement: emploiData.departement || "",
        anciennete: emploiData.anciennete || "",
        solde_conge: emploiData.soldeConge || "",
        heures_supp: emploiData.heuresSuppl || "",
      });

      setIsFormOpen(true);
    } catch (error) {
    }
  };
  

  
  const handleMouseOut = () => {
    setIsDetailsVisible(false); 
  };

  
  const formatCin = (cin) => {
    const cinStr = String(cin);
    const length = cinStr.length;
    if (length <= 2) {
      return cinStr;
    }
    
    const maskedCin = "*".repeat(length - 2) + cinStr.slice(length - 2);
    return maskedCin;
  };

  
  return (

    <div className="relative min-h-screen bg-gray-50"> {/* Détails de l'emploi (popup) */} {isDetailsVisible && emploiDetails && hoveredCin && ( <div className="absolute z-50 top-24 left-1/2 transform -translate-x-1/2 bg-white rounded-lg shadow-xl p-6 border-l-4 border-indigo-600 w-full max-w-md" onMouseLeave={handleMouseOut} > <div className="flex justify-between items-center mb-4"> <h3 className="text-xl font-semibold text-gray-800">Détails de l'emploi</h3> <p className="text-sm text-indigo-600 font-medium">CIN: {hoveredCin}</p> </div> <div className="grid grid-cols-2 gap-4 text-sm"> <div className="bg-gray-50 p-3 rounded-md"> <p className="text-gray-500 text-xs mb-1">Grade</p> <p className="font-medium text-gray-800">{emploiDetails.grade}</p> </div> <div className="bg-gray-50 p-3 rounded-md"> <p className="text-gray-500 text-xs mb-1">Poste</p> <p className="font-medium text-gray-800">{emploiDetails.poste}</p> </div> <div className="bg-gray-50 p-3 rounded-md"> <p className="text-gray-500 text-xs mb-1">Département</p> <p className="font-medium text-gray-800">{emploiDetails.departement}</p> </div> <div className="bg-gray-50 p-3 rounded-md"> <p className="text-gray-500 text-xs mb-1">Ancienneté</p> <p className="font-medium text-gray-800">{emploiDetails.anciennete} ans</p> </div> <div className="bg-gray-50 p-3 rounded-md"> <p className="text-gray-500 text-xs mb-1">Solde de congé</p> <p className="font-medium text-gray-800">{emploiDetails.soldeConge} jours</p> </div> <div className="bg-gray-50 p-3 rounded-md"> <p className="text-gray-500 text-xs mb-1">Heures supplémentaires</p> <p className="font-medium text-gray-800">{emploiDetails.heuresSuppl} heures</p> </div> </div> </div> )}
    {/* Tableau des utilisateurs */}
    <div className="container mx-auto py-6">
      <div className="bg-white rounded-lg shadow-md overflow-hidden">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead>
              <tr className="bg-gray-800 text-white">
                <th className="px-6 py-4 text-left text-xs font-medium uppercase tracking-wider">CIN</th>
                <th className="px-6 py-4 text-left text-xs font-medium uppercase tracking-wider">Identifiant</th>
                <th className="px-6 py-4 text-left text-xs font-medium uppercase tracking-wider">Nom</th>
                <th className="px-6 py-4 text-left text-xs font-medium uppercase tracking-wider">Prénom</th>
                <th className="px-6 py-4 text-left text-xs font-medium uppercase tracking-wider">Email</th>
                <th className="px-6 py-4 text-left text-xs font-medium uppercase tracking-wider">Téléphone</th>
                <th className="px-6 py-4 text-left text-xs font-medium uppercase tracking-wider">Adresse</th>
                <th className="px-6 py-4 text-center text-xs font-medium uppercase tracking-wider">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200 bg-white">
              {users.map((user, index) => (
                <tr
                  key={user.cin}
                  className={`${index % 2 === 0 ? 'bg-white' : 'bg-gray-50'} hover:bg-gray-100 transition-colors`}
                >
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-800">{formatCin(user.cin)}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{user.identifiant}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-800">{user.nom}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-800">{user.prenom}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{user.email}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{user.telephone}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{user.adresse}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-center">
                    <button
                      onMouseOver={() => handleMouseOver(user.cin)}
                      className="text-indigo-600 hover:text-indigo-900 font-medium mx-1"
                    >
                      Voir
                    </button>
                    <span className="text-gray-300 mx-1">|</span>
                    <button
                      onClick={() => recupereruserdata(user)}
                      className="text-indigo-600 hover:text-indigo-900 font-medium mx-1"
                    >
                      Modifier
                    </button>
                    <span className="text-gray-300 mx-1">|</span>
                    <button
                      onClick={() => recupererCin(user.cin)}
                      className="text-red-600 hover:text-red-900 font-medium mx-1"
                    >
                      Supprimer
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
    
    {/* Formulaire de modification */}
    {isFormOpen && <ModificationForm closeModal={closeForm} data={formData} />}
    </div> );
};

export default AffichageUsers;