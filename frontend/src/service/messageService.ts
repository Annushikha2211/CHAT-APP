import axios from "axios";

const API_URL = "http://localhost:5000/api/messages";

const getConfig = () => {
  const token = localStorage.getItem("token");

  return {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  };
};

// GET MESSAGES
export const getMessages = async (userId: string) => {
  const response = await axios.get(
    `${API_URL}/${userId}`,
    getConfig()
  );

  return response.data.messages;
};

// SEND MESSAGE
export const sendMessage = async (
  receiver: string,
  content: string,
  messageType: "text" | "image" | "file" = "text",
  fileUrl: string = ""
) => {
  const response = await axios.post(
    API_URL,
    {
      receiver,
      content,
      messageType,
      fileUrl,
    },
    getConfig()
  );

  return response.data.message;
};

// MARK READ
export const markMessagesAsRead = async (
  userId: string
) => {
  const response = await axios.put(
    `${API_URL}/read/${userId}`,
    {},
    getConfig()
  );

  return response.data;
};

// MARK DELIVERED
export const markMessagesAsDelivered = async (
  userId: string
) => {
  const response = await axios.put(
    `${API_URL}/delivered/${userId}`,
    {},
    getConfig()
  );

  return response.data;
};

// EDIT MESSAGE
export const editMessage = async (
  messageId: string,
  content: string
) => {
  const response = await axios.put(
    `${API_URL}/${messageId}`,
    {
      content,
    },
    getConfig()
  );

  return response.data.message;
};

// DELETE MESSAGE
export const deleteMessage = async (
  messageId: string
) => {
  const response = await axios.delete(
    `${API_URL}/${messageId}`,
    getConfig()
  );

  return response.data.message;
};

export const sendMediaMessage = async (
  receiver: string,
  messageType: "image" | "file",
  fileUrl: string,
  content = ""
) => {
  const response = await axios.post(
    API_URL,
    {
      receiver,
      content,
      messageType,
      fileUrl,
    },
    getConfig()
  );

  return response.data.message;
};