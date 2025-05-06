



import { useState } from "react";
import CreationForm from "../components/creationform";
import AffichageUsers from "../components/AffichageUsers";

export default function GestionUtilisateurs() {
  const [isFormOpen, setIsFormOpen] = useState(false);

  const openForm = () => setIsFormOpen(true); // Ouvre le formulaire
  const closeForm = () => setIsFormOpen(false); // Ferme le formulaire

  return (

    <div className="min-h-screen bg-gray-50"> <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8"> {/* Header section with title and action button */} <div className="mb-8"> <div className="flex flex-col md:flex-row md:items-center md:justify-between"> <div className="flex-1"> <h1 className="text-2xl sm:text-3xl font-bold text-gray-900"> Gestion des Utilisateurs </h1> <p className="mt-2 text-sm text-gray-500"> Gérez les informations du personnel et leurs rôles au sein de l'organisation. </p> </div> <div className="mt-4 md:mt-0"> <button onClick={openForm} className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500" > <svg className="mr-2 -ml-1 h-5 w-5" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor"> <path fillRule="evenodd" d="M10 5a1 1 0 011 1v3h3a1 1 0 110 2h-3v3a1 1 0 11-2 0v-3H6a1 1 0 110-2h3V6a1 1 0 011-1z" clipRule="evenodd" /> </svg> Ajouter un utilisateur </button> </div> </div> </div>
      {/* Stats cards */}
      <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4 mb-8">
        {[
          { title: "Total utilisateurs", value: "254", color: "bg-blue-500" },
          { title: "Départements", value: "4", color: "bg-purple-500" },
          { title: "Postes vacants", value: "3", color: "bg-yellow-500" },
        ].map((stat, index) => (
          <div key={index} className="bg-white overflow-hidden shadow rounded-lg">
            <div className="p-5">
              <div className="flex items-center">
                <div className={`flex-shrink-0 rounded-md p-3 ${stat.color}`}>
                  <svg className="h-6 w-6 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                  </svg>
                </div>
                <div className="ml-5 w-0 flex-1">
                  <dt className="text-sm font-medium text-gray-500 truncate">
                    {stat.title}
                  </dt>
                  <dd className="flex items-baseline">
                    <div className="text-2xl font-semibold text-gray-900">
                      {stat.value}
                    </div>
                  </dd>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    
      {/* Main content container */}
      <div className="bg-white shadow rounded-lg overflow-hidden">
        {/* Search and filters section */}
        <div className="border-b border-gray-200 p-5">
                  </div>
    
        {/* User table */}
        <AffichageUsers />
      </div>
    </div>
    
    {/* Formulaire de création (modal) */}
    {isFormOpen && <CreationForm closeModal={closeForm} />}
    </div> );
}
