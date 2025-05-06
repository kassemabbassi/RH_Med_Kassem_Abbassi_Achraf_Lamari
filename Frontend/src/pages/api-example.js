import axios from 'axios';
import { useState } from 'react';

export default function APIExample() {
  const [responseData, setResponseData] = useState(null); // Stocker les données renvoyées
  const [error, setError] = useState(null); // Stocker les erreurs éventuelles

  // Fonction pour envoyer des données au backend Spring Boot
  const sendData = async () => {
    try {
      const response = await axios.post('http://localhost:8080/api/data', {
        key: 'value', // Exemple de données envoyées
      });
      setResponseData(response.data); // Stocker les données retournées par Spring Boot
      setError(null); // Réinitialiser les erreurs si la requête réussit
    } catch (err) {
      console.error('Error:', err);
      setError('An error occurred while posting data.'); // Gérer les erreurs
    }
  };

  return (
    <div className='flex flex-col justify-center items-center'>
      <button className='bg-slate-500 p-5 m-40 rounded-lg' onClick={sendData}>Send Data to Spring Boot</button>

      {/* Afficher les données renvoyées par Spring Boot */}
      {responseData && (
        <div>
          <h2>Response from Spring Boot:</h2>
          <p>{responseData}</p>
        </div>
      )}

      {/* Afficher un message d'erreur s'il y en a */}
      {error && (
        <div style={{ color: 'red' }}>
          <h2>Error:</h2>
          <p>{error}</p>
        </div>
      )}
    </div>
  );
}
