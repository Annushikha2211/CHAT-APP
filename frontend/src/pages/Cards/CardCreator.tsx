import { useState } from "react";
import CardTemplates from "./CardTemplates";
import CardPreview from "./CardPreview";
import { createCard } from "../../service/cardService";

function CardCreator() {
  const [template, setTemplate] =
    useState("birthday");

  const [title, setTitle] =
    useState("");

  const [message, setMessage] =
    useState("");

  const [receiver, setReceiver] =
    useState("");

  const [saving, setSaving] =
    useState(false);

  const [success, setSuccess] =
    useState("");

  const handleCreate = async () => {
    if (!title.trim() || !message.trim()) {
      alert(
        "Please enter title and message"
      );
      return;
    }

    try {
      setSaving(true);
      setSuccess("");

      await createCard({
        title: title.trim(),
        message: message.trim(),
        template,
        receiver:
          receiver.trim() || undefined,
      });

      setSuccess(
        "🎉 Card created successfully!"
      );
    } catch (error) {
      console.log(
        "Card creation error:",
        error
      );

      alert("Failed to create card");
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="grid gap-6 lg:grid-cols-2">
      <div className="space-y-5">
        <div>
          <label className="mb-2 block text-sm text-[#718078]">
            Choose template
          </label>

          <CardTemplates
            selected={template}
            onSelect={setTemplate}
          />
        </div>

        <input
          value={title}
          onChange={(e) =>
            setTitle(e.target.value)
          }
          placeholder="Card title..."
          className="w-full rounded-xl border border-[#263B2A] bg-[#0B120D] px-4 py-3 text-white outline-none focus:border-[#39FF88]"
        />

        <textarea
          value={message}
          onChange={(e) =>
            setMessage(e.target.value)
          }
          placeholder="Write your message..."
          rows={6}
          className="w-full resize-none rounded-xl border border-[#263B2A] bg-[#0B120D] px-4 py-3 text-white outline-none focus:border-[#39FF88]"
        />

        <input
          value={receiver}
          onChange={(e) =>
            setReceiver(e.target.value)
          }
          placeholder="Receiver user ID (optional)"
          className="w-full rounded-xl border border-[#263B2A] bg-[#0B120D] px-4 py-3 text-white outline-none focus:border-[#39FF88]"
        />

        <button
          type="button"
          onClick={handleCreate}
          disabled={saving}
          className="w-full rounded-xl bg-gradient-to-r from-[#39FF88] to-[#C7FF4D] px-5 py-3 font-bold text-black disabled:opacity-50"
        >
          {saving
            ? "Creating..."
            : "Create Card 🎁"}
        </button>

        {success && (
          <p className="text-center text-[#39FF88]">
            {success}
          </p>
        )}
      </div>

      <CardPreview
        title={title}
        message={message}
        template={template}
      />
    </div>
  );
}

export default CardCreator;