import { useState, useEffect } from "react";
import axios from "axios";
import { useRouter } from "next/router"; // Importez useRouter
import { Download } from 'lucide-react';
import {  RefreshCw } from 'lucide-react';
import FileRequestForm from "@/components/FileRequestForm";
import CongeForm from "@/components/CongeForm";
import { useAuth } from "@/context/AuthContext";


const UserPdfList = () => {
   const { api } = useAuth();
  const router = useRouter();
  const { cin } = router.query; // Récupérez le paramètre `cin` depuis l'URL
  const [pdfFiles, setPdfFiles] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [isCongeFormOpen, setIsCongeFormOpen] = useState(false);

  const openForm = () => setIsFormOpen(true); 
    const closeForm = () => setIsFormOpen(false); 
    const openCongeForm = () => setIsCongeFormOpen(true); 
    const closeCongeForm = () => setIsCongeFormOpen(false); 

  // Fonction pour récupérer les fichiers PDF de l'utilisateur
  const fetchPdfFiles = async () => {
    setLoading(true);
    setError(null);

    try {
      const response = await api.post(`/user/files`, { cin }); // Utilisez `cin` récupéré depuis l'URL
      setPdfFiles(response.data);
    } catch (err) {
      setError("Erreur lors de la récupération des fichiers PDF.");
      //console.error(err);
    } finally {
      setLoading(false);
    }
  };

  // Appel de la fonction au montage du composant ou lorsque `cin` change
  useEffect(() => {
    if (cin) {
      fetchPdfFiles();
    }
  }, [cin]); // Déclenchez la requête lorsque `cin` change

  // Fonction pour télécharger un fichier PDF
  const downloadPdf = async (fileName, fileId) => {
    try {
      const response = await api.get(`/user/download-files/${fileId}`, {
        responseType: "blob", // Important pour télécharger des fichiers binaires
      });

      // Créer un lien pour télécharger le fichier
      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement("a");
      link.href = url;
      link.setAttribute("download", fileName);
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    } catch (err) {
      console.error("Erreur lors du téléchargement du fichier :", err);
    }
  };

  return (
    <div className="min-h-screen flex flex-col items-center px-4 bg-[#EDE8F5]">
      {/* En-tête */}
      <div className="w-full py-6 text-center">
        <h1 className="text-3xl sm:text-4xl font-bold text-[#3D52A0]">
          Fichiers PDF de l'utilisateur
        </h1>
      </div>
      <div className="flex justify-end mb-6">
          <button 
            className="inline-flex items-center px-4 py-2 text-white rounded-md transition hover:bg-[#3D52A0] bg-[#7091E6] gap-2"
            onClick={openForm}
          >
            <RefreshCw className="w-4 h-4" />
            <span>Gnérer un PDF</span>
          </button>
          <button 
            className="inline-flex items-center px-4 ml-56 py-2 text-white rounded-md transition hover:bg-[#3D52A0] bg-[#7091E6] gap-2"
            onClick={openCongeForm}
          >
            <RefreshCw className="w-4 h-4" />
            <span>Demander un congé</span>
          </button>
        </div>
        {isFormOpen && <FileRequestForm closeModal={closeForm} />}
        {isCongeFormOpen && <CongeForm closeModal={closeCongeForm} />}
      {/* Contenu */}
      <div className="max-w-7xl w-full px-4 sm:px-6 lg:px-8">
        {loading && <p className="text-center text-[#3D52A0]">Chargement en cours...</p>}
        {error && <p className="text-center text-red-500">{error}</p>}
        

        {/* Tableau des fichiers PDF */}
        <div className="rounded-lg shadow-lg overflow-hidden w-full bg-white border border-[#ADBBDA]">
          <div className="overflow-x-auto">
            <table className="w-full border-collapse">
              <thead className="bg-[#ADBBDA]">
                <tr className="text-[#3D52A0]">
                  <th className="px-4 py-3 text-left text-sm font-medium">Nom du fichier</th>
                  <th className="px-4 py-3 text-left text-sm font-medium">Taille</th>
                  <th className="px-4 py-3 text-left text-sm font-medium">Type</th>
                  <th className="px-4 py-3 text-left text-sm font-medium">Catégorie</th>
                  <th className="px-4 py-3 text-left text-sm font-medium">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#ADBBDA]">
                {pdfFiles.map((file) => (
                  <tr key={file.id} className="hover:bg-[#F5F3FB] transition">
                    <td className="px-4 py-3 text-sm text-[#3D52A0] font-medium">{file.fileName}</td>
                    <td className="px-4 py-3 text-sm text-[#8697C4]">{(file.fileSize / 1024).toFixed(2)} KB</td>
                    <td className="px-4 py-3 text-sm text-[#3D52A0]">{file.fileType}</td>
                    <td className="px-4 py-3 text-sm text-[#8697C4]">{file.type}</td>
                    <td className="px-4 py-3">
                      <button
                        onClick={() => downloadPdf(file.fileName, file.id)}
                        className="inline-flex items-center px-3 py-1.5 text-sm rounded-md bg-[#7091E6] text-white hover:bg-[#3D52A0] transition gap-2"
                      >
                        <Download className="w-4 h-4" />
                        Télécharger
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

export default UserPdfList;