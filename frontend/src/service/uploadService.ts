import axios from "axios";

const API_URL = `${import.meta.env.VITE_BASE_URL}/upload`;

export const uploadFile = async (
  file: File
) => {
  const token = localStorage.getItem("token");

  const formData = new FormData();

  formData.append("file", file);

  const response = await axios.post(
    API_URL,
    formData,
    {
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "multipart/form-data",
      },
    }
  );

  return response.data;
};