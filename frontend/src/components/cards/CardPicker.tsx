interface CardPickerProps {
  onSelect: (type: string) => void;
  onClose: () => void;
}

function CardPicker({
  onSelect,
  onClose,
}: CardPickerProps) {
  const cards = [
    {
      type: "birthday",
      emoji: "🎂",
      title: "Birthday",
    },
    {
      type: "congratulations",
      emoji: "🎉",
      title: "Congratulations",
    },
    {
      type: "thankyou",
      emoji: "💐",
      title: "Thank You",
    },
    {
      type: "goodluck",
      emoji: "🌟",
      title: "Good Luck",
    },
    {
      type: "custom",
      emoji: "✨",
      title: "Custom",
    },
  ];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4">
      <div className="w-full max-w-md rounded-3xl border border-[#1B3020] bg-[#0B120D] p-6">

        <div className="mb-5 flex items-center justify-between">
          <h2 className="text-xl font-bold text-white">
            Create a card
          </h2>

          <button
            onClick={onClose}
            className="text-[#8A9A8D] hover:text-white"
          >
            ✕
          </button>
        </div>

        <div className="grid grid-cols-2 gap-3">
          {cards.map((card) => (
            <button
              key={card.type}
              onClick={() => onSelect(card.type)}
              className="rounded-2xl border border-[#1B3020] bg-[#070C08] p-5 transition hover:border-[#39FF88]/50 hover:bg-[#0E180F]"
            >
              <div className="text-3xl">
                {card.emoji}
              </div>

              <p className="mt-2 text-sm font-semibold text-white">
                {card.title}
              </p>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}

export default CardPicker;