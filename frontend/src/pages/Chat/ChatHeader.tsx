import { useNavigate, useParams } from "react-router-dom";

interface Props {
  name: string;
  isOnline: boolean;
  onBack: () => void;
}

function ChatHeader({
  name,
  isOnline,
  onBack,
}: Props) {
  const navigate = useNavigate();
  const { userId } = useParams();

  return (
    <header className="flex items-center justify-between border-b border-[#18291D] bg-[#080D09] px-4 py-3">

      {/* LEFT */}
      <div className="flex items-center gap-3">

        <button
          onClick={onBack}
          className="text-xl text-white hover:text-[#39FF88]"
        >
          ←
        </button>

        <div className="flex h-11 w-11 items-center justify-center rounded-full bg-gradient-to-br from-[#39FF88] to-[#C7FF4D] font-bold text-black">
          {name.charAt(0).toUpperCase()}
        </div>

        <div>
          <h2 className="font-semibold text-white">
            {name}
          </h2>

          <p
            className={`text-xs ${
              isOnline
                ? "text-[#39FF88]"
                : "text-gray-500"
            }`}
          >
            {isOnline ? "Online" : "Offline"}
          </p>
        </div>

      </div>

      {/* CALL BUTTONS */}
      <div className="flex items-center gap-2">

        <button
          type="button"
          onClick={() =>
            navigate(`/call/${userId}?type=voice`)
          }
          className="rounded-xl border border-[#263B2A] px-3 py-2 text-lg hover:bg-[#0E180F]"
          title="Voice call"
        >
          📞
        </button>

        <button
          type="button"
          onClick={() =>
            navigate(`/call/${userId}?type=video`)
          }
          className="rounded-xl border border-[#263B2A] px-3 py-2 text-lg hover:bg-[#0E180F]"
          title="Video call"
        >
          📹
        </button>

      </div>

    </header>
  );
}

export default ChatHeader;