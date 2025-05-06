
import LineChart from '@/components/LineChart';

import {  User2Icon } from 'lucide-react';
import { useEffect, useState } from 'react';
import { useAuth } from "@/context/AuthContext";

export default function AbsenceStat({date}) {
    const { api } = useAuth();
    const [total, setTotal] = useState();
    const [cin, setCin] = useState();
    const [dates, setDates] = useState();

    const [datesData, setDatesData] = useState();

    const [datesLabel, setDatesLabel] = useState();

    
    useEffect(() => {
        sendRequest();
    }, [date ]);

    const sendRequest = async () => {
        try {
          const response = await api.post("/statistique/absence", date, {
            headers: {
              "Content-Type": "application/json",
            },
          });
      
          if (response.status === 200 && response.data) {
            setTotal(response.data.nbTotal || 0);
            setDates(response.data.AbsenceByDate || []);
            setCin(response.data.AbsenceByCin || []);
      
          } else {
            throw new Error("Réponse invalide du serveur");
          }
        } catch (error) {
         
      
          let errorMessage = "Une erreur inconnue s'est produite.";
      
          if (error.response) {
            // Erreur côté serveur avec une réponse HTTP
            errorMessage = `Erreur ${error.response.status}: ${error.response.data?.message || "Problème côté serveur"}`;
          } else if (error.request) {
            // Erreur côté client (aucune réponse reçue du serveur)
            errorMessage = "Impossible de contacter le serveur. Vérifiez votre connexion Internet.";
          } else {
            // Erreur imprévue
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
        if (dates) {
            dates.forEach(item => {
                data.push(item.nb);
                label.push(item.date);
            });
            setDatesData(data);
            setDatesLabel(label);
        }else{
            setDatesData();
            setDatesLabel();
        }

    }, [dates]);
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

        <div className=" min-w-72 bg-gray-50 p-8 space-y-8 border border-gray-500  md:m-8 lg:m-8 rounded-xl">
            <h3 className='uppercase text-2xl  text-center'>statistiques Absence </h3>

            <div className='grid gap-8 p-2'>
                <div className="grid grid-cols-1  gap-6 ">
                    <div className="flex items-center border-2 bg-white rounded-xl p-6 shadow-lg transition-all hover:shadow-xl hover:scale-105">
                        <div className="flex items-center gap-4">
                            <div className="bg-blue-100 p-3 rounded-lg">
                                <User2Icon className="w-6 h-6 text-blue-600" />
                            </div>
                            <div>
                                <p className="text-gray-700 text-sm font-medium uppercase">Nombre Des Absences Total</p>
                                <p className="text-2xl font-bold text-gray-900">{total}</p>
                            </div>
                        </div>
                    </div>

                    <div className="bg-white px-6 border-2 rounded-xl shadow-lg transition-all hover:shadow-xl relative overflow-x-auto max-h-96 sm:rounded-lg ">
                        <table className="w-full mt-6  text-sm text-left rtl:text-right text-gray-500 dark:text-gray-400">
                            <thead className="sticky  top-0 text-xs text-gray-700 uppercase bg-gray-50 dark:bg-gray-700 dark:text-gray-400">
                                <tr>
                                    <th scope="col" className="px-3 py-3">
                                        Numero De Carte D'identité
                                    </th>

                                    <th scope="col" className="px-3 py-3">
                                        Nombre De Absences
                                    </th>
                                </tr>
                            </thead>
                            {cin && cin.length > 0 && (
                                <tbody >
                                    {cin.map((item, index) => (

                                        <tr className="bg-white border-b dark:bg-gray-800 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-600">

                                            <th scope="row" className="px-6 py-4 font-medium text-gray-900 whitespace-nowrap text-wrap dark:text-white">
                                                {item.cin}
                                            </th>
                                            <td className="px-3 py-3 text-wrap">
                                                {item.nb}
                                            </td>
                                        </tr>

                                    ))}

                                </tbody>
                            )}
                        </table>
                    </div>
                </div>
                <div className="grid z-30 grid-cols-1 ">
                    {datesData && datesLabel && (
                        <div className="bg-white p-6 border-2 rounded-xl shadow-lg transition-all hover:shadow-xl">
                            <h3 className="text-lg font-semibold text-gray-800 mb-4 pb-2 border-b">
                                Repartition Des Dates Des Absences
                            </h3>
                            <div >
                                <LineChart
                                    data={datesData}
                                    label={datesLabel}
                                    name="Enseignant(s)"
                                />
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </div>

    );
}



