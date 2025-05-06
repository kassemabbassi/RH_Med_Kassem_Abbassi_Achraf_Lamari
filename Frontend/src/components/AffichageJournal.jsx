import { useEffect, useState } from "react";
import { useAuth } from "@/context/AuthContext";


export default function AffichageJournal() {
    const { api } = useAuth();
  const [journaux, setJournaux] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isMobileView, setIsMobileView] = useState(false);

  useEffect(() => {
    const checkScreenSize = () => {
      setIsMobileView(window.innerWidth < 1024);
    };

    checkScreenSize();
    window.addEventListener("resize", checkScreenSize);

    return () => window.removeEventListener("resize", checkScreenSize);
  }, []);

  useEffect(() => {
    api
      .get("/journaux")
      .then((response) => {
        setJournaux(response.data);
        setLoading(false);
      })
      .catch((error) => {
        setLoading(false);
      });
  }, []);

  const handleDeleteJournal = (journal) => {
    // Suppression côté client
    setJournaux(journaux.filter((j) => j.id !== journal.id));
    // Suppression côté serveur
    api.delete(`/journaux/${journal.id}`)
      .catch((error) => {});
  };

  return (
    <div className={`
      ${isMobileView 
        ? "w-full bg-white shadow-md rounded-lg" 
        : "w-[30%] bg-white shadow-xl min-h-screen rounded-lg border-l-4 border-[#7091E6]"
      }
    `}>
      {/* En-tête */}
      <div className="sticky top-0 bg-white z-10 border-b-2 border-[#ADBBDA] shadow-sm">
        <div className="flex items-center justify-between p-5">
          <h2 className="text-2xl font-extrabold text-[#3D52A0] flex items-center">
            <svg 
              xmlns="http://www.w3.org/2000/svg" 
              className="h-8 w-8 mr-3 text-[#7091E6]" 
              fill="none" 
              viewBox="0 0 24 24" 
              stroke="currentColor"
            >
              <path 
                strokeLinecap="round" 
                strokeLinejoin="round" 
                strokeWidth={2} 
                d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" 
              />
            </svg>
            Journal Historique
          </h2>
        </div>
      </div>
  
      {/* Contenu */}
      {loading ? (
        <div className="flex justify-center items-center h-32">
          <div className="animate-spin rounded-full h-10 w-10 border-t-2 border-b-2 border-[#7091E6]"></div>
        </div>
      ) : (
        <div className={`
          ${isMobileView 
            ? "overflow-x-auto" 
            : "overflow-auto max-h-[calc(100vh-4rem)]"
          } p-2`}
        >
          {journaux.length > 0 ? (
            <table className="w-full border-collapse">
              <thead className="bg-[#EDE8F5] sticky top-0">
                <tr>
                  {["Titre", "Description", "Date", "Action"].map((header) => (
                    <th 
                      key={header}
                      className="px-5 py-4 text-left text-xs font-semibold text-[#3D52A0] uppercase tracking-wider"
                    >
                      {header}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {journaux.map((journal) => (
                  <tr
                    key={journal.id}
                    className="hover:bg-[#F5F3FB] transition-colors duration-200 border-b border-[#ADBBDA] relative"
                  >
                    <td className="px-5 py-4 whitespace-normal text-sm font-medium text-[#3D52A0]">
                      <div className="font-bold text-[#7091E6]">{journal.titre}</div>
                    </td>
                    <td className="px-5 py-4 text-sm text-[#8697C4] whitespace-normal">
                      {journal.description}
                    </td>
                    <td className="px-5 py-4 whitespace-nowrap text-sm text-[#8697C4]">
                      {journal.date}
                    </td>
                    <td className="px-5 py-4 relative">
                      <button
                        onClick={() => handleDeleteJournal(journal)}
                        className="absolute top-3 -translate-y-1/2 right-40 text-[#8697C4] hover:text-[#3D52A0]"
                      >
                        <span className="text-2xl">×</span> {/* Icône Supprimer */}
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          ) : (
            <div className="flex flex-col items-center justify-center h-64 text-[#8697C4] space-y-3">
              <svg
                className="h-16 w-16 text-[#EDE8F5]"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                />
              </svg>
              <p className="text-lg text-[#8697C4] font-medium">Aucun journal disponible</p>
            </div>
          )}
        </div>
      )}
    </div>
  );
}