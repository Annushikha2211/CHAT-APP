import axios from "axios";

const API_URL =
  "http://localhost:5000/api/cards";

const getConfig = () => {
  const token = localStorage.getItem("token");

  return {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  };
};

export const createCard = async (
  data: {
    title: string;
    message: string;
    template: string;
    receiver?: string;
  }
) => {
  const response = await axios.post(
    API_URL,
    data,
    getConfig()
  );

  return response.data.card;
};

export const getMyCards = async () => {
  const response = await axios.get(
    `${API_URL}/my`,
    getConfig()
  );

  return response.data.cards;
};