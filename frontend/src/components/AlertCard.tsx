interface AlertCardProps {
  type: "success" | "error" | "info";
  message: string;
  onClose: () => void;
}

function AlertCard({
  type,
  message,
  onClose,
}: AlertCardProps) {
  const styles = {
    success: {
      border: "border-[#39FF88]/30",
      bg: "bg-[#0B1A10]",
      icon: "✓",
      iconBg: "bg-[#39FF88]/15",
      iconText: "text-[#39FF88]",
    },

    error: {
      border: "border-red-500/30",
      bg: "bg-[#1A0B0B]",
      icon: "!",
      iconBg: "bg-red-500/15",
      iconText: "text-red-400",
    },

    info: {
      border: "border-blue-500/30",
      bg: "bg-[#0B111A]",
      icon: "i",
      iconBg: "bg-blue-500/15",
      iconText: "text-blue-400",
    },
  };

  const style = styles[type];

  return (
    <div
      className={`fixed top-5 right-5 z-50 w-[350px] rounded-2xl border ${style.border} ${style.bg} p-4 shadow-2xl backdrop-blur-xl`}
    >
      <div className="flex items-start gap-3">

        <div
          className={`h-9 w-9 shrink-0 rounded-full ${style.iconBg} ${style.iconText} flex items-center justify-center font-bold`}
        >
          {style.icon}
        </div>

        <div className="flex-1">
          <p className="text-sm text-[#E8EEE9]">
            {message}
          </p>
        </div>

        <button
          onClick={onClose}
          className="text-[#66756A] hover:text-white transition"
        >
          ×
        </button>

      </div>
    </div>
  );
}

export default AlertCard;