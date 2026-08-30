import axios from "axios";

const API_URL =
  `${import.meta.env.VITE_BASE_URL}/api/cards`;

const getConfig = () => {
  const token = localStorage.getItem("token");

  return {
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json",
    },
  };
};

export const createCard = async (cardData: {
  receiverId: string;
  title: string;
  message: string;
  template: string;
}) => {
  const response = await axios.post(
    API_URL,
    cardData,
    getConfig()
  );

  return response.data.card;
};

export const getMyCards = async () => {
  const response = await axios.get(
    API_URL,
    getConfig()
  );

  return response.data.cards;
};