function TypingIndicator() {
  return (
    <div className="flex items-center gap-1 px-4 py-2 text-[#8A9A8D] text-sm">
      <span>typing</span>

      <span className="animate-bounce">.</span>
      <span className="animate-bounce [animation-delay:150ms]">
        .
      </span>
      <span className="animate-bounce [animation-delay:300ms]">
        .
      </span>
    </div>
  );
}

export default TypingIndicator;