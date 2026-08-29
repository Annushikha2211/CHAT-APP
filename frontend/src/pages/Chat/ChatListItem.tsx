import { useNavigate } from "react-router-dom";

interface ChatListItemProps {
  chat: {
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
  };
}

function ChatListItem({ chat }: ChatListItemProps) {
  const navigate = useNavigate();

  const user = chat.user;

  return (
    <button
      type="button"
      onClick={() => navigate(`/chat/${user._id}`)}
      className="flex w-full items-center gap-4 border-b border-[#18291D] p-4 text-left transition last:border-b-0 hover:bg-[#0E180F]"
    >
      {/* Avatar */}
      <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-gradient-to-br from-[#39FF88] to-[#C7FF4D] font-bold text-black">
        {user.name?.charAt(0).toUpperCase()}
      </div>

      {/* User information */}
      <div className="min-w-0 flex-1">
        <div className="flex items-center justify-between gap-3">
          <h3 className="truncate font-semibold text-white">
            {user.name}
          </h3>

          {chat.unreadCount && chat.unreadCount > 0 ? (
            <span className="flex h-6 min-w-6 items-center justify-center rounded-full bg-[#39FF88] px-2 text-xs font-bold text-black">
              {chat.unreadCount}
            </span>
          ) : null}
        </div>

        {user.username && (
          <p className="truncate text-xs text-[#39FF88]">
            @{user.username}
          </p>
        )}

        <p className="mt-1 truncate text-sm text-[#718078]">
          {chat.lastMessage?.content || "Start a conversation"}
        </p>
      </div>

      {/* Arrow */}
      <span className="text-xl text-[#506056]">→</span>
    </button>
  );
}

export default ChatListItem;