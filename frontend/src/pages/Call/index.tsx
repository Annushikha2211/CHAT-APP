import {
  useEffect,
  useRef,
  useState,
} from "react";

import {
  useLocation,
  useNavigate,
  useParams,
  useSearchParams,
} from "react-router-dom";

import {
  connectSocket,
  getSocket,
} from "../../service/socketService";

interface CallState {
  incoming?: boolean;
  offer?: RTCSessionDescriptionInit;
  callerId?: string;
  callType?: "voice" | "video";
}

function Call() {
  const { userId } = useParams<{
    userId: string;
  }>();

  const [searchParams] = useSearchParams();

  const navigate = useNavigate();

  const location = useLocation();

  const callState =
    (location.state as CallState) || {};

  const isIncoming = !!callState.incoming;

  const callType =
    searchParams.get("type") === "video"
      ? "video"
      : "voice";

  const localVideoRef =
    useRef<HTMLVideoElement>(null);

  const remoteVideoRef =
    useRef<HTMLVideoElement>(null);

  const peerRef =
    useRef<RTCPeerConnection | null>(null);

  const localStreamRef =
    useRef<MediaStream | null>(null);

  const pendingCandidatesRef =
    useRef<RTCIceCandidateInit[]>([]);

  const [incomingCall, setIncomingCall] =
    useState(isIncoming);

 const callerId = callState.callerId || "";

const incomingOffer =
  callState.offer || null;
    


  const [connected, setConnected] =
    useState(false);

  const [error, setError] =
    useState("");

  // =========================================
  // CREATE PEER
  // =========================================

  const createPeer = () => {
    if (peerRef.current) {
      return peerRef.current;
    }

 const peer =
  new RTCPeerConnection({
    iceServers: [
      {
        urls: "stun:stun.l.google.com:19302",
      },
    ],
  });

    peer.onicecandidate = (event) => {
      if (
        event.candidate &&
        userId
      ) {
        getSocket()?.emit(
          "ice_candidate",
          {
            receiverId: userId,
            candidate: event.candidate,
          }
        );
      }
    };

    peer.ontrack = (event) => {
      const [stream] =
        event.streams;

      if (
        remoteVideoRef.current
      ) {
        remoteVideoRef.current.srcObject =
          stream;
      }
    };

    peer.onconnectionstatechange =
      () => {
        console.log(
          "Peer connection state:",
          peer.connectionState
        );

        if (
          peer.connectionState ===
          "connected"
        ) {
          setConnected(true);
        }

        if (
          peer.connectionState ===
            "failed" ||
          peer.connectionState ===
            "disconnected" ||
          peer.connectionState ===
            "closed"
        ) {
          setConnected(false);
        }
      };

    peerRef.current = peer;

    return peer;
  };

  // =========================================
  // GET CAMERA / MICROPHONE
  // =========================================

  const getLocalStream =
    async () => {
      const stream =
        await navigator.mediaDevices.getUserMedia(
          {
            audio: true,
            video:
              callType === "video",
          }
        );

      localStreamRef.current =
        stream;

      if (
        localVideoRef.current
      ) {
        localVideoRef.current.srcObject =
          stream;
      }

      return stream;
    };

  // =========================================
  // START OUTGOING CALL
  // =========================================

  const startCall = async () => {
    if (
      !userId ||
      isIncoming
    ) {
      return;
    }

    try {
      const socket =
        connectSocket();

      if (!socket) {
        setError(
          "Socket connection failed."
        );
        return;
      }

      const stream =
        await getLocalStream();

      const peer =
        createPeer();

      stream
        .getTracks()
        .forEach((track) => {
          peer.addTrack(
            track,
            stream
          );
        });

      const offer =
        await peer.createOffer();

      await peer.setLocalDescription(
        offer
      );

      socket.emit(
        "call_user",
        {
          receiverId: userId,
          offer,
          callType,
        }
      );

      console.log(
        "Outgoing call sent"
      );
    } catch (err) {
      console.log(
        "Start call error:",
        err
      );

      setError(
        "Camera/microphone permission denied or unavailable."
      );
    }
  };

  // =========================================
  // ACCEPT INCOMING CALL
  // =========================================

  const acceptCall = async () => {
    if (
      !callerId ||
      !incomingOffer
    ) {
      console.log(
        "Missing callerId or offer"
      );
      return;
    }

    try {
      const socket =
        connectSocket();

      if (!socket) {
        setError(
          "Socket connection failed."
        );
        return;
      }

      const stream =
        await getLocalStream();

      const peer =
        createPeer();

      stream
        .getTracks()
        .forEach((track) => {
          peer.addTrack(
            track,
            stream
          );
        });

      await peer.setRemoteDescription(
        new RTCSessionDescription(
          incomingOffer
        )
      );

      // Add ICE candidates
      for (
        const candidate of
        pendingCandidatesRef.current
      ) {
        await peer.addIceCandidate(
          new RTCIceCandidate(
            candidate
          )
        );
      }

      pendingCandidatesRef.current =
        [];

      const answer =
        await peer.createAnswer();

      await peer.setLocalDescription(
        answer
      );

      socket.emit(
        "answer_call",
        {
          callerId,
          answer,
        }
      );

      setIncomingCall(false);

      console.log(
        "Call accepted"
      );
    } catch (err) {
      console.log(
        "Accept call error:",
        err
      );

      setError(
        "Unable to accept call."
      );
    }
  };

  // =========================================
  // REJECT CALL
  // =========================================

  const rejectCall = () => {
    if (callerId) {
      getSocket()?.emit(
        "end_call",
        {
          receiverId: callerId,
        }
      );
    }

    cleanupCall();

    navigate(-1);
  };

  // =========================================
  // END CALL
  // =========================================

  const cleanupCall = () => {
    if (
      localStreamRef.current
    ) {
      localStreamRef.current
        .getTracks()
        .forEach((track) =>
          track.stop()
        );

      localStreamRef.current =
        null;
    }

    peerRef.current?.close();

    peerRef.current = null;

    if (
      localVideoRef.current
    ) {
      localVideoRef.current.srcObject =
        null;
    }

    if (
      remoteVideoRef.current
    ) {
      remoteVideoRef.current.srcObject =
        null;
    }
  };

  const endCall = () => {
    const receiver =
      isIncoming
        ? callerId
        : userId;

    if (receiver) {
      getSocket()?.emit(
        "end_call",
        {
          receiverId: receiver,
        }
      );
    }

    cleanupCall();

    navigate(-1);
  };

  // =========================================
  // SOCKET EVENTS
  // =========================================

  useEffect(() => {
    const socket =
      connectSocket();

    if (!socket) return;

    // -----------------------------
    // CALL ANSWERED
    // -----------------------------

    const handleCallAnswered =
      async ({
        answer,
      }: {
        answer: RTCSessionDescriptionInit;
      }) => {
        try {
          if (
            peerRef.current
          ) {
            await peerRef.current.setRemoteDescription(
              new RTCSessionDescription(
                answer
              )
            );

            console.log(
              "Answer received"
            );
          }
        } catch (err) {
          console.log(
            "Answer error:",
            err
          );
        }
      };

    // -----------------------------
    // ICE CANDIDATE
    // -----------------------------

    const handleIceCandidate =
      async ({
        candidate,
      }: {
        candidate: RTCIceCandidateInit;
      }) => {
        try {
          if (
            !peerRef.current
          ) {
            pendingCandidatesRef.current.push(
              candidate
            );

            return;
          }

          const remoteDescription =
            peerRef.current
              .remoteDescription;

          if (
            !remoteDescription
          ) {
            pendingCandidatesRef.current.push(
              candidate
            );

            return;
          }

          await peerRef.current.addIceCandidate(
            new RTCIceCandidate(
              candidate
            )
          );
        } catch (err) {
          console.log(
            "ICE error:",
            err
          );
        }
      };

    // -----------------------------
    // CALL ENDED
    // -----------------------------

    const handleCallEnded =
      () => {
        cleanupCall();

        navigate(-1);
      };

    // -----------------------------
    // CALL ERROR
    // -----------------------------

    const handleCallError =
      ({
        message,
      }: {
        message: string;
      }) => {
        setError(message);
      };

    socket.on(
      "call_answered",
      handleCallAnswered
    );

    socket.on(
      "ice_candidate",
      handleIceCandidate
    );

    socket.on(
      "call_ended",
      handleCallEnded
    );

    socket.on(
      "call_error",
      handleCallError
    );

    return () => {
      socket.off(
        "call_answered",
        handleCallAnswered
      );

      socket.off(
        "ice_candidate",
        handleIceCandidate
      );

      socket.off(
        "call_ended",
        handleCallEnded
      );

      socket.off(
        "call_error",
        handleCallError
      );
    };
  }, [navigate]);

  // =========================================
  // AUTO START ONLY FOR OUTGOING CALL
  // =========================================

  useEffect(() => {
    if (
      !userId ||
      isIncoming
    ) {
      return;
    }

    const timer =
      setTimeout(() => {
        startCall();
      }, 500);

    return () => {
      clearTimeout(timer);
    };
  }, [userId, isIncoming]);

  // =========================================
  // UI
  // =========================================

  return (
    <div className="min-h-screen bg-[#050805] p-4 text-white">
      <div className="mx-auto max-w-5xl">

        {/* HEADER */}

        <div className="mb-5 flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold">
              {callType === "video"
                ? "📹 Video Call"
                : "📞 Voice Call"}
            </h1>

            <p className="text-sm text-[#718078]">
              {connected
                ? "Connected"
                : incomingCall
                ? "Incoming call..."
                : "Connecting..."}
            </p>
          </div>

          {!incomingCall && (
            <button
              type="button"
              onClick={endCall}
              className="rounded-xl bg-red-500 px-5 py-3 font-bold text-white"
            >
              End Call
            </button>
          )}
        </div>

        {/* ERROR */}

        {error && (
          <div className="mb-5 rounded-xl border border-red-500 bg-red-500/10 p-4 text-red-400">
            {error}
          </div>
        )}

        {/* INCOMING CALL */}

        {incomingCall && (
          <div className="mb-5 rounded-2xl border border-[#39FF88] bg-[#0B120D] p-6 text-center">
            <h2 className="text-xl font-bold">
              📞 Incoming{" "}
              {callType === "video"
                ? "Video"
                : "Voice"}{" "}
              Call
            </h2>

            <p className="mt-2 text-[#718078]">
              Someone is calling you...
            </p>

            <div className="mt-5 flex justify-center gap-3">

              <button
                type="button"
                onClick={acceptCall}
                className="rounded-xl bg-[#39FF88] px-6 py-3 font-bold text-black"
              >
                Accept
              </button>

              <button
                type="button"
                onClick={rejectCall}
                className="rounded-xl bg-red-500 px-6 py-3 font-bold text-white"
              >
                Reject
              </button>

            </div>
          </div>
        )}

        {/* VIDEO AREA */}

        <div className="grid gap-4 md:grid-cols-2">

          {/* REMOTE */}

          <div className="relative min-h-[350px] overflow-hidden rounded-3xl border border-[#263B2A] bg-black">

            <video
              ref={remoteVideoRef}
              autoPlay
              playsInline
              className="h-full min-h-[350px] w-full object-cover"
            />

            {callType === "voice" && (
              <div className="absolute inset-0 flex items-center justify-center text-7xl">
                📞
              </div>
            )}

            <div className="absolute bottom-4 left-4 rounded-lg bg-black/60 px-3 py-2">
              Remote
            </div>
          </div>

          {/* LOCAL */}

          <div className="relative min-h-[350px] overflow-hidden rounded-3xl border border-[#263B2A] bg-[#0B120D]">

            {callType === "video" ? (
              <video
                ref={localVideoRef}
                autoPlay
                muted
                playsInline
                className="h-full min-h-[350px] w-full object-cover"
              />
            ) : (
              <div className="flex min-h-[350px] items-center justify-center text-7xl">
                🎙️
              </div>
            )}

            <div className="absolute bottom-4 left-4 rounded-lg bg-black/60 px-3 py-2">
              You
            </div>
          </div>

        </div>
      </div>
    </div>
  );
}

export default Call;