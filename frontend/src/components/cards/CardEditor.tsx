import { useState } from "react";

interface CardEditorProps {
  type: string;
  onSend: (content: string) => void;
  onClose: () => void;
}

function CardEditor({
  type,
  onSend,
  onClose,
}: CardEditorProps) {
  const [message, setMessage] = useState("");

  const titles: Record<string, string> = {
    birthday: "🎂 Happy Birthday!",
    congratulations: "🎉 Congratulations!",
    thankyou: "💐 Thank You!",
    goodluck: "🌟 Good Luck!",
    custom: "✨ Special Message",
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4">

      <div className="w-full max-w-md rounded-3xl border border-[#1B3020] bg-[#0B120D] p-6">

        <h2 className="text-xl font-bold text-white">
          {titles[type]}
        </h2>

        <div className="my-5 rounded-2xl bg-gradient-to-br from-[#39FF88] to-[#C7FF4D] p-6 text-center text-black">

          <div className="text-4xl">
            🎁
          </div>

          <h3 className="mt-3 text-xl font-black">
            {titles[type]}
          </h3>

          <p className="mt-3 min-h-10">
            {message || "Write your message..."}
          </p>
        </div>

        <textarea
          value={message}
          onChange={(e) =>
            setMessage(e.target.value)
          }
          placeholder="Write something special..."
          className="h-28 w-full resize-none rounded-xl border border-[#1B3020] bg-[#070C08] p-4 text-white outline-none focus:border-[#39FF88]"
        />

        <div className="mt-4 flex gap-3">
          <button
            onClick={onClose}
            className="flex-1 rounded-xl border border-[#263B2A] py-3 text-[#A9B6AC]"
          >
            Cancel
          </button>

          <button
            onClick={() => {
              if (!message.trim()) return;

              onSend(
                `${titles[type]}\n${message.trim()}`
              );
            }}
            className="flex-1 rounded-xl bg-gradient-to-r from-[#39FF88] to-[#C7FF4D] py-3 font-bold text-black"
          >
            Send Card
          </button>
        </div>
      </div>
    </div>
  );
}

export default CardEditor;