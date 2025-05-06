
import React, { useState, useEffect } from 'react';
import { useAuth } from "@/context/AuthContext";

const QuotasForm = ({ closeModal }) => {
    const { api } = useAuth();
  const [quotas, setQuotas] = useState({
    enseignant: 0,
    employee: 0
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);


 

  useEffect(() => {
    fetchQuotas();
  }, []);

  const fetchQuotas = async () => {
    try {
      const { data } = await api.get('/quota');
      const quotasMap = {
        enseignant: 0,
        employee: 0
      };
      
      
      data.forEach(quota => {
        if (quota.typeEmploye.toLowerCase() === 'enseignant') {
          quotasMap.enseignant = quota.quota;
        } else if (quota.typeEmploye.toLowerCase() === 'employee') {
          quotasMap.employee = quota.quota;
        }
      });
  
      setQuotas(quotasMap);
      setLoading(false);
    } catch (err) {
      setError("Erreur lors du chargement des quotas");
      setLoading(false);
      console.error("Erreur de chargement:", err);
    }
  };
  const handleSubmit = async (e) => {
    e.preventDefault();
    
    const quotasToUpdate = [
      { typeEmploye: "enseignant", quota: quotas.enseignant },
      { typeEmploye: "employee", quota: quotas.employee }
    ];
  
    try {
      await api.put('/quota/update', quotasToUpdate);
      closeModal();
      afficherNotification('✔️ Quotas modifiées avec succès ', true);
    } catch (err) {
        afficherNotification('❌ Erreue lors de modification de Quotas ', false);
      console.error("Erreur de mise à jour:", err.response || err);
    }
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

 

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setQuotas(prev => ({
      ...prev,
      [name]: parseInt(value) || 0
    }));
  };

  if (loading) {
    return (
      <div className="fixed inset-0 flex items-center justify-center bg-black/60 backdrop-blur-sm z-50">
        <div className="bg-white p-8 rounded-2xl shadow-2xl text-[#3D52A0]">
          <div className="text-center text-lg font-semibold">Chargement...</div>
        </div>
      </div>
    );
  }
  
  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black/60 backdrop-blur-sm z-50 p-4">
      <div 
        className="bg-white w-full max-w-md rounded-2xl shadow-2xl transform transition-all text-[#3D52A0]"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="relative p-6 border-b border-[#ADBBDA]">
          <button
            onClick={closeModal}
            className="absolute right-4 top-4 w-8 h-8 flex items-center justify-center rounded-full text-[#8697C4] hover:text-[#3D52A0] hover:bg-[#EDE8F5] transition-colors"
          >
            ✕
          </button>
          <h2 className="text-2xl font-bold bg-gradient-to-r from-[#3D52A0] to-[#7091E6] bg-clip-text text-transparent">
            Mise à jour des quotas
          </h2>
        </div>
  
        {/* Form */}
        <form className="p-6 space-y-6" onSubmit={handleSubmit}>
          {error && (
            <div className="p-4 text-[#D32F2F] bg-[#FFEBEE] border border-[#FFCDD2] rounded-lg">
              {error}
            </div>
          )}
  
          {/* Quota Enseignant */}
          <div className="space-y-2">
            <label className="block text-sm font-medium text-[#3D52A0]">
              Quota Enseignant
            </label>
            <div className="flex items-center bg-[#EDE8F5] rounded-xl overflow-hidden border border-[#ADBBDA] hover:border-[#3D52A0] transition-colors group">
              <span className="px-4 py-3 bg-[#ADBBDA] text-[#3D52A0] font-medium border-r border-[#ADBBDA] group-hover:bg-[#7091E6] group-hover:text-white transition-colors">
                Enseignant
              </span>
              <input
                type="number"
                name="enseignant"
                value={quotas.enseignant}
                onChange={handleInputChange}
                className="flex-1 px-4 py-3 bg-white focus:outline-none text-[#3D52A0] placeholder-[#8697C4]"
                placeholder="Entrez le quota"
              />
            </div>
          </div>
  
          {/* Quota Employé */}
          <div className="space-y-2">
            <label className="block text-sm font-medium text-[#3D52A0]">
              Quota Employé
            </label>
            <div className="flex items-center bg-[#EDE8F5] rounded-xl overflow-hidden border border-[#ADBBDA] hover:border-[#3D52A0] transition-colors group">
              <span className="px-4 py-3 bg-[#ADBBDA] text-[#3D52A0] font-medium border-r border-[#ADBBDA] group-hover:bg-[#7091E6] group-hover:text-white transition-colors">
                Employé
              </span>
              <input
                type="number"
                name="employee"
                value={quotas.employee}
                onChange={handleInputChange}
                className="flex-1 px-4 py-3 bg-white focus:outline-none text-[#3D52A0] placeholder-[#8697C4]"
                placeholder="Entrez le quota"
              />
            </div>
          </div>
  
          {/* Submit Button */}
          <button
            type="submit"
            className="w-full py-3 px-6 rounded-xl bg-gradient-to-r from-[#3D52A0] to-[#7091E6] text-white font-medium 
            transform transition-all hover:shadow-lg hover:scale-[1.02] active:scale-[0.98]
            focus:outline-none focus:ring-2 focus:ring-[#3D52A0] focus:ring-offset-2"
          >
            Mettre à jour les quotas
          </button>
        </form>
      </div>
    </div>
  );
  
};

export default QuotasForm;
