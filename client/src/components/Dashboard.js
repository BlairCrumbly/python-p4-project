import { useContext } from "react";
import { AuthContext } from "../AuthContext";
import { useNavigate } from "react-router-dom";

export default function Dashboard() {
  const { user, logout } = useContext(AuthContext);
  const navigate = useNavigate();

  return (
    <div>
      <h1>Welcome, {user?.username}!</h1>
      <p>Dashboard: Overview of tasks and classes</p>
      <button onClick={() => logout(navigate("/login"))}>Logout</button>
    </div>
  );
}