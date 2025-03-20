import React from "react";
import ReactDOM from "react-dom/client";
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import "./index.css";
import App from "./App";
import TaskList from "./components/TaskList";
import AddTaskForm from "./components/AddTaskForm";
import Statistics from "./components/Statistics";

const router = createBrowserRouter([
  {
    path: "/", //? is this needed
    element: <App />,  //! parent component and always rendered
    //! all will render inside app
    children: [
      { index: true, element: <TaskList /> },
      { path: "/tasks/new", element: <AddTaskForm /> },
      { path: "/statistics", element: <Statistics /> },
    ],
  },
]);

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <RouterProvider router={router} />
  </React.StrictMode>
);
