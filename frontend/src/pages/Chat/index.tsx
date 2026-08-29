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

import { getUserById } from "../../service/userService";

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

interface Receiver {
  _id: string;
  name: string;
  username?: string;
  email?: string;
  profileImage?: string;
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

  const [receiverUsername, setReceiverUsername] =
    useState("");

  const bottomRef =
    useRef<HTMLDivElement>(null);

  // =========================================
  // CURRENT USER
  // =========================================

  const token =
    localStorage.getItem("token");

  let currentUserId = "";

  if (token) {
    try {
      const decoded =
        jwtDecode<JwtPayload>(token);

      currentUserId =
        decoded.userId;
    } catch {
      localStorage.removeItem("token");
      navigate("/login");
    }
  }

  // =========================================
  // FETCH RECEIVER + MESSAGES + SOCKET
  // =========================================

  useEffect(() => {
    if (!userId) return;

    const socket = connectSocket();

    // =========================================
    // FETCH RECEIVER
    // =========================================

    const fetchReceiver = async () => {
      try {
        const user: Receiver =
          await getUserById(userId);

        console.log(
          "RECEIVER USER:",
          user
        );

        // IMPORTANT:
        // Chat ki jagah username show hoga.
        // Agar username nahi hai to name show hoga.

        setReceiverName(
          user.username ||
            user.name ||
            "User"
        );

        setReceiverUsername(
          user.username || ""
        );
      } catch (error) {
        console.log(
          "Fetch receiver error:",
          error
        );

        setReceiverName("User");
        setReceiverUsername("");
      }
    };

    // =========================================
    // FETCH MESSAGES
    // =========================================

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

    fetchReceiver();
    fetchMessages();

    if (!socket) return;

    // =========================================
    // NEW MESSAGE
    // =========================================

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

        socket.emit(
          "message_read",
          {
            messageId:
              message._id,

            senderId:
              message.sender,
          }
        );
      }
    };

    // =========================================
    // DELIVERED
    // =========================================

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

    // =========================================
    // READ
    // =========================================

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

    // =========================================
    // TYPING
    // =========================================

    const handleTyping = ({
      userId: typingUser,
    }: {
      userId: string;
    }) => {
      if (
        typingUser === userId
      ) {
        setIsTyping(true);
      }
    };

    // =========================================
    // STOP TYPING
    // =========================================

    const handleStopTyping = ({
      userId: typingUser,
    }: {
      userId: string;
    }) => {
      if (
        typingUser === userId
      ) {
        setIsTyping(false);
      }
    };

    // =========================================
    // ONLINE
    // =========================================

    const handleOnline = (
      onlineUserId: string
    ) => {
      if (
        onlineUserId === userId
      ) {
        setIsOnline(true);
      }
    };

    // =========================================
    // OFFLINE
    // =========================================

    const handleOffline = (
      offlineUserId: string
    ) => {
      if (
        offlineUserId === userId
      ) {
        setIsOnline(false);
      }
    };

    // =========================================
    // CURRENT ONLINE USERS
    // =========================================

    const handleOnlineUsers = (
      onlineUsers: string[]
    ) => {
      if (
        onlineUsers.includes(userId)
      ) {
        setIsOnline(true);
      } else {
        setIsOnline(false);
      }
    };

    // =========================================
    // INCOMING CALL
    // =========================================

    const handleIncomingCall = ({
      callerId,
      offer,
      callType,
    }: {
      callerId: string;
      offer: RTCSessionDescriptionInit;
      callType: "voice" | "video";
    }) => {
    

      navigate(
        `/call/${callerId}?type=${callType}`,
        {
          state: {
            incoming: true,
            offer,
            callerId,
            callType,
          },
        }
      );
    };

    // =========================================
    // SOCKET EVENTS
    // =========================================

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

    socket.on(
      "online_users",
      handleOnlineUsers
    );

    socket.on(
      "incoming_call",
      handleIncomingCall
    );

    // =========================================
    // CLEANUP
    // =========================================

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

      socket.off(
        "online_users",
        handleOnlineUsers
      );

      socket.off(
        "incoming_call",
        handleIncomingCall
      );
    };
  }, [userId, navigate]);

  // =========================================
  // AUTO SCROLL
  // =========================================

  useEffect(() => {
    bottomRef.current?.scrollIntoView({
      behavior: "smooth",
    });
  }, [messages, isTyping]);

  // =========================================
  // SEND TEXT
  // =========================================

  const handleSend =
    async () => {
      if (
        !content.trim() ||
        !userId
      ) {
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

        const socket =
          getSocket();

        socket?.emit(
          "send_message",
          {
            ...newMessage,
            receiver: userId,
          }
        );

        socket?.emit(
          "stop_typing",
          {
            receiverId: userId,
          }
        );
      } catch (error) {
        console.log(
          "Send message error:",
          error
        );
      }
    };

  // =========================================
  // TYPING
  // =========================================

  const handleTyping =
    () => {
      if (!userId) return;

      const socket =
        getSocket();

      socket?.emit(
        "typing",
        {
          receiverId: userId,
        }
      );

      setTimeout(() => {
        socket?.emit(
          "stop_typing",
          {
            receiverId: userId,
          }
        );
      }, 1000);
    };

  // =========================================
  // MEDIA
  // =========================================

  const handleMediaSent = (
    message: IMessage
  ) => {
    setMessages((prev) => [
      ...prev,
      message,
    ]);

    const socket =
      getSocket();

    socket?.emit(
      "send_message",
      {
        ...message,
        receiver: userId,
      }
    );
  };

  // =========================================
  // EDIT
  // =========================================

  const handleEdit = async (
    messageId: string,
    oldContent: string
  ) => {
    const newContent =
      window.prompt(
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
      const apiUrl =
        import.meta.env.VITE_BASE_URL ||
        "http://localhost:5000/api";

      const response =
        await fetch(
          `${apiUrl}/messages/${messageId}`,
          {
            method: "PUT",

            headers: {
              "Content-Type":
                "application/json",

              Authorization:
                `Bearer ${token}`,
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

  // =========================================
  // DELETE
  // =========================================

  const handleDelete =
    async (
      messageId: string
    ) => {
      const confirmed =
        window.confirm(
          "Delete this message?"
        );

      if (!confirmed) return;

      try {
        const apiUrl =
          import.meta.env.VITE_BASE_URL ||
          "http://localhost:5000/api";

        const response =
          await fetch(
            `${apiUrl}/messages/${messageId}`,
            {
              method: "DELETE",

              headers: {
                Authorization:
                  `Bearer ${token}`,
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
              message._id !==
              messageId
          )
        );
      } catch (error) {
        console.log(
          "Delete error:",
          error
        );
      }
    };

  // =========================================
  // UNIQUE FEATURE
  // =========================================

  const getConversationEnergy =
    () => {
      if (
        messages.length >= 30
      ) {
        return "🔥 HIGH ENERGY";
      }

      if (
        messages.length >= 10
      ) {
        return "😊 ACTIVE";
      }

      if (
        messages.length >= 3
      ) {
        return "😐 NORMAL";
      }

      return "🥶 QUIET";
    };

  // =========================================
  // UI
  // =========================================

  return (
    <div className="flex h-screen flex-col bg-[#050805] text-white">

      {/* HEADER */}

      <div className="border-b border-[#18291D]">

        <ChatHeader
          name={receiverName}
          isOnline={isOnline}
          onBack={() =>
            navigate("/")
          }
        />

        {/* USERNAME + CARD + CALL */}

        <div className="flex items-center justify-between border-b border-[#18291D] bg-[#080D09] px-3 py-2 sm:px-4">

          {/* LEFT */}

          <div className="min-w-0">

            {receiverUsername && (
              <p className="truncate text-xs text-[#39FF88]">
                @{receiverUsername}
              </p>
            )}

            <p className="text-xs text-[#718078]">
              {getConversationEnergy()}
            </p>

          </div>

          {/* RIGHT */}

          <div className="flex shrink-0 items-center gap-2">

            {/* CARD */}

            <button
              type="button"
              onClick={() =>
                navigate(
                  "/cards",
                  {
                    state: {
                      receiverId:
                        userId,
                    },
                  }
                )
              }
              className="rounded-xl border border-[#263B2A] px-3 py-2 text-lg hover:bg-[#0E180F]"
              title="Create card"
            >
              🎁
            </button>

          </div>
        </div>
      </div>

      {/* MESSAGES */}

      <main className="flex-1 overflow-y-auto px-2 py-3 sm:px-4 sm:py-5">

        <div className="mx-auto max-w-4xl">

          {messages.map(
            (message) => (
              <MessageBubble
                key={
                  message._id
                }
                message={
                  message
                }
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

          <div
            ref={bottomRef}
          />

        </div>
      </main>

      {/* MESSAGE INPUT */}

      <MessageInput
        value={content}
        setValue={setContent}
        onSend={handleSend}
        onTyping={handleTyping}
        receiverId={userId}
        onMediaSent={
          handleMediaSent
        }
      />

    </div>
  );
}

export default Chat;