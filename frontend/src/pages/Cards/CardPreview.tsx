interface Props {
  title: string;
  message: string;
  template: string;
}

function CardPreview({
  title,
  message,
  template,
}: Props) {
  const emojis: Record<
    string,
    string
  > = {
    birthday: "🎂",
    love: "❤️",
    celebration: "🎉",
    thankyou: "💙",
    custom: "✨",
  };

  return (
    <div className="rounded-3xl border border-[#263B2A] bg-gradient-to-br from-[#0E180F] to-[#17221A] p-8 text-center shadow-2xl">
      <div className="text-6xl">
        {emojis[template] || "✨"}
      </div>

      <h2 className="mt-5 text-2xl font-bold text-[#39FF88]">
        {title || "Your Card Title"}
      </h2>

      <p className="mt-4 whitespace-pre-wrap text-white/80">
        {message ||
          "Your message will appear here..."}
      </p>

      <div className="mt-8 text-sm text-[#718078]">
        Made with ❤️
      </div>
    </div>
  );
}

export default CardPreview;