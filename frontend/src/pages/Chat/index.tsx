import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";

import {
  getMessages,
  sendMessage,
} from "../../service/messageService";

import socket from "../../service/socketService";

interface IMessage {
  _id: string;
  sender: string;
  receiver: string;
  content: string;
  isRead: boolean;
  createdAt: string;
}

function Chat() {
  const { userId } = useParams<{
    userId: string;
  }>();

  const [messages, setMessages] = useState<IMessage[]>(
    []
  );

  const [content, setContent] = useState("");

  const token = localStorage.getItem("token");

  const getCurrentUserId = () => {
    if (!token) return null;

    try {
      const payload = JSON.parse(
        atob(token.split(".")[1])
      );

      return payload.userId;
    } catch {
      return null;
    }
  };

  const currentUserId = getCurrentUserId();

  /* ============================
     LOAD OLD MESSAGES
  ============================ */

  useEffect(() => {
    const fetchMessages = async () => {
      if (!userId) return;

      try {
        const data = await getMessages(userId);

        setMessages(data);
      } catch (error) {
        console.log(
          "Error fetching messages:",
          error
        );
      }
    };

    fetchMessages();
  }, [userId]);

  /* ============================
     SOCKET CONNECTION
  ============================ */

  useEffect(() => {
    if (!currentUserId) return;

    socket.connect();

    socket.emit("join", currentUserId);

    const handleReceiveMessage = (
      message: IMessage
    ) => {
      console.log(
        "📩 Received:",
        message
      );

      setMessages((prev) => [
        ...prev,
        message,
      ]);
    };

    socket.on(
      "receiveMessage",
      handleReceiveMessage
    );

    return () => {
      socket.off(
        "receiveMessage",
        handleReceiveMessage
      );

      socket.disconnect();
    };
  }, [currentUserId]);

  /* ============================
     SEND MESSAGE
  ============================ */

  const handleSendMessage = async () => {
    if (!content.trim() || !userId) return;

    try {
      const newMessage =
        await sendMessage(
          userId,
          content
        );

      /* Add message on sender screen */

      setMessages((prev) => [
        ...prev,
        newMessage,
      ]);

      /* Send realtime message */

      socket.emit(
        "sendMessage",
        newMessage
      );

      setContent("");
    } catch (error) {
      console.log(
        "Error sending message:",
        error
      );
    }
  };

  /* ============================
     UI
  ============================ */

  return (
    <div className="min-h-screen bg-[#050805] text-white">

      {/* Header */}

      <header className="border-b border-[#16251A] bg-[#080D09]">
        <div className="mx-auto flex max-w-4xl items-center gap-3 px-5 py-4">

          <div className="flex h-10 w-10 items-center justify-center rounded-full bg-gradient-to-br from-[#39FF88] to-[#C7FF4D] font-bold text-black">
            C
          </div>

          <div>
            <h1 className="font-semibold">
              Chat
            </h1>

            <p className="text-xs text-[#39FF88]">
              Online
            </p>
          </div>

        </div>
      </header>

      {/* Messages */}

      <main className="mx-auto flex max-w-4xl flex-col px-5 py-6">

        <div className="flex min-h-[65vh] flex-col gap-3 overflow-y-auto rounded-2xl border border-[#18291D] bg-[#080D09] p-5">

          {messages.length === 0 ? (
            <div className="flex flex-1 items-center justify-center text-[#718078]">
              No messages yet.
              <br />
              Start the conversation!
            </div>
          ) : (
            messages.map((message) => {

              const isMine =
                message.sender ===
                currentUserId;

              return (
                <div
                  key={message._id}
                  className={`flex ${
                    isMine
                      ? "justify-end"
                      : "justify-start"
                  }`}
                >
                  <div
                    className={`max-w-[75%] rounded-2xl px-4 py-3 ${
                      isMine
                        ? "rounded-br-md bg-gradient-to-r from-[#39FF88] to-[#C7FF4D] text-black"
                        : "rounded-bl-md border border-[#243A29] bg-[#101811] text-white"
                    }`}
                  >
                    {message.content}
                  </div>
                </div>
              );
            })
          )}

        </div>

        {/* Input */}

        <div className="mt-4 flex gap-3">

          <input
            type="text"
            value={content}
            placeholder="Type a message..."
            onChange={(e) =>
              setContent(e.target.value)
            }
            onKeyDown={(e) => {
              if (e.key === "Enter") {
                handleSendMessage();
              }
            }}
            className="flex-1 rounded-xl border border-[#1B3020] bg-[#0B120D] px-4 py-3 text-white outline-none placeholder:text-[#526057] focus:border-[#39FF88]"
          />

          <button
            onClick={handleSendMessage}
            className="rounded-xl bg-gradient-to-r from-[#39FF88] to-[#C7FF4D] px-6 font-bold text-black transition hover:scale-105"
          >
            Send
          </button>

        </div>

      </main>
    </div>
  );
}

export default Chat;