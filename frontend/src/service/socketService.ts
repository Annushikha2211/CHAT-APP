import { io, Socket } from "socket.io-client";

let socket: Socket | null = null;

export const connectSocket = () => {
  const token = localStorage.getItem("token");

  if (!token) {
    console.log("No token found");
    return null;
  }

  if (socket?.connected) {
    return socket;
  }
  
socket = io(
  import.meta.env.VITE_SOCKET_URL,
  {
    auth: {
      token,
    },
  }
);

  socket.on("connect", () => {
    console.log("Socket connected:", socket?.id);
  });

  socket.on("connect_error", (error) => {
    console.log("Socket connection error:", error.message);
  });

  socket.on("disconnect", () => {
    console.log("Socket disconnected");
  });

  return socket;
};

export const getSocket = () => {
  return socket;
};

export const disconnectSocket = () => {
  if (socket) {
    socket.disconnect();
    socket = null;
  }
};