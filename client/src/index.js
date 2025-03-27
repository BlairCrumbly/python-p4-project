import React from "react";
import ReactDOM from "react-dom/client";
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import { AuthProvider } from "./AuthContext";
import "./index.css";
import App from "./App";
import TaskList from "./components/TaskList";
import AddTaskForm from "./components/AddTaskForm";
import Statistics from "./components/Statistics";
import AuthPage from "./components/AuthPage"; // Import login/register component
import Dashboard from "./components/Dashboard"; // New dashboard component
import ProtectedRoute from "./components/ProtectedRoute"; // Protect access

const router = createBrowserRouter([
  { path: "/login", element: <AuthPage /> },
  {
    path: "/",
    element: (
      <ProtectedRoute>
        <App />
      </ProtectedRoute>
    ),
    children: [
      { index: true, element: <Dashboard /> }, // Show Dashboard instead of tasks first
      { path: "/tasks", element: <TaskList /> }, // Tasks only available after login
      { path: "/tasks/new", element: <AddTaskForm /> },
      { path: "/statistics", element: <Statistics /> },
    ],
  },
]);

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <AuthProvider>
      <RouterProvider router={router} />
    </AuthProvider>
  </React.StrictMode>
);
