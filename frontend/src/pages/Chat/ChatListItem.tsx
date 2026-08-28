import { useEffect, useState } from "react";
import { getChatList } from "../../service/chatService";
import ChatListItem from "./ChatListItem";

function ChatList() {
  const [chats, setChats] = useState<any[]>([]);
  const [loading, setLoading] =
    useState(true);

  const loadChats = async () => {
    try {
      const data = await getChatList();
      setChats(data);
    } catch (error) {
      console.log(
        "Chat list error:",
        error
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadChats();
  }, []);

  if (loading) {
    return (
      <div className="p-6 text-center text-[#718078]">
        Loading chats...
      </div>
    );
  }

  if (chats.length === 0) {
    return (
      <div className="p-6 text-center text-[#718078]">
        No chats yet.
      </div>
    );
  }

  return (
    <div className="overflow-hidden rounded-2xl border border-[#18291D] bg-[#080D09]">
      {chats.map((chat) => (
        <ChatListItem
          key={chat.user._id}
        //   chat={chat}
        />
      ))}
    </div>
  );
}

export default ChatList;