import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

import { getUsers } from "../../service/userService";

import {
  sendFriendRequest,
  getFriends,
} from "../../service/friendRequestService";


interface User {
  _id: string;
  name: string;
  email: string;
  username?: string;
  profileImage?: string;
}

function Home() {
  const navigate = useNavigate();

  const [users, setUsers] = useState<User[]>([]);
  const [friends, setFriends] = useState<User[]>([]);

  const [loading, setLoading] = useState(true);
  const [sendingRequest, setSendingRequest] =
    useState<string | null>(null);

  const [sentRequests, setSentRequests] =
    useState<string[]>([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [usersData, friendsData] =
          await Promise.all([
            getUsers(),
            getFriends(),
          ]);

        setUsers(usersData);
        setFriends(friendsData);
      } catch (error) {
        console.log(
          "Error fetching home data:",
          error
        );
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const handleLogout = () => {
    localStorage.removeItem("token");
    navigate("/login");
  };

  const handleSendRequest = async (
    receiverId: string
  ) => {
    try {
      setSendingRequest(receiverId);

      await sendFriendRequest(receiverId);

      setSentRequests((prev) => [
        ...prev,
        receiverId,
      ]);

      alert("Friend request sent 🎉");
    } catch (error: any) {
      console.log(
        "Send request error:",
        error
      );

      alert(
        error?.response?.data?.message ||
          "Failed to send friend request"
      );
    } finally {
      setSendingRequest(null);
    }
  };

  const isFriend = (userId: string) => {
    return friends.some(
      (friend) => friend._id === userId
    );
  };

  return (
    <div className="min-h-screen bg-[#050805] text-white">

      {/* ================= NAVBAR ================= */}

      <header className="border-b border-[#16251A] bg-[#080D09]/90 backdrop-blur-xl">
        <div className="mx-auto flex max-w-6xl flex-wrap items-center justify-between gap-3 px-5 py-4">

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

          <div className="flex flex-wrap items-center gap-2">

            {/* FRIEND REQUESTS */}

            <button
              type="button"
              onClick={() =>
                navigate("/friend-requests")
              }
              className="rounded-xl border border-[#263B2A] px-4 py-2 text-sm text-[#39FF88] transition hover:bg-[#0E180F]"
            >
              👥 Requests
            </button>

            {/* CARDS */}

            <button
              type="button"
              onClick={() =>
                navigate("/cards")
              }
              className="rounded-xl bg-gradient-to-r from-[#39FF88] to-[#C7FF4D] px-4 py-2 text-sm font-semibold text-black hover:opacity-90"
            >
              🎁 Cards
            </button>

            {/* LOGOUT */}

            <button
              type="button"
              onClick={handleLogout}
              className="rounded-xl border border-[#263B2A] px-4 py-2 text-sm text-[#A9B6AC] transition hover:border-red-500/50 hover:text-red-400"
            >
              Logout
            </button>

          </div>
        </div>
      </header>

      {/* ================= MAIN ================= */}

      <main className="mx-auto max-w-6xl px-5 py-8">

        <div className="mb-7">
          <p className="mb-2 text-sm font-medium text-[#39FF88]">
            YOUR NETWORK
          </p>

          <h2 className="text-3xl font-bold">
            Find people
          </h2>

          <p className="mt-2 text-[#78877D]">
            Send a friend request before starting
            a conversation.
          </p>
        </div>

        {/* ================= USERS ================= */}

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
              Create another account to connect.
            </p>
          </div>
        ) : (
          <div className="grid gap-3">

            {users.map((user) => {

              const friend =
                isFriend(user._id);

              const requestSent =
                sentRequests.includes(
                  user._id
                );

              return (
                <div
                  key={user._id}
                  className="flex items-center gap-4 rounded-2xl border border-[#18291D] bg-[#0B120D] p-4 transition hover:border-[#39FF88]/40"
                >

                  {/* AVATAR */}

                  <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-gradient-to-br from-[#39FF88] to-[#C7FF4D] font-bold text-black">
                    {user.name
                      ?.charAt(0)
                      .toUpperCase()}
                  </div>

                  {/* USER INFO */}

                  <div className="min-w-0 flex-1">

                    <h3 className="font-semibold">
                      {user.name}
                    </h3>

                    {user.username && (
                      <p className="text-sm text-[#39FF88]">
                        @{user.username}
                      </p>
                    )}

                    <p className="truncate text-xs text-[#718078]">
                      {user.email}
                    </p>

                  </div>

                  {/* ACTION */}

                  {friend ? (
                    <button
                      type="button"
                      onClick={() =>
                        navigate(
                          `/chat/${user._id}`
                        )
                      }
                      className="shrink-0 rounded-xl bg-[#39FF88] px-4 py-2 text-sm font-semibold text-black hover:opacity-90"
                    >
                      💬 Chat
                    </button>
                  ) : requestSent ? (
                    <button
                      type="button"
                      disabled
                      className="shrink-0 rounded-xl border border-[#263B2A] px-4 py-2 text-sm text-[#718078]"
                    >
                      ⏳ Sent
                    </button>
                  ) : (
                    <button
                      type="button"
                      disabled={
                        sendingRequest ===
                        user._id
                      }
                      onClick={() =>
                        handleSendRequest(
                          user._id
                        )
                      }
                      className="shrink-0 rounded-xl border border-[#39FF88] px-4 py-2 text-sm font-semibold text-[#39FF88] hover:bg-[#102015] disabled:opacity-50"
                    >
                      {sendingRequest ===
                      user._id
                        ? "Sending..."
                        : "➕ Add Friend"}
                    </button>
                  )}

                </div>
              );
            })}

          </div>
        )}

      </main>

      {/* EXISTING CHAT LIST */}

    

    </div>
  );
}

export default Home;
