import axios from "axios";

const API_URL =
  `${import.meta.env.VITE_BASE_URL}/friend-requests`;

const getConfig = () => {
  const token = localStorage.getItem("token");

  return {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  };
};

export const sendFriendRequest = async (
  receiverId: string
) => {
  const response = await axios.post(
    `${API_URL}/send`,
    {
      receiverId,
    },
    getConfig()
  );

  return response.data;
};

export const getReceivedRequests =
  async () => {
    const response = await axios.get(
      `${API_URL}/received`,
      getConfig()
    );

    return response.data.requests;
  };

export const acceptFriendRequest =
  async (requestId: string) => {
    const response = await axios.put(
      `${API_URL}/${requestId}/accept`,
      {},
      getConfig()
    );

    return response.data;
  };

export const rejectFriendRequest =
  async (requestId: string) => {
    const response = await axios.put(
      `${API_URL}/${requestId}/reject`,
      {},
      getConfig()
    );

    return response.data;
  };

export const getFriends = async () => {
  const response = await axios.get(
    `${API_URL}/friends`,
    getConfig()
  );

  return response.data.friends;
};