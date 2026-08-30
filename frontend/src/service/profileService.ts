import axios from "axios";

const API_URL = `${import.meta.env.VITE_BASE_URL}/api/profile`;

const config = () => ({
  headers: {
    Authorization:
      `Bearer ${localStorage.getItem("token")}`,
  },
});

export const getMyProfile = async () => {
  const response = await axios.get(
    `${API_URL}/me`,
    config()
  );

  return response.data.user;
};

export const updateProfile = async (
  data: {
    name?: string;
    username?: string;
    bio?: string;
    profileImage?: string;
  }
) => {
  const response = await axios.put(
    `${API_URL}/me`,
    data,
    config()
  );

  return response.data.user;
};