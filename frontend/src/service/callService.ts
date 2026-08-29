import { getSocket } from "./socketService";

export const startCall = (
  receiverId: string,
  type: "voice" | "video"
) => {
  const socket = getSocket();

  if (!socket) {
    console.log("Socket not connected");
    return;
  }

  socket.emit("call_user", {
    receiverId,
    type,
  });
};

export const acceptCall = (
  callerId: string,
  type: "voice" | "video"
) => {
  const socket = getSocket();

  socket?.emit("accept_call", {
    callerId,
    type,
  });
};

export const rejectCall = (callerId: string) => {
  const socket = getSocket();

  socket?.emit("reject_call", {
    callerId,
  });
};

export const endCall = (userId: string) => {
  const socket = getSocket();

  socket?.emit("end_call", {
    userId,
  });
};