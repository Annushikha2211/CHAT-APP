import { useState } from "react";
import { updateProfile } from "../../service/profileService";

interface Props {
  user: any;
  onUpdated: (user: any) => void;
}

function EditProfile({
  user,
  onUpdated,
}: Props) {
  const [name, setName] =
    useState(user.name || "");

  const [username, setUsername] =
    useState(user.username || "");

  const [bio, setBio] =
    useState(user.bio || "");

  const [loading, setLoading] =
    useState(false);

  const handleSubmit = async (
    e: React.FormEvent
  ) => {
    e.preventDefault();

    try {
      setLoading(true);

      const updated =
        await updateProfile({
          name,
          username,
          bio,
        });

      onUpdated(updated);
    } catch (error: any) {
      alert(
        error.response?.data?.message ||
          "Profile update failed"
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="w-full max-w-md space-y-4 rounded-3xl border border-[#1B3020] bg-[#0B120D] p-6"
    >
      <input
        value={name}
        onChange={(e) =>
          setName(e.target.value)
        }
        placeholder="Name"
        className="w-full rounded-xl border border-[#263B2A] bg-[#070C08] px-4 py-3 text-white outline-none focus:border-[#39FF88]"
      />

      <input
        value={username}
        onChange={(e) =>
          setUsername(e.target.value)
        }
        placeholder="Username"
        className="w-full rounded-xl border border-[#263B2A] bg-[#070C08] px-4 py-3 text-white outline-none focus:border-[#39FF88]"
      />

      <textarea
        value={bio}
        onChange={(e) =>
          setBio(e.target.value)
        }
        placeholder="Tell something about yourself..."
        rows={4}
        className="w-full resize-none rounded-xl border border-[#263B2A] bg-[#070C08] px-4 py-3 text-white outline-none focus:border-[#39FF88]"
      />

      <button
        disabled={loading}
        className="w-full rounded-xl bg-gradient-to-r from-[#39FF88] to-[#C7FF4D] py-3 font-bold text-black disabled:opacity-50"
      >
        {loading
          ? "Saving..."
          : "Save Changes"}
      </button>
    </form>
  );
}

export default EditProfile;