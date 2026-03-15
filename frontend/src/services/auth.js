import { buildApiUrl } from "./api.js";

export const loginUser = async (credentials) => {
  const response = await fetch(buildApiUrl("/auth/login"), {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(credentials),
  });

  if (!response.ok) {
    throw new Error("Login failed. Please check your credentials.");
  }

  const data = await response.json();
  if (data?.access_token) {
    localStorage.setItem("authToken", data.access_token);
  }
  if (credentials?.email) {
    localStorage.setItem("userEmail", credentials.email);
  }

  return data;
};

export const registerUser = async (userData) => {
  const response = await fetch(buildApiUrl("/auth/register"), {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(userData),
  });

  if (!response.ok) {
    throw new Error("Registration failed. Please try again.");
  }

  return response.json();
};

export const getToken = () => localStorage.getItem("authToken");

export const logoutUser = () => {
  localStorage.removeItem("authToken");
  localStorage.removeItem("userEmail");
};
