import React, { useState, useEffect } from 'react';
import './App.css';
import search from './assets/icons/search.png';
import remove from './assets/icons/remove.png';
import add from './assets/icons/add.png';
import min from './assets/icons/minimize.png';

export default function App() {

  const [showList, setShowList] = useState(false);
  const [input, setInput] = useState(false);
  const [newTaskDueTime, setNewTaskDueTime] = useState(''); // État pour l'heure de rappel
  const [tasks, setTasks] = useState([]);                   // État pour la liste des tâches
  const [searchQuery, setSearchQuery] = useState('');       // État pour la recherche de tâches
  const [newTask, setNewTask] = useState('');               // État pour le texte de la nouvelle tâche
  const [icon, setIcon] = useState(add);
  // Fonction pour ajouter une tâche avec rappel
  const handleAdd = () => {
    if (newTask.trim() !== '' && newTaskDueTime !== '') {
      const dueTime = new Date(newTaskDueTime).getTime();
      if (!isNaN(dueTime)) { // Vérifie que dueTime est une date valide
        const taskWithReminder = {
          name: newTask,
          dueTime: dueTime
        };
        setTasks([...tasks, taskWithReminder]);
        setNewTask('');
        setNewTaskDueTime('');
        setInput(false);
      } else {
        console.error("La date de rappel est invalide. Veuillez vérifier le format.");
      }
    } else {
      alert('Veuillez entrer une tâche et une date de rappel valide.');
    }
  };

  // Fonction pour filtrer les tâches en fonction de la recherche
  const filteredTasks = tasks.filter((task) =>
    task.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  // Effet pour vérifier les rappels périodiquement
  useEffect(() => {
    const interval = setInterval(() => {
      const now = Date.now();
      tasks.forEach((task, index) => {
        if (task.dueTime <= now) {
          alert(`La tâche "${task.name}" est arrivée à échéance !`);
          handleRemove(index); // Supprime la tâche une fois rappelée
        }
      });
    }, 1000); // Vérifie toutes les secondes

    return () => clearInterval(interval); // Nettoie l'intervalle lorsque le composant est démonté
  }, [tasks]);

  const handleClick = () => {
    const area = document.getElementById('area');
    if (area.value === '') {
      alert('Please enter a task');
      return;
    }
    setShowList(!showList);
  };

  const handleDefine = () => {
    setInput(!input);
  };

  // Fonction pour supprimer une tâche de la liste
  const handleRemove = (index) => {
    const updatedTasks = tasks.filter((_, i) => i !== index); // Filtre les tâches pour exclure celle avec l'index donné
    setTasks(updatedTasks);                                   // Met à jour la liste des tâches
  };

  return (
    <div className='App'>
      <div>
        <h1 className="title"> TASK EXPLORER </h1>
      </div>
      <input
        id="area"
        className="search-bar"
        type="text"
        value={searchQuery}
        onChange={(e) => setSearchQuery(e.target.value)}
        placeholder="Search tasks..."
      />

      <div>
        <button className="search-button" onClick={handleClick}> <img src={search} width={25} height={25} alt="Search" /> Search </button>
      </div>

      <div className='groups'>
        <button className="add-button" onClick={handleDefine}> <img src={input ? min : add} width={25} height={25} alt={input ? "hide" : "add"} />  {input ? "Hide" : "Show"} Add a task </button>
        {input && (
          <div> 
            <input
              id="defineTask"
              value={newTask}
              onChange={(e) => setNewTask(e.target.value)}
              className="define-task"
              type="text"
              placeholder="Define a task"
            />

            <input
              type="datetime-local"
              value={newTaskDueTime}
              onChange={(e) => setNewTaskDueTime(e.target.value)}
              className="define-due-time"
              placeholder="Set a due time"
            />

            <button className="confirm-button" onClick={handleAdd}>Confirm</button>
          </div>
        )}
      </div>

      <div className='task-board'>
        <ul>
          {filteredTasks.map((task, index) => (
            <li key={index}>
              {task.name} (Rappel : {isNaN(task.dueTime) ? "Date invalide" : new Date(task.dueTime).toLocaleString()})
              <button onClick={() => handleRemove(index)} className="rem-btn"> <img src={remove} alt="remove" width={20} height={20} /> Remove </button>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}
