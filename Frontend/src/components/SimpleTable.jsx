  import React, { useState,useEffect } from 'react';
  import axios from "axios";
  import { useAuth } from "@/context/AuthContext";

  const SimpleTable = () => {
      const { api } = useAuth();
    

    const [users,setUsers]=useState([])

    useEffect(() => {
      api.get("http://localhost:8080/user/all")
        .then(response => {
          setUsers(response.data);
        })
        .catch(error => {
        });
    }, []);

    return (
      <div className="w-full bg-white rounded-lg shadow-md p-4 md:p-6">
        <h2 className="text-xl md:text-2xl font-bold text-[#3D52A0] mb-4">Data Table</h2>
        <div className="overflow-x-auto">
          <table className="w-full min-w-[600px] divide-y divide-[#ADBBDA]">
            <thead className="bg-[#EDE8F5]">
              <tr>
                <th className="px-4 md:px-6 py-3 text-left text-xs md:text-sm font-medium text-[#3D52A0] uppercase tracking-wider">Cin</th>
                <th className="px-4 md:px-6 py-3 text-left text-xs md:text-sm font-medium text-[#3D52A0] uppercase tracking-wider">Nom</th>
                <th className="px-4 md:px-6 py-3 text-left text-xs md:text-sm font-medium text-[#3D52A0] uppercase tracking-wider">Email</th>
                <th className="px-4 md:px-6 py-3 text-left text-xs md:text-sm font-medium text-[#3D52A0] uppercase tracking-wider">Role</th>
                <th className="px-4 md:px-6 py-3 text-left text-xs md:text-sm font-medium text-[#3D52A0] uppercase tracking-wider">Status</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-[#ADBBDA]">
              {users.map((user) => (
                <tr 
                  key={user.cin}
                  className="hover:bg-[#F5F3FB] transition-colors duration-150"
                >
                  <td className="px-4 md:px-6 py-4 whitespace-nowrap text-sm text-[#3D52A0]">{user.cin}</td>
                  <td className="px-4 md:px-6 py-4 whitespace-nowrap text-sm text-[#3D52A0]">{user.nom} {user.prenom}</td>
                  <td className="px-4 md:px-6 py-4 whitespace-nowrap text-sm text-[#8697C4]">{user.email}</td>
                  <td className="px-4 md:px-6 py-4 whitespace-nowrap text-sm text-[#8697C4]">{user.role}</td>
                  <td className="px-4 md:px-6 py-4 whitespace-nowrap">
                    <span 
                      className={`
                        px-2 py-1 text-xs font-medium rounded-full
                        ${user.conge === false 
                          ? 'bg-[#E8F5E9] text-[#4CAF50]' // Actif
                          : 'bg-[#FFF3E0] text-[#FFA500]'} // Congé
                      `}
                    >
                      {user.conge === false ? "Actif" : "Congé"}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    );
  };

  export default SimpleTable;