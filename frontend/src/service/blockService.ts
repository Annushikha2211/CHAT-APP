import axios from "axios";

const API = "http://localhost:5000/api/blocks";

const getConfig = () => ({
  headers: {
    Authorization: `Bearer ${localStorage.getItem("token")}`,
  },
});

export const blockUser = async (userId: string) => {
  const response = await axios.post(
    `${API}/${userId}`,
    {},
    getConfig()
  );

  return response.data;
};

export const unblockUser = async (userId: string) => {
  const response = await axios.delete(
    `${API}/${userId}`,
    getConfig()
  );

  return response.data;
};

export const getBlockStatus = async (userId: string) => {
  const response = await axios.get(
    `${API}/${userId}`,
    getConfig()
  );

  return response.data.blocked;
};