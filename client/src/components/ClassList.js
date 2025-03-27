import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom'; // Import useNavigate hook
import ClassCard from './ClassCard';

const ClassList = () => {
  const [classes, setClasses] = useState([]);
  const [error, setError] = useState(null);
  const navigate = useNavigate(); // Use useNavigate hook

  useEffect(() => {
    const fetchClasses = async () => {
      try {
        const csrfToken = getCookie("csrf_access_token");

        const requestHeaders = {
          "Content-Type": "application/json",
          "X-CSRF-TOKEN": csrfToken,
        };

        const response = await fetch("/classes", {
          method: "GET",
          credentials: "include",
          headers: requestHeaders,
        });

        const validResponse = await checkStatus(response);
        const data = await validResponse.json();

        if (!Array.isArray(data)) {
          throw new Error("Invalid data format: Expected an array");
        }
        setClasses(data);
      } catch (error) {
        setError(error.message);
        console.error("Error fetching classes:", error);
      }
    };

    fetchClasses();
  }, []);

  // Use navigate to move to the TaskDisplay page
  const handleClassClick = (klassId) => {
    navigate(`/tasks/${klassId}`); // Navigate to the task display route
  };

  return (
    <div>
      <h1>Your Classes</h1>
      {error && <p style={{ color: 'red' }}>{error}</p>}
      <div style={{ display: 'flex', flexWrap: 'wrap', gap: '20px' }}>
        {classes.length > 0 ? (
          classes.map((klass) => (
            <ClassCard key={klass.id} klass={klass} onClick={() => handleClassClick(klass.id)} />
          ))
        ) : (
          <p>No classes found.</p>
        )}
      </div>
    </div>
  );
};

const checkStatus = (response) => {
  if (response.ok) {
    return Promise.resolve(response);
  } else {
    return response.json().then((errorData) => {
      throw new Error(
        `HTTP Error: ${response.status} - ${response.statusText}. Details: ${errorData.message || 'No details'}`
      );
    });
  }
};

function getCookie(name) {
  const value = `; ${document.cookie}`;
  const parts = value.split(`; ${name}=`);
  if (parts.length === 2) return parts.pop().split(';').shift();
}

export default ClassList;
