import React, { useState } from "react";
import { useNavigate, useOutletContext } from "react-router-dom";

const AddTaskForm = () => {
  const [task, setTask] = useState({
    name: "",
    description: "",
    dueDate: "",
    estimatedTime: "",
    completed: false,
  });
  const navigate = useNavigate();
  const {handleNewTask} = useOutletContext()
  const handleChange = (e) => {
    const { name, value } = e.target;
    setTask((prevState) => ({
      ...prevState,
      [name]: value,
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    fetch("http://localhost:3001/tasks", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(task),
    })
      .then((response) => response.json())
      .then((task) => {
        handleNewTask(task)
        //! Navigate back to the task list page after the task is added
        navigate("/");
      })
      .catch((error) => console.error("Error adding task:", error));
  };

  return (
    <div className="add-task-form-container">
      <form className="add-task-form" onSubmit={handleSubmit}>
        <h2>Add New Task</h2>

        <label>Task Name:</label>
        <input
          type="text"
          name="name"
          value={task.name}
          onChange={handleChange} 
          required
        />

        <label>Description:</label>
        <textarea
          name="description"
          value={task.description}
          onChange={handleChange}
        ></textarea>

        <label>Due Date:</label>
        <input
          type="date"
          name="dueDate"
          value={task.dueDate}
          onChange={handleChange}
          required
        />

        <label>Estimated Time (hours):</label>
        <input
          type="number"
          name="estimatedTime"
          value={task.estimatedTime}
          onChange={handleChange}
          required
        />

        <button type="submit">Add Task</button>
      </form>
    </div>

  );
};

export default AddTaskForm;
