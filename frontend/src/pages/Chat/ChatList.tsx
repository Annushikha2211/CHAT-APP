import { useEffect, useState } from "react";
import { getChatList } from "../../service/chatService";
import ChatListItem from "./ChatListItem";

interface Chat {
  user: {
    _id: string;
    name: string;
    username?: string;
    email?: string;
    profileImage?: string;
  };
  lastMessage?: {
    content: string;
    createdAt: string;
  };
  unreadCount?: number;
}

function ChatList() {
  const [chats, setChats] = useState<Chat[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadChats = async () => {
      try {
        const data = await getChatList();
        setChats(data || []);
      } catch (error) {
        console.log("Chat list error:", error);
        setChats([]);
      } finally {
        setLoading(false);
      }
    };

    loadChats();
  }, []);

  if (loading) {
    return (
      <div className="mt-6 rounded-2xl border border-[#18291D] bg-[#080D09] p-6 text-center text-[#718078]">
        Loading chats...
      </div>
    );
  }

  if (chats.length === 0) {
    return (
      <div className="mt-6 rounded-2xl border border-[#18291D] bg-[#080D09] p-6 text-center">
        <p className="text-[#718078]">No chats yet.</p>
        <p className="mt-1 text-sm text-[#506056]">
          Start chatting with a friend to see conversations here.
        </p>
      </div>
    );
  }

  return (
    <div className="mt-6 overflow-hidden rounded-2xl border border-[#18291D] bg-[#080D09]">
      <div className="border-b border-[#18291D] px-5 py-4">
        <h2 className="font-semibold text-white">Your Chats</h2>
      </div>

      <div>
        {chats.map((chat) => (
          <ChatListItem
            key={chat.user._id}
            chat={chat}
          />
        ))}
      </div>
    </div>
  );
}

export default ChatList;