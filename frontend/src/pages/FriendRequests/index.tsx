import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

import { 
     getReceivedRequests,
     acceptFriendRequest,
     rejectFriendRequest,
 } from "../../service/friendRequestService";

interface User {
  _id: string;
  name: string;
  username?: string;
  email?: string;
  profileImage?: string;
}

interface FriendRequest {
  _id: string;
  sender: User;
  createdAt: string;
}

function FriendRequests() {
  const navigate = useNavigate();

  const [requests, setRequests] =
    useState<FriendRequest[]>([]);

  const [loading, setLoading] =
    useState(true);

  const loadRequests = async () => {
    try {
      const data =
        await getReceivedRequests();

      setRequests(data);
    } catch (error) {
      console.log(
        "Load requests error:",
        error
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadRequests();
  }, []);

  const handleAccept = async (
    requestId: string
  ) => {
    try {
      await acceptFriendRequest(
        requestId
      );

      setRequests((prev) =>
        prev.filter(
          (request) =>
            request._id !== requestId
        )
      );

      alert("Friend request accepted 🎉");
    } catch (error) {
      console.log(
        "Accept error:",
        error
      );

      alert("Failed to accept request");
    }
  };

  const handleReject = async (
    requestId: string
  ) => {
    try {
      await rejectFriendRequest(
        requestId
      );

      setRequests((prev) =>
        prev.filter(
          (request) =>
            request._id !== requestId
        )
      );
    } catch (error) {
      console.log(
        "Reject error:",
        error
      );

      alert("Failed to reject request");
    }
  };

  return (
    <div className="min-h-screen bg-[#050805] px-4 py-6 text-white">
      <div className="mx-auto max-w-2xl">

        <button
          onClick={() => navigate("/")}
          className="mb-6 text-[#39FF88]"
        >
          ← Back
        </button>

        <h1 className="mb-2 text-2xl font-bold">
          Friend Requests
        </h1>

        <p className="mb-6 text-sm text-[#718078]">
          People who want to connect with you
        </p>

        {loading ? (
          <p className="text-[#718078]">
            Loading...
          </p>
        ) : requests.length === 0 ? (
          <div className="rounded-2xl border border-[#263B2A] bg-[#0B120D] p-6 text-center">
            <p className="text-[#718078]">
              No pending requests
            </p>
          </div>
        ) : (
          <div className="space-y-3">
            {requests.map((request) => {
              const user =
                request.sender;

              return (
                <div
                  key={request._id}
                  className="flex items-center justify-between gap-4 rounded-2xl border border-[#263B2A] bg-[#0B120D] p-4"
                >
                  <div className="min-w-0">
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

                  <div className="flex shrink-0 gap-2">
                    <button
                      onClick={() =>
                        handleAccept(
                          request._id
                        )
                      }
                      className="rounded-xl bg-[#39FF88] px-3 py-2 font-semibold text-black"
                    >
                      Accept
                    </button>

                    <button
                      onClick={() =>
                        handleReject(
                          request._id
                        )
                      }
                      className="rounded-xl border border-red-500 px-3 py-2 text-red-400"
                    >
                      Reject
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}

export default FriendRequests;