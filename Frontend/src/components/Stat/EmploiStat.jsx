
import BarChart from '@/components/BarChart';
import { CalendarDays, Hourglass ,User2Icon} from 'lucide-react';
import { useEffect, useState } from 'react';
import { useAuth } from "@/context/AuthContext";

export default function EmploiStat() {
    const { api } = useAuth();
    const [total, setTotal] = useState();
    const [heuresupp, setHeureSupp] = useState();
    const [conge, setconge] = useState();

    const [grades, setGrades] = useState();
    const [departements, setDepartements] = useState();
    const [postes, setPostes] = useState();
    const [anciennete, setAnciennete] = useState();

    const [gradesData, setGradesData] = useState();
    const [departementsData, setDepartementsData] = useState();
    const [postesData, setPostesData] = useState();
    const [ancienneteData, setAncienneteData] = useState();

    const [gradesLabel, setGradesLabel] = useState();
    const [departementsLabel, setDepartementsLabel] = useState();
    const [postesLabel, setPostesLabel] = useState();
    const [ancienneteLabel, setAncienneteLabel] = useState();

    const sendRequest = async () => {
        try {
          const response = await api.get("/statistique/emploi", {
            headers: {
              "Content-Type": "application/json",
            },
          });
      
          if (response.status === 200 && response.data) {
            setGrades(response.data.grades || []);
            setDepartements(response.data.departements || []);
            setPostes(response.data.postes || []);
            setAnciennete(response.data.anciennetes || []);
            setTotal(response.data.nbTotal || 0);
            setconge(response.data.congeMoyen || 0);
            setHeureSupp(response.data.sommeHeureSupp || 0);

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
        if (grades) {
            grades.forEach(item => {
                data.push(item.nb);
                label.push(item.grade);
            });
            setGradesData(data);
            setGradesLabel(label);
        }

    }, [grades]);
    useEffect(() => {
        var data = [];
        var label = [];
        if (grades) {
            grades.forEach(item => {
                data.push(item.nb);
                label.push(item.grade);
            });
            setGradesData(data);
            setGradesLabel(label)
        }

    }, [grades]);
    useEffect(() => {
        var data = [];
        var label = [];
        if (postes) {
            postes.forEach(item => {
                data.push(item.nb);
                label.push(item.poste);
            });
            setPostesData(data);
            setPostesLabel(label)
        }

    }, [postes]);
    useEffect(() => {
        var data = [];
        var label = [];
        if (departements) {
            departements.forEach(item => {
                data.push(item.nb);
                label.push(item.departement);
            });
            setDepartementsData(data);
            setDepartementsLabel(label)
        }

    }, [departements]);
    useEffect(() => {
        var data = [];
        var label = [];
        if (anciennete) {
            anciennete.forEach(item => {
                data.push(item.nb);
                label.push(item.anciennete);
            });
            setAncienneteData(data);
            setAncienneteLabel(label)
        }

    }, [anciennete]);
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
        <h3 className='uppercase text-2xl  text-center'>statistiques professionnelles </h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="flex items-center bg-white rounded-xl p-6 shadow-lg transition-all hover:shadow-xl hover:scale-105">
                <div className="flex items-center gap-4">
                    <div className="bg-blue-100 p-3 rounded-lg">
                        <User2Icon className="w-6 h-6 text-blue-600" />
                    </div>
                    <div>
                        <p className="text-gray-700 text-sm font-medium uppercase">Nombre Des Utilisateurs Total</p>
                        <p className="text-2xl font-bold text-gray-900">{total}</p>
                    </div>
                </div>
            </div>

            <div className="flex items-center bg-white rounded-xl p-6 shadow-lg transition-all hover:shadow-xl hover:scale-105">
                <div className="flex items-center gap-4">
                    <div className="bg-green-100 p-3 rounded-lg">
                        <Hourglass className="w-6 h-6 text-green-600" />
                    </div>
                    <div>
                        <p className="text-gray-00 text-sm font-medium uppercase">Somme Des Heures Supplementaires</p>
                        <p className="text-2xl font-bold text-gray-900">{heuresupp}</p>
                    </div>
                </div>
            </div>

            <div className="flex items-center bg-white rounded-xl p-6 shadow-lg transition-all hover:shadow-xl hover:scale-105">
                <div className="flex items-center gap-4">
                    <div className="bg-purple-100 p-3 rounded-lg">
                        <CalendarDays className="w-6 h-6 text-purple-600" />
                    </div>
                    <div>
                        <p className="text-gray-700 text-sm font-medium uppercase">Nombre Moyen De Jours De Congé Demandé </p>
                        <p className="text-2xl font-bold text-gray-900">{conge}</p>
                    </div>
                </div>
            </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {gradesData && gradesLabel && (
                <div className="bg-white p-6 rounded-xl shadow-lg transition-all hover:shadow-xl">
                    <h3 className="text-lg font-semibold text-gray-800 mb-4 pb-2 border-b">
                        Enseignants par Grade
                    </h3>
                    <div className="h-80">
                        <BarChart 
                            data={gradesData} 
                            lab={gradesLabel} 
                            name="Enseignant(s)"
                        />
                    </div>
                </div>
            )}

            {departementsData && departementsLabel && (
                <div className="bg-white p-6 rounded-xl shadow-lg transition-all hover:shadow-xl">
                    <h3 className="text-lg font-semibold text-gray-800 mb-4 pb-2 border-b">
                        Enseignants par Département
                    </h3>
                    <div className="h-80">
                        <BarChart 
                            data={departementsData} 
                            lab={departementsLabel} 
                            name="Enseignant(s)"
                        />
                    </div>
                </div>
            )}

            {postesData && postesLabel && (
                <div className="bg-white p-6 rounded-xl shadow-lg transition-all hover:shadow-xl">
                    <h3 className="text-lg font-semibold text-gray-800 mb-4 pb-2 border-b">
                        Enseignants par Poste
                    </h3>
                    <div className="h-80">
                        <BarChart 
                            data={postesData} 
                            lab={postesLabel} 
                            name="Enseignant(s)"
                        />
                    </div>
                </div>
            )}

            {ancienneteData && ancienneteLabel && (
                <div className="bg-white p-6 rounded-xl shadow-lg transition-all hover:shadow-xl">
                    <h3 className="text-lg font-semibold text-gray-800 mb-4 pb-2 border-b">
                        Enseignants par Ancienneté
                    </h3>
                    <div className="h-80">
                        <BarChart 
                            data={ancienneteData} 
                            lab={ancienneteLabel} 
                            name="Enseignant(s)"
                        />
                    </div>
                </div>
            )}
        </div>
    </div>

    );
}


    
