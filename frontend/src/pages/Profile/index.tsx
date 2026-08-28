import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

import {
  getMyProfile,
} from "../../service/profileService";

import ProfileCard from "./ProfileCard";
import EditProfile from "./EditProfile";

function Profile() {
  const navigate = useNavigate();

  const [user, setUser] =
    useState<any>(null);

  const [editing, setEditing] =
    useState(false);

  useEffect(() => {
    getMyProfile()
      .then(setUser)
      .catch(() => navigate("/login"));
  }, [navigate]);

  if (!user) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-[#050805] text-[#39FF88]">
        Loading...
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#050805] px-5 py-8 text-white">

      <button
        onClick={() => navigate("/")}
        className="mb-8 text-[#39FF88]"
      >
        ← Back
      </button>

      <div className="flex justify-center">

        {editing ? (
          <EditProfile
            user={user}
            onUpdated={(updated) => {
              setUser(updated);
              setEditing(false);
            }}
          />
        ) : (
          <ProfileCard
            user={user}
            onEdit={() =>
              setEditing(true)
            }
          />
        )}

      </div>
    </div>
  );
}

export default Profile;