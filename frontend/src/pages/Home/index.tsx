import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { getUsers } from "../../service/userService";
import ChatList from "../Chat/ChatListItem";
interface User {
  _id: string;
  name: string;
  email: string;
}

function Home() {
  const navigate = useNavigate();

  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const data = await getUsers();
        setUsers(data);
      } catch (error) {
        console.log("Error fetching users:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchUsers();
  }, []);

  const handleLogout = () => {
    localStorage.removeItem("token");
    navigate("/login");
  };

  return (
    <div className="min-h-screen bg-[#050805] text-white">
      {/* Navbar */}

      <header className="border-b border-[#16251A] bg-[#080D09]/90 backdrop-blur-xl">
        <div className="mx-auto flex max-w-6xl items-center justify-between px-5 py-4">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-[#39FF88] to-[#C7FF4D] shadow-lg shadow-[#39FF88]/10">
              <span className="font-black text-black">
                C
              </span>
            </div>

            <div>
              <h1 className="font-bold">
                Chat
                <span className="text-[#39FF88]">
                  Flow
                </span>
              </h1>

              <p className="text-xs text-[#66756A]">
                Messages
              </p>
            </div>
          </div>

          <button
            onClick={handleLogout}
            className="rounded-xl border border-[#263B2A] px-4 py-2 text-sm text-[#A9B6AC] transition hover:border-red-500/50 hover:text-red-400"
          >
            Logout
          </button>
        </div>
      </header>

      {/* Main */}

      <main className="mx-auto max-w-6xl px-5 py-8">
        <div className="mb-7">
          <p className="mb-2 text-sm font-medium text-[#39FF88]">
            YOUR MESSAGES
          </p>

          <h2 className="text-3xl font-bold">
            Start a conversation
          </h2>

          <p className="mt-2 text-[#78877D]">
            Select someone to start chatting.
          </p>
        </div>

        {loading ? (
          <div className="rounded-2xl border border-[#18291D] bg-[#0B120D] p-6 text-center">
            <div className="mx-auto mb-3 h-7 w-7 animate-spin rounded-full border-2 border-[#39FF88]/20 border-t-[#39FF88]" />

            <p className="text-sm text-[#8A9A8D]">
              Loading users...
            </p>
          </div>
        ) : users.length === 0 ? (
          <div className="rounded-2xl border border-[#18291D] bg-[#0B120D] p-8 text-center">
            <div className="mb-3 text-4xl">
              👥
            </div>

            <h3 className="font-semibold">
              No users found
            </h3>

            <p className="mt-1 text-sm text-[#718078]">
              Create another account to start a
              conversation.
            </p>
          </div>
        ) : (
          <div className="grid gap-3">
            {users.map((user) => (
              <button
                key={user._id}
                onClick={() =>
                  navigate(`/chat/${user._id}`)
                }
                className="group flex items-center gap-4 rounded-2xl border border-[#18291D] bg-[#0B120D] p-4 text-left transition hover:-translate-y-0.5 hover:border-[#39FF88]/40 hover:bg-[#0E180F] hover:shadow-lg hover:shadow-[#39FF88]/5"
              >
                {/* Avatar */}

                <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-gradient-to-br from-[#39FF88] to-[#C7FF4D] font-bold text-black">
                  {user.name
                    ?.charAt(0)
                    .toUpperCase()}
                </div>

                {/* User */}

                <div className="min-w-0">
                  <h3 className="font-semibold transition group-hover:text-[#39FF88]">
                    {user.name}
                  </h3>

                  <p className="truncate text-sm text-[#718078]">
                    {user.email}
                  </p>
                </div>

                {/* Arrow */}

                <div className="ml-auto text-xl text-[#506056] transition group-hover:translate-x-1 group-hover:text-[#39FF88]">
                  →
                </div>
              </button>
            ))}
          </div>
        )}
      </main>
      <ChatList />
    </div>
  );
}

export default Home;

