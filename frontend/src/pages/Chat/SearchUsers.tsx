import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { searchUsers } from "../../service/userService";

function SearchUsers() {
  const navigate = useNavigate();

  const [query, setQuery] =
    useState("");

  const [users, setUsers] =
    useState<any[]>([]);

  const handleSearch = async (
    value: string
  ) => {
    setQuery(value);

    if (!value.trim()) {
      setUsers([]);
      return;
    }

    try {
      const data =
        await searchUsers(value);

      setUsers(data);
    } catch (error) {
      console.log(
        "Search error:",
        error
      );
    }
  };

  return (
    <div className="w-full max-w-2xl">

      <input
        value={query}
        onChange={(e) =>
          handleSearch(e.target.value)
        }
        placeholder="Search by name or @username..."
        className="w-full rounded-2xl border border-[#263B2A] bg-[#0B120D] px-5 py-4 text-white outline-none focus:border-[#39FF88]"
      />

      <div className="mt-4 space-y-3">

        {users.map((user) => (
          <button
            key={user._id}
            onClick={() =>
              navigate(
                `/chat/${user._id}`
              )
            }
            className="flex w-full items-center gap-4 rounded-2xl border border-[#18291D] bg-[#0B120D] p-4 text-left hover:border-[#39FF88]/50"
          >
            <div className="flex h-12 w-12 items-center justify-center rounded-full bg-gradient-to-br from-[#39FF88] to-[#C7FF4D] font-bold text-black">
              {user.name
                ?.charAt(0)
                .toUpperCase()}
            </div>

            <div>
              <h3 className="font-semibold">
                {user.name}
              </h3>

              {user.username && (
                <p className="text-sm text-[#39FF88]">
                  @{user.username}
                </p>
              )}

              <p className="text-xs text-[#718078]">
                {user.email}
              </p>
            </div>
          </button>
        ))}

      </div>
    </div>
  );
}

export default SearchUsers;