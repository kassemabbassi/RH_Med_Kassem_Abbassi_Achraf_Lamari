import React, { useState, useEffect } from 'react';
import { DragDropContext, Droppable, Draggable } from '@hello-pangea/dnd';
import CreationTacheForm from '../components/CreationTacheForm';
import { useAuth } from "@/context/AuthContext";
const COLUMNS = {
  A_FAIRE: { 
    id: 'A-FAIRE', 
    title: 'À Faire', 
    className: 'bg-red-50 border-red-200' 
  },
  EN_COURS: { 
    id: 'EN-COURS', 
    title: 'En Cours', 
    className: 'bg-yellow-50 border-yellow-200' 
  },
  TERMINE: { 
    id: 'TERMINE', 
    title: 'Terminé', 
    className: 'bg-green-50 border-green-200' 
  }
};
const KanbanBoard = () => {
  const { api } = useAuth();
  const [isFormOpen, setIsFormOpen] = useState(false);
  const openForm = () => setIsFormOpen(true); 
  const closeForm = () => setIsFormOpen(false); 
  const [tasks, setTasks] = useState({
    'A-FAIRE': [],
    'EN-COURS': [],
    'TERMINE': []
  });
  const [isLoading, setIsLoading] = useState(true);
  const [newTask, setNewTask] = useState({ 
    titre: '', 
    description: '', 
    dateDebut: null,
    dateFin: null
  });
  // Charger les tâches
const fetchTasks = async () => {
  try {
    setIsLoading(true);
    
    const response = await api.get('/taches');
    
    if (!response || !response.data) {
      throw new Error("Réponse invalide du serveur");
    }

    const tasksData = response.data || [];

    const organizedTasks = {
      'A-FAIRE': tasksData.filter(t => t.etat === 'A-FAIRE'),
      'EN-COURS': tasksData.filter(t => t.etat === 'EN-COURS'),
      'TERMINE': tasksData.filter(t => t.etat === 'TERMINE')
    };

    setTasks(organizedTasks);
  } catch (err) {
    afficherNotification(`Erreur lors du chargement des tâches: ${err.message}`, false);
  } finally {
    setIsLoading(false);
  }
};
  // Charger les tâches au montage
  useEffect(() => {
    fetchTasks();
  }, []);

 // Mettre à jour l'état d'une tâche
  const updateTaskState = async (task, newState) => {
    try {
      await api.put(`/taches/${task.id_tache}`, { 
        ...task, 
        etat: newState 
      });
      if(response.status===200)
      {
        afficherNotification("Tâche mise à jour avec succès", true);

      }
    
     else {
      throw new Error("Réponse inattendue du serveur");
    }
    } catch (err) {
      
     
    }
  };


  // Logique de glisser-déposer
  const onDragEnd = (result) => {
    const { source, destination, draggableId } = result;

    if (!destination) return;
    if (source.droppableId === destination.droppableId) return;

    const sourceColumn = source.droppableId;
    const destColumn = destination.droppableId;
    const sourceTasks = [...tasks[sourceColumn]];
    const destTasks = [...tasks[destColumn]];

    const [movedTask] = sourceTasks.splice(source.index, 1);
    movedTask.etat = destColumn;
    destTasks.splice(destination.index, 0, movedTask);

    setTasks({
      ...tasks,
      [sourceColumn]: sourceTasks,
      [destColumn]: destTasks
    });

    updateTaskState(movedTask, destColumn);
  };



// Supprimer une tâche
const handleDeleteTask = async (task) => {
  try {
    const response = await api.delete(`/taches/${task.id_tache}`);

    if (response.status === 200) {
      const updatedTasks = { ...tasks };
      Object.keys(updatedTasks).forEach(column => {
        updatedTasks[column] = updatedTasks[column].filter(t => t.id_tache !== task.id_tache);
      });

      setTasks(updatedTasks);
      afficherNotification("Tâche supprimée avec succès", true);
    } else {
      throw new Error("Réponse inattendue du serveur");
    }
  } catch (err) {
    afficherNotification(`Erreur lors de la suppression de la tâche: ${err.message}`, false);
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


  return (
    <div className="w-full bg-[#EDE8F5] min-h-screen">
      {/* Bouton "Ajouter" */}
      <div className="mb-6 flex justify-end p-4">
        <button
          onClick={openForm}
          className="bg-[#7091E6] text-white px-6 py-3 rounded-lg flex items-center justify-center shadow-md hover:bg-[#3D52A0] transition-colors"
        >
          <span className="mr-2">+</span> {/* Icône Ajouter */}
          Ajouter
        </button>
      </div>
  
      {/* Formulaire de création de tâche */}
      {isFormOpen && <CreationTacheForm closeModal={closeForm} />}
  
      {/* Tableau de tâches avec drag-and-drop */}
      <DragDropContext onDragEnd={onDragEnd}>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 p-4">
          {Object.values(COLUMNS).map((column) => (
            <Droppable key={column.id} droppableId={column.id}>
              {(provided) => (
                <div
                  {...provided.droppableProps}
                  ref={provided.innerRef}
                  className={`p-4 rounded-lg border-2 border-[#ADBBDA] bg-white shadow-sm`}
                >
                  <h2 className="text-xl font-bold mb-4 text-center text-[#3D52A0]">
                    {column.title}
                  </h2>
  
                  {/* Liste des tâches */}
                  {tasks[column.id].map((task, index) => (
                    <Draggable
                      key={task.id_tache}
                      draggableId={task.id_tache.toString()}
                      index={index}
                    >
                      {(provided) => (
                        <div
                          ref={provided.innerRef}
                          {...provided.draggableProps}
                          {...provided.dragHandleProps}
                          className="bg-white p-4 mb-4 rounded-lg shadow-md border border-[#ADBBDA] relative hover:shadow-lg transition-shadow"
                        >
                          {/* Bouton de suppression */}
                          <button
                            onClick={() => handleDeleteTask(task)}
                            className="absolute top-2 right-2 text-[#8697C4] hover:text-[#3D52A0] transition-colors"
                          >
                            <span className="text-lg">×</span> {/* Icône Supprimer */}
                          </button>
  
                          {/* Titre de la tâche */}
                          <h3 className="font-bold text-lg mb-2 text-[#3D52A0]">
                            {task.titre}
                          </h3>
  
                          {/* Détails de la tâche */}
                          <div className="text-sm text-[#8697C4] space-y-1">
                            <p className="flex items-center">
                              <span className="mr-2 text-[#7091E6]">📅</span> {/* Icône Calendrier */}
                              <span className="font-medium mr-2">Début:</span>
                              {task.dateDebut
                                ? new Date(task.dateDebut).toLocaleDateString()
                                : "Non définie"}
                            </p>
                            <p className="flex items-center">
                              <span className="mr-2 text-[#7091E6]">📅</span> {/* Icône Calendrier */}
                              <span className="font-medium mr-2">Fin:</span>
                              {task.dateFin
                                ? new Date(task.dateFin).toLocaleDateString()
                                : "Non définie"}
                            </p>
                            <p className="flex items-center">
                              <span className="mr-2 text-[#7091E6]">👤</span> {/* Icône Utilisateur */}
                              <span className="font-medium mr-2">Responsable:</span>
                              {task.responsable || "Non définie"}
                            </p>
                          </div>
  
                          {/* Description de la tâche */}
                          {task.description && (
                            <p className="text-gray-500 mt-2 text-sm">
                              {task.description}
                            </p>
                          )}
                        </div>
                      )}
                    </Draggable>
                  ))}
                  {provided.placeholder}
                </div>
              )}
            </Droppable>
          ))}
        </div>
      </DragDropContext>
    </div>
  );
};

export default KanbanBoard;
