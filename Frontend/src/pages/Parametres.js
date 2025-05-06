
import { useState, useEffect } from "react";
import { Plus, Minus, RefreshCw } from 'lucide-react';
import QuotasForm from "../components/QuotasForm";
import { useAuth } from "@/context/AuthContext";

const Parametres = () => {
  const [users, setUsers] = useState([]);
  const [isFormOpen, setIsFormOpen] = useState(false);
  
    const openForm = () => setIsFormOpen(true); 
    const closeForm = () => setIsFormOpen(false); 
      const { api } = useAuth();



  
  
  useEffect(() => {
    api.get("/user/all")
      .then(response => {
        setUsers(response.data);
      })
      .catch(error => {
        console.error("Erreur lors de la récupération des utilisateurs :", error);
      });
  }, []);


 
    
    // Fonction pour envoyer la requête de suppression avec Axios
    const incrementHeuresSupp = (cin,heures) => {
      const user = users.find(u => u.cin === cin);
      const newHeures = user.heuresSupp + 1;
      api.post("/user/incrementerheuressupp", { cin,heures })
        .then(response => {
          setUsers(users.map(user => 
            user.cin === cin 
              ? { ...user, heuresSupp: newHeures }
              : user
          ));
          afficherNotification('✔️ Heures Supplémentaires mis a jour avec succés', true);
        })
        .catch(error => {

          afficherNotification('❌ Erreur lors de mise a jour de heures supplémentaires', false);
          
        });
    };
    const convertirheuresenconges = (cin, heures) => {
     
      
  
      
      if (heures < 12) {
          afficherNotification('❌ Minimum 12 heures requises pour la conversion', false);
          return;
      }
     
      api.post('/user/updateconge', {
          cin: cin,
          heuresSupp: heures  
      }, {
          
          headers: {
              'Content-Type': 'application/json'
          },
         
          timeout: 5000
      })
      .then(response => {
         
          
          if (response.data && response.data.heuresSuppl !== undefined) {
              setUsers(users.map(u => 
                  u.cin === cin 
                      ? { ...u, heuresSupp: response.data.heuresSuppl }
                      : u
              ));
              afficherNotification('✔️ Congé mises à jour avec succès', true);
          } else {
              
              afficherNotification('⚠️ Mise à jour effectuée mais données incomplètes', true);
          }
      })
      .catch(error => {
          
          
          let errorMessage = 'Erreur lors de la mise à jour de Congé';
          
          if (error.response) {
             
              
              errorMessage = error.response.data?.error || errorMessage;
          } else if (error.request) {
              // La requête a été faite mais pas de réponse reçue
              console.error("Pas de réponse du serveur - Requête:", error.request);
              errorMessage = "Le serveur ne répond pas. Vérifiez que le serveur est en cours d'exécution.";
          } else {
              // Une erreur s'est produite lors de la configuration de la requête
              console.error("Erreur de configuration:", error.message);
              errorMessage = error.message;
          }
          
          afficherNotification(`❌ ${errorMessage}`, false);
      });
  };


    const decrementHeuresSupp = (cin) => {
      
      const requestData = {
          cin: cin,
          heures: -1  
      };
      
      api.post('/user/decrementerheuressupp', requestData)
          .then(response => {
              if (response.data && response.data.heuresSuppl !== undefined) {
                  setUsers(users.map(u => 
                      u.cin === cin 
                          ? { ...u, heuresSupp: response.data.heuresSuppl }
                          : u
                  ));
                  afficherNotification('✔️ Heures supplémentaires mises à jour avec succès', true);
              } else {
                  // Si la réponse n'a pas le format attendu
                  console.warn("Réponse inattendue du serveur:", response.data);
                  afficherNotification('⚠️ Mise à jour effectuée mais données incomplètes', true);
              }
          })
          .catch(error => {
              let errorMessage = 'Erreur lors de la mise à jour des heures supplémentaires';
              
              
              if (error.response) {
                 
                  errorMessage = error.response.data?.error || errorMessage;
                  console.error("Erreur du serveur:", error.response.data);
              } else if (error.request) {
                  
                  errorMessage = "Pas de réponse du serveur";
                  console.error("Pas de réponse:", error.request);
              } else {
                  
                  errorMessage = error.message;
                  console.error("Erreur de configuration:", error.message);
              }
              
              afficherNotification(`❌ ${errorMessage}`, false);
          });
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
    <div className="min-h-screen flex flex-col items-center px-4 bg-[#EDE8F5]">
      {/* En-tête */}
      <div className="w-full py-6 text-center">
        <h1 className="text-3xl sm:text-4xl font-bold text-[#3D52A0]">
          Gestion des Congés
        </h1>
      </div>
  
      <div className="max-w-7xl w-full px-4 sm:px-6 lg:px-8">
        {/* Bouton de réinitialisation */}
        <div className="flex justify-end mb-6">
          <button 
            className="inline-flex items-center px-4 py-2 text-white rounded-md transition hover:bg-[#3D52A0] bg-[#7091E6] gap-2"
            onClick={openForm}
          >
            <RefreshCw className="w-4 h-4" />
            <span>Réinitialiser les soldes</span>
          </button>
        </div>
        {isFormOpen && <QuotasForm closeModal={closeForm} />}
  
        {/* Table responsive */}
        <div className="rounded-lg shadow-lg overflow-hidden w-full bg-white border border-[#ADBBDA]">
          <div className="overflow-x-auto">
            <table className="w-full border-collapse">
              <thead className="bg-[#ADBBDA]">
                <tr className="text-[#3D52A0]">
                  <th className="px-4 py-3 text-left text-sm font-medium">CIN</th>
                  <th className="px-4 py-3 text-left text-sm font-medium">Identifiant</th>
                  <th className="px-4 py-3 text-left text-sm font-medium">Nom & Prénom</th>
                  <th className="px-4 py-3 text-left text-sm font-medium">Heures Supp.</th>
                  <th className="px-4 py-3 text-left text-sm font-medium">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#ADBBDA]">
                {users.map((user) => (
                  <tr key={user.cin} className="hover:bg-[#F5F3FB] transition">
                    <td className="px-4 py-3 text-sm text-[#3D52A0] font-medium">{formatCin(user.cin)}</td>
                    <td className="px-4 py-3 text-sm text-[#8697C4]">{user.identifiant}</td>
                    <td className="px-4 py-3 text-[#3D52A0] font-semibold">{user.nom} <span className="text-[#8697C4]">{user.prenom}</span></td>
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-2">
                        <input
                          type="number"
                          value={user.heuresSupp}
                          className="w-16 sm:w-20 px-2 py-1 text-center rounded-md border border-[#ADBBDA] text-[#3D52A0] bg-[#EDE8F5] focus:ring-2 focus:ring-[#3D52A0]"
                          readOnly
                        />
                        <div className="flex gap-1">
                          <button
                            onClick={() => incrementHeuresSupp(user.cin, user.heuresSupp)}
                            className="p-1.5 rounded-md bg-[#EDE8F5] text-[#3D52A0] hover:bg-[#D8D3EB] transition"
                          >
                            <Plus className="w-4 h-4" />
                          </button>
                          <button
                            onClick={() => decrementHeuresSupp(user.cin)}
                            className="p-1.5 rounded-md bg-[#EDE8F5] text-[#3D52A0] hover:bg-[#D8D3EB] transition"
                          >
                            <Minus className="w-4 h-4" />
                          </button>
                        </div>
                      </div>
                    </td>
                    <td className="px-4 py-3">
                      <button
                        onClick={() => convertirheuresenconges(user.cin, user.heuresSupp)}
                        className="w-full sm:w-auto px-3 py-1.5 text-sm rounded-md bg-[#7091E6] text-white hover:bg-[#3D52A0] transition"
                      >
                        Convertir
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
  
};

export default Parametres;