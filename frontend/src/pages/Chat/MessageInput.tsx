


import { useRef, useState } from "react";
import { uploadFile } from "../../service/uploadService";
import { sendMediaMessage } from "../../service/messageService";
import { useNavigate } from "react-router-dom";

interface Props {
  value: string;
  setValue: (value: string) => void;
  onSend: () => void;
  onTyping: () => void;
  receiverId?: string; //  yahan ? add kar diya, ab jahan missing hoga wahan error nahi aayega
  onMediaSent?: (message: any) => void;
}

function MessageInput({
  value,
  setValue,
  onSend,
  onTyping,
  receiverId,
  onMediaSent,
}: Props) {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [showEmoji, setShowEmoji] = useState(false);
  const [uploading, setUploading] = useState(false);
  const navigate = useNavigate();

  const emojis = ["😀", "😂", "😍", "🥹", "😎", "❤️", "🔥", "👍", "🎉", "😭"];

  const addEmoji = (emoji: string) => {
    setValue(value + emoji);
    setShowEmoji(false);
  };

  const handleFileChange = async (
    e: React.ChangeEvent<HTMLInputElement>
  ) => {
    const file = e.target.files?.[0];

    if (!file || !receiverId) return;

    try {
      setUploading(true);

      const uploaded = await uploadFile(file);

      const messageType = file.type.startsWith("image/")
        ? "image"
        : "file";

      const message = await sendMediaMessage(
        receiverId,
        messageType,
        uploaded.fileUrl,
        file.name
      );

      onMediaSent?.(message);
    } catch (error) {
      console.log("File upload error:", error);
    } finally {
      setUploading(false);

      if (fileInputRef.current) {
        fileInputRef.current.value = "";
      }
    }
  };

  return (
    <div className="relative border-t border-[#18291D] bg-[#080D09] p-3">
      {showEmoji && (
        <div className="absolute bottom-20 left-4 w-72 rounded-2xl border border-[#263B2A] bg-[#0B120D] p-3 shadow-2xl">
          <div className="grid grid-cols-5 gap-2">
            {emojis.map((emoji) => (
              <button
                key={emoji}
                type="button"
                onClick={() => addEmoji(emoji)}
                className="rounded-lg p-2 text-xl hover:bg-[#17221A]"
              >
                {emoji}
              </button>
            ))}

    
          </div>
        </div>
      )}

      <div className="mx-auto flex max-w-4xl items-center gap-2">
        {/* Emoji Button */}
        <button
          type="button"
          onClick={() => setShowEmoji(!showEmoji)}
          className="rounded-xl border border-[#263B2A] px-3 py-3 text-xl hover:bg-[#0E180F]"
        >
          😊
        </button>


        {/* Hidden File Input */}
        <input
          ref={fileInputRef}
          type="file"
          className="hidden"
          accept="image/*,.pdf,.doc,.docx,.txt"
          onChange={handleFileChange}
        />

        {/* Attachment Button */}
        <button
          type="button"
          disabled={uploading}
          onClick={() => fileInputRef.current?.click()}
          className="rounded-xl border border-[#263B2A] px-3 py-3 text-[#39FF88] hover:bg-[#0E180F] disabled:opacity-50"
        >
          {uploading ? "⌛" : "📎"}
        </button>

        
       <button
  type="button"
  onClick={() =>
    navigate("/cards", {
      state: {
        receiverId,
      },
    })
  }
  className="rounded-xl border border-[#263B2A] px-3 py-3 hover:bg-[#0E180F]"
>
  🎁
</button>

        {/* Text Input */}
        <input
          type="text"
          value={value}
          disabled={uploading}
          placeholder={uploading ? "Uploading..." : "Type a message..."}
          onChange={(e) => {
            setValue(e.target.value);
            onTyping();
          }}
          onKeyDown={(e) => {
            if (e.key === "Enter") {
              onSend();
            }
          }}
          className="flex-1 rounded-xl border border-[#263B2A] bg-[#0B120D] px-4 py-3 text-white outline-none placeholder:text-[#526057] focus:border-[#39FF88]"
        />

        {/* Send Button */}
        <button
          type="button"
          onClick={onSend}
          disabled={!value.trim() || uploading}
          className="rounded-xl bg-gradient-to-r from-[#39FF88] to-[#C7FF4D] px-5 py-3 font-bold text-black disabled:opacity-40"
        >
          Send
        </button>
      </div>
    </div>
  );
}

export default MessageInput;