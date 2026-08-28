import EmojiPicker from "emoji-picker-react";

interface Props {
  onSelect: (emoji: string) => void;
}

function EmojiPickerBox({ onSelect }: Props) {
  return (
    <EmojiPicker
      onEmojiClick={(emojiData) =>
        onSelect(emojiData.emoji)
      }
      theme={"dark" as any}
    />
  );
}

export default EmojiPickerBox;