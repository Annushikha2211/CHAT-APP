interface Props {
  selected: string;
  onSelect: (template: string) => void;
}

const templates = [
  {
    id: "birthday",
    emoji: "🎂",
    name: "Birthday",
  },
  {
    id: "love",
    emoji: "❤️",
    name: "Love",
  },
  {
    id: "celebration",
    emoji: "🎉",
    name: "Celebration",
  },
  {
    id: "thankyou",
    emoji: "💙",
    name: "Thank You",
  },
  {
    id: "custom",
    emoji: "✨",
    name: "Custom",
  },
];

function CardTemplates({
  selected,
  onSelect,
}: Props) {
  return (
    <div className="grid grid-cols-2 gap-3 sm:grid-cols-5">
      {templates.map((template) => (
        <button
          key={template.id}
          type="button"
          onClick={() =>
            onSelect(template.id)
          }
          className={`rounded-2xl border p-4 ${
            selected === template.id
              ? "border-[#39FF88] bg-[#0E180F]"
              : "border-[#263B2A] bg-[#0B120D]"
          }`}
        >
          <div className="text-3xl">
            {template.emoji}
          </div>

          <div className="mt-2 text-sm">
            {template.name}
          </div>
        </button>
      ))}
    </div>
  );
}

export default CardTemplates;