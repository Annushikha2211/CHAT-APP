interface Props {
  user: {
    name: string;
    username?: string;
    email: string;
    bio?: string;
    profileImage?: string;
  };
  onEdit: () => void;
}

function ProfileCard({
  user,
  onEdit,
}: Props) {
  return (
    <div className="w-full max-w-md rounded-3xl border border-[#1B3020] bg-[#0B120D] p-6 text-white shadow-xl">
      <div className="flex flex-col items-center">

        <div className="mb-4 flex h-24 w-24 items-center justify-center overflow-hidden rounded-full bg-gradient-to-br from-[#39FF88] to-[#C7FF4D] text-3xl font-black text-black">
          {user.profileImage ? (
            <img
              src={user.profileImage}
              alt="Profile"
              className="h-full w-full object-cover"
            />
          ) : (
            user.name
              ?.charAt(0)
              .toUpperCase()
          )}
        </div>

        <h1 className="text-2xl font-bold">
          {user.name}
        </h1>

        {user.username && (
          <p className="text-[#39FF88]">
            @{user.username}
          </p>
        )}

        <p className="mt-2 text-sm text-[#78877D]">
          {user.email}
        </p>

        {user.bio && (
          <p className="mt-4 text-center text-[#B8C5BA]">
            {user.bio}
          </p>
        )}

        <button
          onClick={onEdit}
          className="mt-6 rounded-xl bg-gradient-to-r from-[#39FF88] to-[#C7FF4D] px-6 py-3 font-bold text-black"
        >
          Edit Profile
        </button>
      </div>
    </div>
  );
}

export default ProfileCard;