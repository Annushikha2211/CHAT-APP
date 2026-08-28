import axios from "axios";

const API_URL =
  "http://localhost:5000/api/messages";

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