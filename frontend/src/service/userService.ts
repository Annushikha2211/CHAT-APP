import axios from "axios";

const API_URL =
  import.meta.env.VITE_BASE_URL
    ? `${import.meta.env.VITE_BASE_URL}/api/users`
    : "http://localhost:5000/api/users";

// ===============================
// GET ALL USERS
// ===============================
export const getUsers = async () => {
  const token = localStorage.getItem("token");

  const response = await axios.get(API_URL, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  return response.data.users;
};

// ===============================
// GET USER BY ID
// ===============================
export const getUserById = async (
  userId: string
) => {
  const token = localStorage.getItem("token");

  const response = await axios.get(
    `${API_URL}/${userId}`,
    {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }
  );

  return response.data.user;
};

// ===============================
// SEARCH USERS
// ===============================
export const searchUsers = async (
  query: string
) => {
  const token = localStorage.getItem("token");

  const response = await axios.get(
    `${API_URL}/search`,
    {
      params: {
        q: query,
      },
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }
  );

  return response.data.users;
};