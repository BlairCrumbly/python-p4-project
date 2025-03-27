import React, { useState, useEffect, useMemo } from "react";
import { useParams } from "react-router-dom";
import TaskCard from "./TaskCard";
import Switch from '@mui/material/Switch';
import FormControlLabel from '@mui/material/FormControlLabel';
import '../styles/TaskList.css';

const TaskDisplay = () => {
  const { klassId } = useParams();
  const [tasks, setTasks] = useState([]);
  const [klassName, setKlassName] = useState("");
  const [searchQuery, setSearchQuery] = useState("");
  const [sortBy, setSortBy] = useState("date");
  const [showCompleted, setShowCompleted] = useState(false);
  const [filterInput, setFilterInput] = useState("none");
  const [taskPriorities, setTaskPriorities] = useState({});
  const [isMobile, setIsMobile] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    const handleResize = () => setIsMobile(window.innerWidth <= 768);
    handleResize();
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  useEffect(() => {
    const fetchClassAndTasks = async () => {
      try {
        const csrfToken = getCookie("csrf_access_token");
        const requestHeaders = { "Content-Type": "application/json", "X-CSRF-TOKEN": csrfToken };

        const classResponse = await fetch(`/classes/${klassId}`, { method: "GET", credentials: "include", headers: requestHeaders });
        const classData = await checkStatus(classResponse).then(res => res.json());

        if (!classData || !classData.name) throw new Error("Class not found");
        setKlassName(classData.name);

        const taskResponse = await fetch(`/tasks/${klassId}`, { method: "GET", credentials: "include", headers: requestHeaders });
        const taskData = await checkStatus(taskResponse).then(res => res.json());

        if (!Array.isArray(taskData)) throw new Error("Invalid data format");
        setTasks(taskData);
      } catch (error) {
        setError(error.message);
        console.error("Error fetching class or tasks:", error);
      }
    };

    fetchClassAndTasks();
  }, [klassId]);

  const colorPriority = (task) => {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const dueDate = new Date(task.dueDate);
    dueDate.setHours(0, 0, 0, 0);

    const redZone = 7;
    const yellowZone = 14;

    if (dueDate < today) return 'overdue';
    const differenceInDays = Math.floor((dueDate - today) / (1000 * 60 * 60 * 24));

    return differenceInDays < redZone ? 'red' : differenceInDays < yellowZone ? 'yellow' : 'green';
  };

  useEffect(() => {
    const updatePriorities = () => {
      const newPriorities = {};
      tasks.forEach((task) => newPriorities[task.id] = colorPriority(task));
      setTaskPriorities(newPriorities);
    };
    updatePriorities();

    const interval = setInterval(updatePriorities, 24 * 60 * 60 * 1000);
    return () => clearInterval(interval);
  }, [tasks]);

  const handleSortByChange = (e) => setSortBy(e.target.value);
  const handleSearchChange = (e) => setSearchQuery(e.target.value);
  const handleTodoChange = () => setShowCompleted(prevState => !prevState);
  const handleColorFilterChange = (e) => setFilterInput(e.target.value);

  // Define the handleTaskCompletion function
  const handleTaskCompletion = async (taskId) => {
    try {
      const csrfToken = getCookie("csrf_access_token");
      const requestHeaders = { "Content-Type": "application/json", "X-CSRF-TOKEN": csrfToken };
  
      // Find the task by ID
      const taskToUpdate = tasks.find((task) => task.id === taskId);
  
      // Send request to the backend to update the task status
      const response = await fetch(`/tasks/${taskId}/complete`, {
        method: "PATCH",  // Or use PUT depending on your API design
        headers: requestHeaders,
        body: JSON.stringify({
          completed: !taskToUpdate.completed, // Toggle the completion status
        }),
      });
  
      const updatedTask = await checkStatus(response).then((res) => res.json());
  
      // If the task was updated successfully, update the task in the state
      setTasks((prevTasks) =>
        prevTasks.map((task) =>
          task.id === taskId ? { ...task, completed: updatedTask.completed } : task
        )
      );
    } catch (error) {
      console.error("Error updating task completion:", error);
      setError("There was an issue marking the task as complete.");
    }
  };
  

  const filteredTasks = tasks.filter((task) => {
    const taskName = (task.name || "").toLowerCase();
    const normalizedSearchQuery = searchQuery.toLowerCase();
    const matchesSearch = taskName.includes(normalizedSearchQuery);

    return (searchQuery === "" || matchesSearch) && (filterInput === "none" || colorPriority(task) === filterInput);
  });

  const sortedTasks = useMemo(() => {
    const sortByField = (a, b) => {
      if (sortBy === "date") {
        return new Date(a.dueDate) - new Date(b.dueDate);
      } else if (sortBy === "Z-A") {
        return b.name.toLowerCase().localeCompare(a.name.toLowerCase());
      }
      return a.name.toLowerCase().localeCompare(b.name.toLowerCase());
    };

    return filteredTasks
      .filter((task) => (showCompleted ? task.completed : !task.completed))
      .sort(sortByField);
  }, [filteredTasks, searchQuery, sortBy, showCompleted]);

  return (
    <div className="centered-container">
      <div className="TaskList">
        <h1>Tasks for Class: {klassName}</h1>
        {error && <p style={{ color: "red", border: "1px solid red", padding: "10px" }}>{error}</p>}

        {!searchQuery && (
          <div className={`DropDowns ${isMobile ? 'mobile-dropdowns' : ''}`}>
            <select onChange={handleSortByChange}>
              <option value="date">Sort by Date</option>
              <option value="A-Z">Sort by A-Z</option>
              <option value="Z-A">Sort by Z-A</option>
            </select>

            <select onChange={handleColorFilterChange}>
              <option value="none">None</option>
              <option value="overdue">Overdue</option>
              <option value="red">Red</option>
              <option value="yellow">Yellow</option>
              <option value="green">Green</option>
            </select>

            <FormControlLabel
              control={<Switch color="secondary" checked={showCompleted} onChange={handleTodoChange} />}
              label="Show completed tasks"
              labelPlacement="end"
              className="switch-label"
            />
          </div>
        )}

        <div className="search-bar-container">
          <input
            type="text"
            className="search-bar"
            placeholder="Search tasks..."
            value={searchQuery}
            onChange={handleSearchChange}
          />
        </div>

        {sortedTasks.length > 0 ? (
          <ul>
            {sortedTasks.map((task) => (
              <TaskCard
                key={task.id}
                task={task}
                priorityClass={taskPriorities[task.id]}
                handleTaskCompletion={handleTaskCompletion} // Pass handleTaskCompletion to TaskCard
              />
            ))}
          </ul>
        ) : (
          <p className="no-results-message">Sorry, didn't find anything. ):</p>
        )}
      </div>
    </div>
  );
};

const checkStatus = (response) => {
  if (response.ok) return Promise.resolve(response);
  return response.json().then((errorData) => {
    throw new Error(`HTTP Error: ${response.status} - ${response.statusText}. Details: ${errorData.message || "No details"}`);
  });
};

function getCookie(name) {
  const value = `; ${document.cookie}`;
  const parts = value.split(`; ${name}=`);
  if (parts.length === 2) return parts.pop().split(";").shift();
}

export default TaskDisplay;
