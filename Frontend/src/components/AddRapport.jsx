
import React, { useEffect, useState } from 'react'
import { toast, ToastContainer } from 'react-toastify';
import { useAuth } from "@/context/AuthContext";

export default function AddRapport({ handleToggle, date }) {
    const { api } = useAuth();
    let compteur = 1;
    
    const [filemane, setFilename] = useState();
    const [res, setResponse] = useState();
    const SendReq = async () => {
        try {
            const response = await api.get("/pdf", {
                headers: {
                    "Content-Type": "application/json",
                },
            });
            setResponse(response.data);
        } catch (error) {
        }
    }

    let params = {
        date: date,
        filename: filemane
    }
    const SaveFile = async () => {
        try {
          const response = await api.post("/statistique", params, {
            headers: {
              "Content-Type": "application/json",
            },
          });
      
          if (response.status === 200 || response.status === 201) {
            afficherNotification("Fichier enregistré avec succès !", true);
            SendReq();
          } else {
            throw new Error("Réponse invalide du serveur");
          }
        } catch (error) {
          let errorMessage = "Échec de l'opération !";
          if (error.response) {
            // Erreur côté serveur avec une réponse HTTP
            if (error.response.status === 403) {
              errorMessage = error.response.data || "Accès interdit.";
            } else {
              errorMessage = `Erreur ${error.response.status}: ${error.response.data?.message || "Problème côté serveur"}`;
            }
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
        SendReq();
    }, []);

    const base64ToBlob = (base64, mimeType = "application/octet-stream") => {
        // Decode Base64 to binary
        const byteCharacters = atob(base64);
        const byteNumbers = new Array(byteCharacters.length);

        for (let i = 0; i < byteCharacters.length; i++) {
            byteNumbers[i] = byteCharacters.charCodeAt(i);
        }

        // Convert to Uint8Array
        const byteArray = new Uint8Array(byteNumbers);

        // Create and return Blob
        return new Blob([byteArray], { type: mimeType });
    }



    const downloadPdf = async (bb) => {
        const blob = base64ToBlob(bb, "application/pdf");
        const url = URL.createObjectURL(blob);
        const printWindow = window.open(url);
        if (printWindow) {
            printWindow.focus();

        }
    }
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
        <div className=" fixed top-0 z-50 bg-black/50 flex justify-center items-center h-screen w-full max-w-full max-h-full">

            <ToastContainer limit={2} />
            <div className="relative bg-white rounded-lg shadow-sm dark:bg-gray-700">

                <div className="flex items-center justify-between p-4 md:p-5 border-b rounded-t dark:border-gray-600 border-gray-200">
                    <h3 className="text-xl font-medium text-gray-900 dark:text-white">
                        Ajouter Un Rapport
                    </h3>
                    <button onClick={() => { handleToggle(false) }}
                        type="button" className="text-gray-400 bg-transparent hover:bg-gray-200 hover:text-gray-900 rounded-lg text-sm w-8 h-8 ms-auto inline-flex justify-center items-center dark:hover:bg-gray-600 dark:hover:text-white" data-modal-hide="small-modal">
                        <svg className="w-3 h-3" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 14 14">
                            <path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="m1 1 6 6m0 0 6 6M7 7l6-6M7 7l-6 6" />
                        </svg>
                        <span className="sr-only">Close modal</span>
                    </button>
                </div>
                {/* Modal body */}
                <div className="flex flex-col gap-5 p-5 max-h-96 ">

                    <div className="relative">
                        <input value={filemane}
                            onChange={(e) => setFilename(e.target.value)} type="text" id="floating_filled" className="block rounded-lg px-2.5 pb-1 pt-5 w-full text-sm text-gray-900 bg-gray-50 dark:bg-gray-700  border-2 border-gray-300 appearance-none dark:text-white dark:border-gray-600 dark:focus:border-blue-500 focus:outline-none focus:ring-0 focus:border-blue-600 peer" placeholder=" " />
                        <label htmlFor="floating_filled" className="absolute text-sm text-gray-500 dark:text-gray-400 duration-300 transform -translate-y-4 scale-75 top-3.5 z-10 origin-[0] start-2.5 peer-focus:text-blue-600 peer-focus:dark:text-blue-500 peer-placeholder-shown:scale-100 peer-placeholder-shown:translate-y-0 peer-focus:scale-75 peer-focus:-translate-y-3.5 rtl:peer-focus:translate-x-1/4 rtl:peer-focus:left-auto">Nom Document</label>
                    </div>
                    <div className="relative overflow-x-auto shadow-md sm:rounded-lg  ">
                        <table className="w-full  text-sm text-left rtl:text-right text-gray-500 dark:text-gray-400">
                            <thead className=" sticky top-0  text-xs text-gray-700 uppercase bg-gray-50 dark:bg-gray-700 dark:text-gray-400">
                                <tr >
                                    <th scope="col" className="px-6 py-3">
                                        Nom de Document
                                    </th>
                                    <th scope="col" className="px-6 py-3">
                                        Debut periode
                                    </th>
                                    <th scope="col" className="px-6 py-3">
                                        fin periode
                                    </th>
                                    <th scope="col" className="px-6 py-3">

                                    </th>
                                </tr>
                            </thead>
                            {res &&
                                <tbody>
                                    {res.map((item, key) => (
                                        <tr className="bg-white border-b dark:bg-gray-800 dark:border-gray-700 border-gray-200">
                                            <th scope="row" className="px-6 py-4 font-medium text-gray-900 whitespace-nowrap dark:text-white">
                                                {item.fileName}
                                            </th>
                                            <td className="px-6 py-4">
                                                {item.period}
                                            </td>
                                            <td className="flex     justify-end items-center px-6 py-4">
                                                <button onClick={() => { downloadPdf(item.contenuBytes); }}
                                                    className="flex items-center justify-center px-4 py-2 bg-green-600 text-white rounded-2xl hover:bg-green-700 focus:outline-none">
                                                    <svg
                                                        className="fill-current w-4 h-4 mr-2"
                                                        xmlns="http://www.w3.org/2000/svg"
                                                        viewBox="0 0 20 20"
                                                    >
                                                        <path d="M13 8V2H7v6H2l8 8 8-8h-5zM0 18h20v2H0v-2z" />
                                                    </svg>
                                                    Telecharger
                                                </button>
                                            </td>
                                        </tr>
                                    ))}


                                </tbody>}
                        </table>
                    </div>


                </div>
                {/* Modal footer */}
                <div className="flex items-center justify-end p-4 md:p-5 border-t gap-2 border-gray-200 rounded-b dark:border-gray-600">
                    <button onClick={() => { handleToggle(false) }} type="button" className="py-2.5 px-5 text-sm font-medium text-gray-900 focus:outline-none bg-white rounded-lg border border-gray-200 hover:bg-gray-100 hover:text-blue-700 focus:z-10 focus:ring-4 focus:ring-gray-100 dark:focus:ring-gray-700 dark:bg-gray-800 dark:text-gray-400 dark:border-gray-600 dark:hover:text-white dark:hover:bg-gray-700">Annuler</button>

                    <button type="button" onClick={SaveFile} className="text-white  bg-blue-500 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center"> Ajouter</button>
                </div>
            </div>
        </div>
    )
}
