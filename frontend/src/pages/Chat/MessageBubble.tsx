interface IMessage {
  _id: string;
  sender: string;
  receiver: string;
  content: string;
  messageType: "text" | "image" | "file";
  fileUrl?: string;
  isRead: boolean;
  isDelivered: boolean;
  createdAt: string;
}

interface Props {
  message: IMessage;
  currentUserId: string;
  onEdit: (id: string, content: string) => void;
  onDelete: (id: string) => void;
}

function MessageBubble({
  message,
  currentUserId,
  onEdit,
  onDelete,
}: Props) {
  const isMine = message.sender === currentUserId;

  return (
    <div
      className={`mb-3 flex ${
        isMine ? "justify-end" : "justify-start"
      }`}
    >
      <div
        className={`group relative max-w-[75%] rounded-2xl px-4 py-2 shadow-md ${
          isMine
            ? "rounded-br-md bg-[#39FF88] text-black"
            : "rounded-bl-md bg-[#17221A] text-white"
        }`}
      >
        {/* Edit/Delete */}
        {isMine && (
          <div className="mb-1 hidden justify-end gap-2 text-xs group-hover:flex">
            <button
              onClick={() =>
                onEdit(message._id, message.content)
              }
              className="opacity-60 hover:opacity-100"
            >
              Edit
            </button>

            <button
              onClick={() => onDelete(message._id)}
              className="text-red-700 opacity-60 hover:opacity-100"
            >
              Delete
            </button>
          </div>
        )}

        {/* Content */}
        {message.messageType === "image" &&
message.fileUrl ? (
  <img
    src={`http://localhost:5000${message.fileUrl}`}
    alt="sent image"
    className="max-w-[280px] rounded-xl"
  />
) : message.messageType === "file" &&
message.fileUrl ? (
  <a
    href={`http://localhost:5000${message.fileUrl}`}
    target="_blank"
    rel="noopener noreferrer"
    className="underline"
  >
    📎 {message.content || "Open file"}
  </a>
) : (
  <p>{message.content}</p>
)}

        {/* Time + status */}
        <div
          className={`mt-1 flex items-center justify-end gap-1 text-[10px] ${
            isMine ? "text-black/60" : "text-white/50"
          }`}
        >
          <span>
            {new Date(message.createdAt).toLocaleTimeString([], {
              hour: "2-digit",
              minute: "2-digit",
            })}
          </span>

          {isMine && (
            <>
              {message.isRead ? (
                <span className="font-bold text-blue-600">
                  ✓✓
                </span>
              ) : message.isDelivered ? (
                <span className="font-bold text-black/70">
                  ✓✓
                </span>
              ) : (
                <span className="text-black/60">
                  ✓
                </span>
              )}
            </>
          )}
        </div>
      </div>
    </div>
  );
}

export default MessageBubble;