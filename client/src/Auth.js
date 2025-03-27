// auth.js

const API_URL = "http://127.0.0.1:5555";

async function fetchWithCSRF(url, options = {}) {
  const response = await fetch(url, {
    ...options,
    headers: {
      "Content-Type": "application/json",
      "X-CSRF-TOKEN": getCSRFToken(),  // Add CSRF Token manually
      ...(options.headers || {}),
    },
    credentials: "include",  // Ensures cookies are sent with the request
  });
  return response.json();
}

function getCSRFToken() {
  return document.cookie
    .split("; ")
    .find(row => row.startsWith("csrf_token="))
    ?.split("=")[1] || "";
}

export async function login(values) {
  return fetchWithCSRF(`${API_URL}/login`, {
    method: "POST",
    body: JSON.stringify(values),
  });
}

export async function register(values) {
  return fetchWithCSRF(`${API_URL}/register`, {
    method: "POST",
    body: JSON.stringify(values),
  });
}

export async function logout() {
  return fetchWithCSRF(`${API_URL}/logout`, { method: "DELETE" });
}

export async function getClasses() {
    return fetchWithCSRF(`${API_URL}/classes`, {
        method: "GET",
    });
  }

export async function createClass(values) {
    return fetchWithCSRF(`${API_URL}/classes`, {
        method: "POST",
        body: JSON.stringify(values),
    });
}

export async function deleteClass(klassId) {
    return fetchWithCSRF(`${API_URL}/classes/${klassId}`, {
        method: "DELETE",
    });
}