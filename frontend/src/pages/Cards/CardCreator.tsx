import { useLocation, useNavigate } from "react-router-dom";
import { useState } from "react";

import { createCard } from "../../service/cardService";
import { sendMessage } from "../../service/messageService";

function CardCreator() {
  const navigate = useNavigate();
  const location = useLocation();

  const receiverId = location.state?.receiverId;

  const [title, setTitle] = useState("");
  const [message, setMessage] = useState("");
  const [template, setTemplate] = useState("birthday");

  const [createdCard, setCreatedCard] =
    useState<any>(null);

  const [loading, setLoading] =
    useState(false);

  const [sending, setSending] =
    useState(false);

  const handleCreate = async () => {
    if (!receiverId) {
      alert(
        "Please open Cards from a chat first."
      );
      return;
    }

    if (!title.trim() || !message.trim()) {
      alert(
        "Please enter title and message."
      );
      return;
    }

    try {
      setLoading(true);

      const card = await createCard({
        receiverId,
        title: title.trim(),
        message: message.trim(),
        template,
      });

      setCreatedCard(card);

      alert(
        "Card created successfully 🎉"
      );
    } catch (error) {
      console.log(
        "Card creation error:",
        error
      );

      alert(
        "Card creation failed."
      );
    } finally {
      setLoading(false);
    }
  };

  const handleSendCard = async () => {
    if (!createdCard || !receiverId) {
      return;
    }

    try {
      setSending(true);

      /*
       * For now card is sent as a special text
       * message. Later we can make a beautiful
       * real card UI inside MessageBubble.
       */

      const cardMessage =
        `🎁 ${createdCard.title}\n\n${createdCard.message}`;

      await sendMessage(
        receiverId,
        cardMessage
      );

      alert(
        "Card sent successfully 💌"
      );

      navigate(
        `/chat/${receiverId}`
      );
    } catch (error) {
      console.log(
        "Send card error:",
        error
      );

      alert(
        "Card send failed."
      );
    } finally {
      setSending(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#050805] px-4 py-8 text-white">

      <div className="mx-auto max-w-2xl">

        {/* HEADER */}

        <div className="mb-8">

          <button
            type="button"
            onClick={() => navigate(-1)}
            className="mb-4 text-[#39FF88]"
          >
            ← Back
          </button>

          <h1 className="text-3xl font-bold">
            Create a Card 🎁
          </h1>

          <p className="mt-2 text-[#718078]">
            Create a birthday or custom
            card for your friend.
          </p>

        </div>

        {/* RECEIVER */}

        <div className="mb-5 rounded-2xl border border-[#263B2A] bg-[#0B120D] p-4">

          <p className="text-sm text-[#718078]">
            Sending card to
          </p>

          <p className="mt-1 font-semibold text-[#39FF88]">

            {receiverId
              ? receiverId
              : "No receiver selected"}

          </p>

        </div>

        {/* TEMPLATE */}

        <div className="mb-5">

          <label className="mb-2 block text-sm text-[#AAB5AE]">
            Card Type
          </label>

          <select
            value={template}
            onChange={(e) =>
              setTemplate(e.target.value)
            }
            className="w-full rounded-xl border border-[#263B2A] bg-[#0B120D] px-4 py-3 text-white outline-none"
          >

            <option value="birthday">
              🎂 Birthday
            </option>

            <option value="custom">
              💚 Custom
            </option>

            <option value="congratulations">
              🎉 Congratulations
            </option>

            <option value="thankyou">
              ❤️ Thank You
            </option>

          </select>

        </div>

        {/* TITLE */}

        <div className="mb-5">

          <label className="mb-2 block text-sm text-[#AAB5AE]">
            Title
          </label>

          <input
            type="text"
            value={title}
            onChange={(e) =>
              setTitle(e.target.value)
            }
            placeholder="Happy Birthday 🎂"
            className="w-full rounded-xl border border-[#263B2A] bg-[#0B120D] px-4 py-3 text-white outline-none focus:border-[#39FF88]"
          />

        </div>

        {/* MESSAGE */}

        <div className="mb-5">

          <label className="mb-2 block text-sm text-[#AAB5AE]">
            Message
          </label>

          <textarea
            value={message}
            onChange={(e) =>
              setMessage(e.target.value)
            }
            placeholder="Write your message..."
            rows={6}
            className="w-full resize-none rounded-xl border border-[#263B2A] bg-[#0B120D] px-4 py-3 text-white outline-none focus:border-[#39FF88]"
          />

        </div>

        {/* CREATE BUTTON */}

        <button
          type="button"
          onClick={handleCreate}
          disabled={loading}
          className="w-full rounded-xl bg-gradient-to-r from-[#39FF88] to-[#C7FF4D] px-5 py-4 font-bold text-black disabled:opacity-50"
        >

          {loading
            ? "Creating..."
            : "🎁 Create Card"}

        </button>

        {/* CREATED CARD */}

        {createdCard && (

          <div className="mt-6 rounded-2xl border border-[#39FF88] bg-[#0B120D] p-5">

            <h2 className="text-xl font-bold text-[#39FF88]">
              🎉 Card Created!
            </h2>

            <div className="mt-4 rounded-xl bg-[#111A13] p-4">

              <p className="text-lg font-bold">
                {createdCard.title}
              </p>

              <p className="mt-2 whitespace-pre-wrap text-[#AAB5AE]">
                {createdCard.message}
              </p>

            </div>

            {/* SEND CARD */}

            <button
              type="button"
              onClick={handleSendCard}
              disabled={sending}
              className="mt-4 w-full rounded-xl border border-[#39FF88] px-5 py-3 font-semibold text-[#39FF88] hover:bg-[#102015] disabled:opacity-50"
            >

              {sending
                ? "Sending..."
                : "💌 Send to Chat"}

            </button>

          </div>

        )}

      </div>

    </div>
  );
}

export default CardCreator;

