import axios from "axios";

const API_URL = "http://localhost:5000/api/users";

export const getUsers = async () => {
  const token = localStorage.getItem("token");

  const response = await axios.get(
    "http://localhost:5000/api/users",
    {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }
  );

  return response.data.users;
};