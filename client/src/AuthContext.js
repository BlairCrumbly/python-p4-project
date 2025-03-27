import { createContext, useState, useEffect } from "react";

export const AuthContext = createContext();

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);

  useEffect(() => {
    // Check if the user is already logged in (check localStorage or session)
    const storedUser = JSON.parse(localStorage.getItem("user"));
    if (storedUser) {
      setUser(storedUser); // Set the user from localStorage
    } else {
      // If no user in localStorage, fetch user profile from backend
      fetch("/profile", {
        credentials: "include",
      })
        .then((res) => (res.ok ? res.json() : null))
        .then((data) => {
          if (data) {
            setUser(data);
            localStorage.setItem("user", JSON.stringify(data)); // Store user in localStorage
          }
        })
        .catch(() => setUser(null)); // Clear user if error
    }
  }, []);

  const login = (userData) => {
    setUser(userData);
    localStorage.setItem("user", JSON.stringify(userData)); // Store user in localStorage
  };

  const logout = () => {
    fetch("/logout", {
      method: "DELETE",
      credentials: "include",
    })
      .then(() => {
        setUser(null);
        localStorage.removeItem("user"); // Remove user from localStorage
      })
      .catch(() => setUser(null));
  };

  const updateuser = (value) => setUser(value)

  return (
    <AuthContext.Provider value={{ user, login, logout, updateuser }}>
      {children}
    </AuthContext.Provider>
  );
}
