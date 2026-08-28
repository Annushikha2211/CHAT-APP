import {
  useEffect,
  useRef,
  useState,
} from "react";

import {
  useNavigate,
  useParams,
} from "react-router-dom";

import { jwtDecode } from "jwt-decode";

import {
  getMessages,
  sendMessage,
  markMessagesAsRead,
  markMessagesAsDelivered,
} from "../../service/messageService";

import {
  getSocket,
  connectSocket,
} from "../../service/socketService";

// import ChatHeader from "../../components/chat/ChatHeader.ts";
import ChatHeader from "./ChatHeader";
import MessageBubble from "./MessageBubble";
import MessageInput from "./MessageInput";
import TypingIndicator from "./TypingIndicator";

interface IMessage {
  _id: string;
  sender: string;
  receiver: string;
  content: string;

  messageType: "text" | "image" | "file";

  fileUrl?: string;

  isRead: boolean;
  isDelivered: boolean;

  createdAt: string;
}

interface JwtPayload {
  userId: string;
}

function Chat() {
  const { userId } = useParams<{
    userId: string;
  }>();

  const navigate = useNavigate();

  const [messages, setMessages] =
    useState<IMessage[]>([]);

  const [content, setContent] =
    useState("");

  const [isTyping, setIsTyping] =
    useState(false);

  const [isOnline, setIsOnline] =
    useState(false);

  const [receiverName, setReceiverName] =
    useState("Chat");

  const bottomRef =
    useRef<HTMLDivElement>(null);

  const token = localStorage.getItem("token");

  let currentUserId = "";

  if (token) {
    try {
      const decoded =
        jwtDecode<JwtPayload>(token);

      currentUserId = decoded.userId;
    } catch {
      localStorage.removeItem("token");
      navigate("/login");
    }
  }

  useEffect(() => {
    if (!userId) return;

    const socket =
      connectSocket();

    const fetchMessages = async () => {
      try {
        const data =
          await getMessages(userId);

        setMessages(data);

        await markMessagesAsDelivered(
          userId
        );

        await markMessagesAsRead(
          userId
        );
      } catch (error) {
        console.log(
          "Fetch messages error:",
          error
        );
      }
    };

    fetchMessages();

    if (!socket) return;

    const handleNewMessage = (
      message: IMessage
    ) => {
      if (
        message.sender === userId
      ) {
        setMessages((prev) => [
          ...prev,
          message,
        ]);

        markMessagesAsDelivered(
          userId
        );

        markMessagesAsRead(
          userId
        );

        socket.emit("message_read", {
          messageId: message._id,
          senderId: message.sender,
        });
      }
    };

    const handleDelivered = ({
      messageId,
    }: {
      messageId: string;
    }) => {
      setMessages((prev) =>
        prev.map((message) =>
          message._id === messageId
            ? {
                ...message,
                isDelivered: true,
              }
            : message
        )
      );
    };

    const handleRead = ({
      messageId,
    }: {
      messageId: string;
    }) => {
      setMessages((prev) =>
        prev.map((message) =>
          message._id === messageId
            ? {
                ...message,
                isRead: true,
                isDelivered: true,
              }
            : message
        )
      );
    };

    const handleTyping = ({
      userId: typingUser,
    }: {
      userId: string;
    }) => {
      if (typingUser === userId) {
        setIsTyping(true);
      }
    };

    const handleStopTyping = ({
      userId: typingUser,
    }: {
      userId: string;
    }) => {
      if (typingUser === userId) {
        setIsTyping(false);
      }
    };

    const handleOnline = (
      onlineUserId: string
    ) => {
      if (onlineUserId === userId) {
        setIsOnline(true);
      }
    };

    const handleOffline = (
      offlineUserId: string
    ) => {
      if (offlineUserId === userId) {
        setIsOnline(false);
      }
    };

    socket.on(
      "new_message",
      handleNewMessage
    );

    socket.on(
      "message_delivered",
      handleDelivered
    );

    socket.on(
      "message_read",
      handleRead
    );

    socket.on(
      "user_typing",
      handleTyping
    );

    socket.on(
      "user_stop_typing",
      handleStopTyping
    );

    socket.on(
      "user_online",
      handleOnline
    );

    socket.on(
      "user_offline",
      handleOffline
    );

    return () => {
      socket.off(
        "new_message",
        handleNewMessage
      );

      socket.off(
        "message_delivered",
        handleDelivered
      );

      socket.off(
        "message_read",
        handleRead
      );

      socket.off(
        "user_typing",
        handleTyping
      );

      socket.off(
        "user_stop_typing",
        handleStopTyping
      );

      socket.off(
        "user_online",
        handleOnline
      );

      socket.off(
        "user_offline",
        handleOffline
      );
    };
  }, [userId]);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({
      behavior: "smooth",
    });
  }, [messages, isTyping]);

  const handleSend = async () => {
    if (!content.trim() || !userId) {
      return;
    }

    try {
      const newMessage =
        await sendMessage(
          userId,
          content.trim()
        );

      setMessages((prev) => [
        ...prev,
        newMessage,
      ]);

      setContent("");

      const socket = getSocket();

      socket?.emit("send_message", {
        ...newMessage,
        receiver: userId,
      });

      socket?.emit("stop_typing", {
        receiverId: userId,
      });
    } catch (error) {
      console.log(
        "Send message error:",
        error
      );
    }
  };

  const handleTyping = () => {
    if (!userId) return;

    const socket = getSocket();

    socket?.emit("typing", {
      receiverId: userId,
    });

    setTimeout(() => {
      socket?.emit("stop_typing", {
        receiverId: userId,
      });
    }, 1000);
  };

  const handleMediaSent = (
  message: IMessage
) => {
  setMessages((prev) => [
    ...prev,
    message,
  ]);

  const socket = getSocket();

  socket?.emit("send_message", {
    ...message,
    receiver: userId,
  });
};

  const handleEdit = async (
    messageId: string,
    oldContent: string
  ) => {
    const newContent = window.prompt(
      "Edit message:",
      oldContent
    );

    if (
      !newContent ||
      !newContent.trim()
    ) {
      return;
    }

    try {
      const token =
        localStorage.getItem("token");

      const response = await fetch(
        `http://localhost:5000/api/messages/${messageId}`,
        {
          method: "PUT",
          headers: {
            "Content-Type":
              "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({
            content:
              newContent.trim(),
          }),
        }
      );

      if (!response.ok) {
        throw new Error(
          "Failed to edit"
        );
      }

      setMessages((prev) =>
        prev.map((message) =>
          message._id === messageId
            ? {
                ...message,
                content:
                  newContent.trim(),
              }
            : message
        )
      );
    } catch (error) {
      console.log(
        "Edit error:",
        error
      );
    }
  };

  const handleDelete = async (
    messageId: string
  ) => {
    const confirmed =
      window.confirm(
        "Delete this message?"
      );

    if (!confirmed) return;

    try {
      const token =
        localStorage.getItem("token");

      const response = await fetch(
        `http://localhost:5000/api/messages/${messageId}`,
        {
          method: "DELETE",
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (!response.ok) {
        throw new Error(
          "Failed to delete"
        );
      }

      setMessages((prev) =>
        prev.filter(
          (message) =>
            message._id !== messageId
        )
      );
    } catch (error) {
      console.log(
        "Delete error:",
        error
      );
    }
  };

  return (
    <div className="h-screen bg-[#050805] text-white flex flex-col">
      <ChatHeader
        name={receiverName}
        isOnline={isOnline}
        onBack={() => navigate("/")}
      />

      <main className="flex-1 overflow-y-auto px-4 py-5">
        <div className="max-w-4xl mx-auto">
          {messages.map(
            (message) => (
              <MessageBubble
                key={message._id}
                message={message}
                currentUserId={
                  currentUserId
                }
                onEdit={
                  handleEdit
                }
                onDelete={
                  handleDelete
                }
              />
            )
          )}

          {isTyping && (
            <TypingIndicator />
          )}

          <div ref={bottomRef} />
        </div>
      </main>

      <MessageInput
  value={content}
  setValue={setContent}
  onSend={handleSend}
  onTyping={handleTyping}
  receiverId={userId}
  onMediaSent={handleMediaSent}
/>
    </div>
  );
}

export default Chat;