interface EmojiPickerProps {
  onSelect: (emoji: string) => void;
}

const emojis = [
  "😀",
  "😂",
  "😍",
  "🥰",
  "😎",
  "😭",
  "😡",
  "👍",
  "👎",
  "❤️",
  "🔥",
  "🎉",
  "🎂",
  "💯",
  "🙏",
  "😊",
];

function EmojiPicker({
  onSelect,
}: EmojiPickerProps) {
  return (
    <div className="absolute bottom-14 left-0 z-30 w-64 rounded-2xl border border-[#263B2A] bg-[#0B120D] p-3 shadow-2xl">
      <div className="grid grid-cols-8 gap-2">
        {emojis.map((emoji) => (
          <button
            key={emoji}
            onClick={() => onSelect(emoji)}
            className="text-xl hover:scale-125 transition"
          >
            {emoji}
          </button>
        ))}
      </div>
    </div>
  );
}

export default EmojiPicker;