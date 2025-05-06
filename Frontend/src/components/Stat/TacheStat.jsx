
import BarChart from '@/components/BarChart';
import axios from 'axios';
import {  Hourglass, User2Icon } from 'lucide-react';
import { useEffect, useState } from 'react';
import { useAuth } from "@/context/AuthContext";

export default function TacheStat({ date }) {
    const { api } = useAuth();
    const [total, setTotal] = useState();
    const [moyentache, setMoyenTache] = useState();

    const [etat, setEtat] = useState();

    const [etatData, setEtatData] = useState();

    const [etatLabel, setEtatLabel] = useState();


    useEffect(() => {
        sendRequest();
    }, [date]);


    const sendRequest = async () => {
        try {
          const response = await api.post("/statistique/tache", date, {
            headers: {
              "Content-Type": "application/json",
            },
          });
      
          if (response.status === 200 && response.data) {
            setEtat(response.data.etats);
            setMoyenTache(response.data.tacheParEns);
            setTotal(response.data.nbTotal);

          } else {
            throw new Error("Réponse invalide du serveur");
          }
        } catch (error) {
          
      
          let errorMessage = "Erreur inconnue";
      
          if (error.response) {
            // Erreur côté serveur avec réponse
            errorMessage = `Erreur ${error.response.status}: ${error.response.data?.message || "Problème côté serveur"}`;
          } else if (error.request) {
            // Erreur côté client (pas de réponse du serveur)
            errorMessage = "Le serveur ne répond pas. Vérifiez votre connexion.";
          } else {
            // Autre erreur
            errorMessage = error.message;
          }
      
          afficherNotification(errorMessage, false);
        }
      };
      
    useEffect(() => {
        sendRequest();
    }, []);

    useEffect(() => {
        var data = [];
        var label = [];
        if (etat) {
            etat.forEach(item => {
                data.push(item.nb);
                label.push(item.etat);
            });
            setEtatData(data);
            setEtatLabel(label)
        }

    }, [etat]);
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

        <div className=" min-w-72 bg-gray-50 p-8 space-y-8 border border-gray-400  md:m-8 lg:m-8 rounded-xl">
            <h3 className='uppercase text-2xl  text-center'>statistiques De taches </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="flex items-center bg-white rounded-xl p-6 shadow-lg transition-all hover:shadow-xl hover:scale-105">
                    <div className="flex items-center gap-4">
                        <div className="bg-blue-100 p-3 rounded-lg">
                            <Hourglass className="w-6 h-6 text-blue-600" />
                        </div>
                        <div>
                            <p className="text-gray-700 text-sm font-medium uppercase">Nombre Des Taches Total</p>
                            <p className="text-2xl font-bold text-gray-900">{total}</p>
                        </div>
                    </div>
                </div>

                <div className="flex items-center bg-white rounded-xl p-6 shadow-lg transition-all hover:shadow-xl hover:scale-105">
                    <div className="flex items-center gap-4">
                        <div className="bg-green-100 p-3 rounded-lg">
                            <User2Icon className="w-6 h-6 text-green-600" />
                        </div>
                        <div>
                            <p className="text-gray-00 text-sm font-medium uppercase">Nombre De tache Moyen Par Enseignant</p>
                            <p className="text-2xl font-bold text-gray-900">{moyentache}</p>
                        </div>
                    </div>
                </div>
            </div>

            <div className="grid grid-cols-1  gap-8">
                {etatData && etatLabel && (
                    <div className="bg-white p-6 rounded-xl shadow-lg transition-all hover:shadow-xl">
                        <h3 className="text-lg font-semibold text-gray-800 mb-4 pb-2 border-b">
                            Tache par Etat
                        </h3>
                        <div className="h-80">
                            <BarChart
                                data={etatData}
                                lab={etatLabel}
                                name="Tache(s)"
                            />
                        </div>
                    </div>
                )}


            </div>
        </div>

    );
}



