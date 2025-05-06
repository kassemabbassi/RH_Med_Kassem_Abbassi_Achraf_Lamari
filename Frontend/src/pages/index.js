"use client";

import { useState } from "react";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

    import { useAuth } from "@/context/AuthContext";
import GestionTaches from "./GestionTaches";

export default function Home() {
  const { api } = useAuth();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const validateEmail = (email) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  const handleLogin = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    if (!email || !password) {
      setError("Veuillez remplir tous les champs.");
      setLoading(false);
      return;
    }

    if (!validateEmail(email)) {
      setError("Veuillez entrer un email valide.");
      setLoading(false);
      return;
    }

    try {
      const res =await api.post("/login", {
        email,
        password,
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.message || "Échec de la connexion");
      }

      // Connexion réussie
      toast.success("Connexion réussie !");
      setTimeout(() => {
        window.location.href = "/GestionUtilisateurs";
      }, 1500);

    } catch (err) {
      setError(err.message);
      toast.error(err.message);
    } finally {
      setLoading(false);
    }
  };

  /*return (
    <div className="min-h-screen bg-gray-50 text-gray-800">

     
      <main className="flex-grow flex items-center justify-center px-4 py-12">
        <div className="w-full max-w-md bg-white rounded-2xl shadow-xl p-8 border border-gray-200 transition-transform hover:shadow-2xl duration-300">
          
          <h2 className="text-3xl font-bold text-center mb-4 text-gray-900">Bienvenue</h2>
          <p className="text-center text-gray-500 mb-8">Connectez-vous à votre compte</p>

          
          <form onSubmit={handleLogin} className="space-y-6">
            {error && (
              <div className="bg-red-100 text-red-700 p-3 rounded-lg text-sm text-center">
                {error}
              </div>
            )}

           
            <div>
              <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
                Email
              </label>
              <input
                id="email"
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full px-4 py-3 rounded-lg bg-gray-50 border border-gray-300 focus:border-blue-500 focus:ring focus:ring-blue-200 outline-none text-gray-800 placeholder-gray-400 transition"
                placeholder="exemple@email.com"
              />
            </div>

                <div>
              <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-1">
                Mot de passe
              </label>
              <input
                id="password"
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full px-4 py-3 rounded-lg bg-gray-50 border border-gray-300 focus:border-blue-500 focus:ring focus:ring-blue-200 outline-none text-gray-800 placeholder-gray-400 transition"
                placeholder="••••••••"
              />
            </div>

            
            <div className="text-right">
              <a href="/Reinitialiser" className="text-sm text-blue-600 hover:text-blue-800 underline">
                Mot de passe oublié ?
              </a>
            </div>

            
            <button
              type="submit"
              disabled={loading}
              className={`w-full py-3 px-4 rounded-lg text-white font-semibold bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 focus:outline-none focus:ring-2 focus:ring-blue-400 transition ${
                loading ? "opacity-70 cursor-not-allowed" : ""
              }`}
            >
              {loading ? (
                <span className="flex items-center justify-center">
                  <svg className="animate-spin -ml-1 mr-2 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  Connexion...
                </span>
              ) : (
                "Se connecter"
              )}
            </button>
          </form>
        </div>
      </main>

  
      <footer className="text-center text-gray-500 text-sm py-4 bg-white border-t border-gray-200">
        © {new Date().getFullYear()} - MyApp. Tous droits réservés.
      </footer>

      <ToastContainer position="bottom-center" autoClose={3000} />
    </div>
  );*/
  return(
    <div className="min-h-screen bg-gray-50">
      <GestionTaches />
      </div>
  )
}