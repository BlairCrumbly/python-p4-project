import React from "react";
import { useEffect, useState } from "react";
import { Outlet } from "react-router-dom";
import Navbar from "./components/Navbar";


function App() {
  const [tasks, setTasks] = useState([]);
  useEffect(() => {
    fetch("http://localhost:3001/tasks")
      .then((response) => response.json())
      .then((data) => {
        // !s ort the tasks by dueDate and estimatedTime when they are fetched
        const sortedTasks = data.sort((a, b) => {
          const dateComparison = new Date(a.dueDate) - new Date(b.dueDate);


          if (dateComparison !== 0) {
            return dateComparison;
          }
          const estimatedTimeA = parseInt(a.estimatedTime) || 0;
          const estimatedTimeB = parseInt(b.estimatedTime) || 0;
          return estimatedTimeB - estimatedTimeA;
        });
        setTasks(sortedTasks);
      })
      .catch((error) => console.error("Error fetching tasks:", error));
  }, []);

//! get length info for pie chart
  const totalTasks = tasks.length;
  const completedTasks = tasks.filter(task => task.completed).length;


//! handles the a new task
  const handleNewTask = (task) => {
    setTasks(prevtasks => [...prevtasks, task])
  }
//! patches when task is completed
const handleTaskCompletion = (taskId, completed) => {
  setTasks((prevTasks) =>
    prevTasks.map((task) =>
      task.id === taskId
        ? { ...task, fadingOut: true, addingLineThrough: !completed }
        : task
    )
  );

  setTimeout(() => {
    fetch(`http://localhost:3001/tasks/${taskId}`, {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        completed: !completed,
      }),
    })
      .then((response) => response.json())
      .then(() => {
        setTasks((prevTasks) =>
          prevTasks.map((task) =>
            task.id === taskId
              ? { ...task, completed: !task.completed, fadingOut: false, addingLineThrough: false }
              : task
          )
        );
      });
  }, 500); // delay animation before updating state
};

  return (

    <div className="App">
      
      <Navbar totalTasks={totalTasks} completedTasks={completedTasks} />
      <Outlet
        context={{ handleNewTask, handleTaskCompletion, tasks, totalTasks, completedTasks }}
      />
    </div>

  );
}

export default App;
