import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import {
  getMessages,
  sendMessage,
} from "../../service/messageService.ts";

interface IMessage {
  _id: string;
  sender: string;
  receiver: string;
  content: string;
  isRead: boolean;
  createdAt: string;
}

function Chat() {
  const { userId } = useParams<{ userId: string }>();

  const [messages, setMessages] = useState<IMessage[]>([]);
  const [content, setContent] = useState("");

  useEffect(() => {
    const fetchMessages = async () => {
      if (!userId) return;

      try {
        const data = await getMessages(userId);
        setMessages(data);
      } catch (error) {
        console.log("Error fetching messages:", error);
      }
    };

    fetchMessages();
  }, [userId]);

  const handleSendMessage = async () => {
    if (!content.trim() || !userId) return;

    try {
      const newMessage = await sendMessage(
        userId,
        content
      );

      setMessages((prev) => [...prev, newMessage]);
      setContent("");
    } catch (error) {
      console.log("Error sending message:", error);
    }
  };

  return (
    <div>
      <h1>Chat</h1>

      <div>
        {messages.map((message) => (
          <div key={message._id}>
            {message.content}
          </div>
        ))}
      </div>

      <input
        type="text"
        value={content}
        placeholder="Type a message..."
        onChange={(e) => setContent(e.target.value)}
      />

      <button onClick={handleSendMessage}>
        Send
      </button>
    </div>
  );
}

export default Chat;