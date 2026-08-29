interface IMessage {
  _id: string;
  sender: string;
  receiver: string;
  content: string;

  messageType:
    | "text"
    | "image"
    | "file";

  fileUrl?: string;

  isRead: boolean;
  isDelivered: boolean;

  createdAt: string;
}

interface Props {
  message: IMessage;

  currentUserId: string;

  onEdit: (
    messageId: string,
    content: string
  ) => void;

  onDelete: (
    messageId: string
  ) => void;
}

function MessageBubble({
  message,
  currentUserId,
  onEdit,
  onDelete,
}: Props) {

  const isMine =
    message.sender ===
    currentUserId;

  return (
    <div
      className={`mb-3 flex ${
        isMine
          ? "justify-end"
          : "justify-start"
      }`}
    >

      {/* MESSAGE BUBBLE */}

      <div
        className={`max-w-[85%] sm:max-w-[75%] rounded-2xl px-3 py-2 sm:px-4 ${
          isMine
            ? "rounded-br-md bg-[#39FF88] text-black"
            : "rounded-bl-md bg-[#17221A] text-white"
        }`}
      >

        {/* IMAGE */}

        {message.messageType ===
          "image" &&
        message.fileUrl ? (

          <img
            src={message.fileUrl}
            alt="sent media"
            className="max-h-80 max-w-full rounded-xl object-cover"
          />

        ) : message.messageType ===
            "file" &&
          message.fileUrl ? (

          /* FILE */

          <a
            href={message.fileUrl}
            target="_blank"
            rel="noopener noreferrer"
            className={`flex items-center gap-3 rounded-xl p-3 ${
              isMine
                ? "bg-black/10"
                : "bg-black/20"
            }`}
          >

            <span className="text-2xl">
              📎
            </span>

            <span className="break-all text-sm underline">
              {message.content ||
                "Open file"}
            </span>

          </a>

        ) : (

          /* TEXT */

          <p className="whitespace-pre-wrap break-words text-sm sm:text-base">
            {message.content}
          </p>

        )}

        {/* BOTTOM ROW */}

        <div
          className={`mt-1 flex items-center justify-end gap-1 text-[10px] sm:text-xs ${
            isMine
              ? "text-black/70"
              : "text-white/50"
          }`}
        >

          {/* EDIT */}

          {isMine &&
            message.messageType ===
              "text" && (

              <button
                type="button"
                onClick={() =>
                  onEdit(
                    message._id,
                    message.content
                  )
                }
                className="mr-2 opacity-70 hover:opacity-100"
                title="Edit"
              >
                ✏️
              </button>

            )}

          {/* DELETE */}

          {isMine && (

            <button
              type="button"
              onClick={() =>
                onDelete(
                  message._id
                )
              }
              className="mr-2 opacity-70 hover:opacity-100"
              title="Delete"
            >
              🗑️
            </button>

          )}

          {/* TIME */}

          <span>
            {new Date(
              message.createdAt
            ).toLocaleTimeString(
              [],
              {
                hour: "2-digit",
                minute: "2-digit",
              }
            )}
          </span>

          {/* TICKS */}

          {isMine && (

            <>
              {message.isRead ? (

                /* READ */

                <span className="font-bold text-blue-600">
                  ✓✓
                </span>

              ) : message.isDelivered ? (

                /* DELIVERED */

                <span className="font-bold text-black/70">
                  ✓✓
                </span>

              ) : (

                /* SENT */

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