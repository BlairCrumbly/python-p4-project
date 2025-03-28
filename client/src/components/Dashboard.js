import { useContext } from "react";
import { AuthContext } from "../AuthContext";
import { useNavigate } from "react-router-dom";
import "../styles/Dashboard.css"; // Import the styling

export default function Dashboard() {
  const { user, logout } = useContext(AuthContext);
  const navigate = useNavigate();

  return (
    <div className="dashboard-container">
      <h1>Welcome, {user.username}</h1>
      <p>Overview of tasks and classes Coming soon!</p>
      <button onClick={() => logout(navigate("/login"))}>Logout</button>
    </div>
  );
}
