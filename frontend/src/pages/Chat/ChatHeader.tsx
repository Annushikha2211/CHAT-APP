interface ChatHeaderProps {
  name: string;
  isOnline: boolean;
  onBack?: () => void;
}

function ChatHeader({
  name,
  isOnline,
  onBack,
}: ChatHeaderProps) {
  return (
    <header className="h-16 border-b border-[#1B3020] bg-[#080D09] px-4 flex items-center gap-3">
      {onBack && (
        <button
          onClick={onBack}
          className="text-[#A9B6AC] hover:text-white text-xl"
        >
          ←
        </button>
      )}

      <div className="h-10 w-10 rounded-full bg-gradient-to-br from-[#39FF88] to-[#C7FF4D] flex items-center justify-center text-black font-bold">
        {name.charAt(0).toUpperCase()}
      </div>

      <div>
        <h2 className="font-semibold text-white">
          {name}
        </h2>

        <p className="text-xs text-[#39FF88]">
          {isOnline ? "Online" : "Offline"}
        </p>
      </div>
    </header>
  );
}

export default ChatHeader;