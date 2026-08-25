import axios from "axios";

const API_URL =
  "http://localhost:5000/api/messages";

export const getMessages = async (
  userId: string
) => {
  const token =
    localStorage.getItem("token");

  const response = await axios.get(
    `${API_URL}/${userId}`,
    {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }
  );

  return response.data.messages;
};

export const sendMessage = async (
  receiver: string,
  content: string
) => {
  const token =
    localStorage.getItem("token");

  const response = await axios.post(
    API_URL,
    {
      receiver,
      content,
    },
    {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }
  );

  return response.data.message;
};