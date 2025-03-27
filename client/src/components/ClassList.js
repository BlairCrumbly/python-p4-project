// src/components/ClassList.js
import { useState, useEffect, useContext } from "react";
import { AuthContext } from "../AuthContext";  // Access user info from AuthContext
import { getClasses } from "../Auth";  // Import fetch function for getting classes

export default function ClassList() {
  const [classes, setClasses] = useState([]);
  const { user } = useContext(AuthContext);  // Get user info from context

  useEffect(() => {
    if (user) {
      // Fetch classes when the user is logged in
      async function fetchClasses() {
        try {
          const data = await getClasses();
          setClasses(data);  // Set the classes in the state
        } catch (error) {
          console.error("Error fetching classes:", error);
        }
      }

      fetchClasses();  // Call the fetch function
    }
  }, [user]);  // Only re-fetch when `user` changes

  return (
    <div>
      <h2>Your Classes</h2>
      <ul>
        {classes.map((klass) => (
          <li key={klass.id}>{klass.name}</li>  // Display each class
        ))}
      </ul>
    </div>
  );
}
