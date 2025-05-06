
import { useRouter } from 'next/router';
export default function Menu({activeTab}) {
    
  const router =useRouter()
    const handleNavigation = (button) => {
        if (button.route) {
          router.push(button.route);
        } else {
          setActiveTab(button.id);
        }
      };
  
  
  const navButtons = [
    { id: "utilisateurs", label: "Gestion des utilisateurs", route: "/GestionUtilisateurs" },
    { id: "taches", label: "Taches", route: "/GestionTaches" },
    { id: "recherche", label: "Recherche", route: "/recherche" },
    { id: "stats", label: "Statistiques", route: "/statistique" },
    { id: "params", label: "Paramétres", route: "/Parametres" },
  ];
  return (
    
    <nav className="bg-white/50 backdrop-blur-md shadow-md">
      <div className="max-w-7xl mx-auto px-4">
        <div className="flex justify-between h-16">
          <div className="flex space-x-4">
            {navButtons.map((button) => (
              <button
                key={button.id}
                onClick={() => handleNavigation(button)}
                className={`inline-flex items-center px-4 py-2 border-b-2 font-medium text-sm focus:outline-none transition-colors duration-200 ease-in-out ${
                  activeTab === button.id
                    ? "border-teal-500 text-teal-600"
                    : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
                }`}
              >
                {button.label}
              </button>
            ))}
          </div>
        </div>
      </div>
    </nav>
  );
}
