import axios from "axios";

const API_URL = `${import.meta.env.VITE_BASE_URL}/messages`;

const getConfig = () => {
  const token = localStorage.getItem("token");

  return {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  };
};

export const getChatList = async () => {
  const response = await axios.get(
    `${API_URL}/chats`,
    getConfig()
  );

  return response.data.chats;
};