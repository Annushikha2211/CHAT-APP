interface MessageActionsProps {
  onEdit: () => void;
  onDelete: () => void;
  onClose: () => void;
}

function MessageActions({
  onEdit,
  onDelete,
  onClose,
}: MessageActionsProps) {
  return (
    <div className="absolute right-0 top-8 z-20 w-36 rounded-xl border border-[#263B2A] bg-[#0B120D] shadow-xl overflow-hidden">
      <button
        onClick={onEdit}
        className="w-full px-4 py-2 text-left text-sm hover:bg-[#17221A]"
      >
        ✏️ Edit
      </button>

      <button
        onClick={onDelete}
        className="w-full px-4 py-2 text-left text-sm text-red-400 hover:bg-[#17221A]"
      >
        🗑️ Delete
      </button>

      <button
        onClick={onClose}
        className="w-full px-4 py-2 text-left text-sm hover:bg-[#17221A]"
      >
        Cancel
      </button>
    </div>
  );
}

export default MessageActions;