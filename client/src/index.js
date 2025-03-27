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
import ClassList from "./components/ClassList"; // Import ClassList component
import CreateClassForm from "./components/CreateClassForm";
import TaskDisplay from "./components/TaskDisplay";
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
      { path: "/my-classes", element: <ClassList /> }, // Add the route for "My Classes"
      { path: "/tasks", element: <TaskList /> }, // Tasks only available after login
      { path: "/tasks/new", element: <AddTaskForm /> },
      { path: "/statistics", element: <Statistics /> },
      { path: "/classes", element: <ClassList /> },  // Add this route to display all classes
      { path: "/classes/new", element: <CreateClassForm /> },  // If you still want a form for creating classes
      
      { path: "/tasks/:klassId", element: <TaskDisplay /> }
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
