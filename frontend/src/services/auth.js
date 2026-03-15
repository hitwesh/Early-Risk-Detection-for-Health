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

export const buildAuthHeaders = () => {
  const token = getToken();
  if (!token) {
    return {};
  }
  return {
    Authorization: `Bearer ${token}`,
  };
};

export const getUserHistory = async () => {
  const response = await fetch(buildApiUrl("/users/me/history"), {
    headers: {
      "Content-Type": "application/json",
      ...buildAuthHeaders(),
    },
  });

  if (!response.ok) {
    const error = new Error("Unable to load diagnosis history.");
    error.status = response.status;
    throw error;
  }

  return response.json();
};

export const getCurrentUser = async () => {
  const response = await fetch(buildApiUrl("/users/me"), {
    headers: {
      "Content-Type": "application/json",
      ...buildAuthHeaders(),
    },
  });

  if (!response.ok) {
    const error = new Error("Unable to load user profile.");
    error.status = response.status;
    throw error;
  }

  return response.json();
};

export const getAdminStats = async () => {
  const response = await fetch(buildApiUrl("/admin/stats"), {
    headers: {
      "Content-Type": "application/json",
      ...buildAuthHeaders(),
    },
  });

  if (!response.ok) {
    const error = new Error("Unable to load admin stats.");
    error.status = response.status;
    throw error;
  }

  return response.json();
};

export const getAdminUsers = async () => {
  const response = await fetch(buildApiUrl("/admin/users"), {
    headers: {
      "Content-Type": "application/json",
      ...buildAuthHeaders(),
    },
  });

  if (!response.ok) {
    const error = new Error("Unable to load admin users.");
    error.status = response.status;
    throw error;
  }

  return response.json();
};

export const deleteAdminUser = async (userId) => {
  const response = await fetch(buildApiUrl(`/admin/users/${userId}`), {
    method: "DELETE",
    headers: {
      "Content-Type": "application/json",
      ...buildAuthHeaders(),
    },
  });

  if (!response.ok) {
    const error = new Error("Unable to delete user.");
    error.status = response.status;
    throw error;
  }

  return response.json();
};

export const logoutUser = () => {
  localStorage.removeItem("authToken");
  localStorage.removeItem("userEmail");
};
