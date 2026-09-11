import { useEffect, useRef, useState } from "react";
import axios from "axios";
import { io } from "socket.io-client";
import { useNavigate, useParams } from "react-router-dom";

const SOCKET_URL = import.meta.env.VITE_API_URL;
const API_URL = import.meta.env.VITE_API_URL;

function Chat() {
  const { swapRequestId } = useParams();
  const navigate = useNavigate();

  const socketRef = useRef(null);
  const messagesEndRef = useRef(null);

  const [messages, setMessages] = useState([]);
  const [message, setMessage] = useState("");

  const [currentUser, setCurrentUser] = useState(null);
  const [otherUser, setOtherUser] = useState(null);

  const [loading, setLoading] = useState(true);
  const [sending, setSending] = useState(false);
  const [error, setError] = useState("");


  const fetchChat = async () => {
    try {
      setLoading(true);
      setError("");

      // Get messages
      const messagesResponse = await axios.get(
        `${API_URL}/message/${swapRequestId}`,
        {
          withCredentials: true,
        }
      );

      setMessages(messagesResponse.data.messages || []);
      setOtherUser(messagesResponse.data.otherUser || null);

      // Get current user
      const profileResponse = await axios.get(
        `${API_URL}/user/profile`,
        {
          withCredentials: true,
        }
      );

      const user =
        profileResponse.data.user ||
        profileResponse.data;

      setCurrentUser(user);

    } catch (err) {
      console.error("Fetch chat error:", err);

      setError(
        err.response?.data?.message ||
          "Failed to load chat"
      );
    } finally {
      setLoading(false);
    }
  };

 

  useEffect(() => {
    fetchChat();
  }, [swapRequestId]);



  useEffect(() => {
    if (!swapRequestId) return;

    const socket = io(SOCKET_URL, {
      withCredentials: true,
    });

    socketRef.current = socket;

    socket.on("connect", () => {
      console.log("Connected:", socket.id);

      const roomId = `swap_${swapRequestId}`;

      socket.emit("joinRoom", roomId);
    });

    socket.on("receiveMessage", (data) => {
      console.log("Received:", data);

      setMessages((prev) => {
        // Prevent duplicate messages
        if (
          data._id &&
          prev.some((msg) => msg._id === data._id)
        ) {
          return prev;
        }

        return [...prev, data];
      });
    });

    socket.on("disconnect", () => {
      console.log("Socket disconnected");
    });

    return () => {
      socket.disconnect();
    };
  }, [swapRequestId]);


  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({
      behavior: "smooth",
    });
  }, [messages]);



  const handleSendMessage = async (e) => {
    e.preventDefault();

    const text = message.trim();

    if (!text || sending) return;

    // We need receiver
    if (!otherUser?._id) {
      setError("Unable to identify receiver");
      return;
    }

    try {
      setSending(true);
      setError("");

      const response = await axios.post(
        `${API_URL}/message/send`,
        {
          receiver: otherUser._id,
          swapRequest: swapRequestId,
          message: text,
        },
        {
          withCredentials: true,
        }
      );

      const savedMessage =
        response.data.data;

      const roomId = `swap_${swapRequestId}`;

      // Send real-time message
      socketRef.current?.emit("sendMessage", {
        ...savedMessage,
        roomId,
      });

      setMessage("");

    } catch (err) {
      console.error("Send message error:", err);

      setError(
        err.response?.data?.message ||
          "Failed to send message"
      );
    } finally {
      setSending(false);
    }
  };

  useEffect(() => {
    if (!currentUser || messages.length === 0) return;

    const firstMessage = messages[0];

    if (!firstMessage.sender) return;

    if (
      firstMessage.sender._id !==
      currentUser._id
    ) {
      setOtherUser(firstMessage.sender);
    } else if (firstMessage.receiver) {
      setOtherUser(firstMessage.receiver);
    }
  }, [currentUser, messages]);

  

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">

        <div className="text-center">

          <div className="w-14 h-14 border-4 border-gray-200 border-t-black rounded-full animate-spin mx-auto" />

          <p className="mt-5 text-gray-600 font-medium">
            Loading chat...
          </p>

        </div>

      </div>
    );
  }

  return (
    <div className="h-screen bg-gray-100 flex flex-col">


      <header className="bg-black text-white">

        <div className="max-w-5xl mx-auto w-full px-5 py-4">

          <div className="flex items-center gap-4">

            <button
              onClick={() =>
                navigate("/swap-requests")
              }
              className="text-gray-300 hover:text-white text-xl"
            >
              ←
            </button>

            <div className="w-11 h-11 rounded-full bg-white text-black flex items-center justify-center font-bold text-lg">
              {otherUser?.name
                ?.charAt(0)
                ?.toUpperCase() || "U"}
            </div>

            <div>

              <h1 className="font-semibold">
                {otherUser?.name || "Swap Partner"}
              </h1>

              <p className="text-xs text-gray-400">
                Clothing Swap
              </p>

            </div>

          </div>

        </div>

      </header>


     

      <main className="flex-1 overflow-y-auto">

        <div className="max-w-5xl mx-auto px-4 py-6">


          {error && (
            <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-xl mb-5">
              ⚠️ {error}
            </div>
          )}


          {/* Intro */}

          {messages.length === 0 && !error && (

            <div className="flex justify-center py-16">

              <div className="text-center max-w-sm">

                <div className="w-16 h-16 bg-white rounded-full flex items-center justify-center mx-auto text-3xl shadow-sm">
                  💬
                </div>

                <h2 className="text-xl font-bold text-gray-900 mt-5">
                  Start the conversation
                </h2>

                <p className="text-gray-500 mt-2">
                  Discuss the swap details with your
                  swap partner.
                </p>

              </div>

            </div>

          )}


          {/* Messages */}

          <div className="space-y-4">

            {messages.map((msg, index) => {

              const senderId =
                msg.sender?._id ||
                msg.sender;

              const isMine =
                senderId === currentUser?._id;

              return (

                <div
                  key={msg._id || index}
                  className={`flex ${
                    isMine
                      ? "justify-end"
                      : "justify-start"
                  }`}
                >

                  <div
                    className={`max-w-[75%] md:max-w-[60%] ${
                      isMine
                        ? "items-end"
                        : "items-start"
                    } flex flex-col`}
                  >

                    <div
                      className={`px-4 py-3 rounded-2xl ${
                        isMine
                          ? "bg-black text-white rounded-br-md"
                          : "bg-white text-gray-800 border border-gray-200 rounded-bl-md"
                      }`}
                    >

                      <p className="text-sm leading-relaxed break-words">
                        {msg.message}
                      </p>

                    </div>


                    <span className="text-[11px] text-gray-400 mt-1 px-1">
                      {msg.createdAt
                        ? new Date(
                            msg.createdAt
                          ).toLocaleTimeString([], {
                            hour: "2-digit",
                            minute: "2-digit",
                          })
                        : ""}
                    </span>

                  </div>

                </div>

              );
            })}

            <div ref={messagesEndRef} />

          </div>

        </div>

      </main>


      

      <footer className="bg-white border-t">

        <div className="max-w-5xl mx-auto w-full px-4 py-4">

          <form
            onSubmit={handleSendMessage}
            className="flex items-end gap-3"
          >

            <textarea
              value={message}
              onChange={(e) =>
                setMessage(e.target.value)
              }
              onKeyDown={(e) => {
                if (
                  e.key === "Enter" &&
                  !e.shiftKey
                ) {
                  e.preventDefault();
                  handleSendMessage(e);
                }
              }}
              rows={1}
              maxLength={1000}
              placeholder="Type a message..."
              className="flex-1 resize-none border border-gray-300 rounded-2xl px-4 py-3 outline-none focus:border-black focus:ring-1 focus:ring-black"
            />

            <button
              type="submit"
              disabled={
                sending ||
                !message.trim()
              }
              className="bg-black text-white px-6 py-3 rounded-xl font-semibold hover:bg-gray-800 disabled:bg-gray-300 disabled:cursor-not-allowed transition"
            >
              {sending ? "..." : "Send"}
            </button>

          </form>

          <p className="text-[11px] text-gray-400 mt-2 text-right">
            Enter to send • Shift + Enter for new line
          </p>

        </div>

      </footer>

    </div>
  );
}

export default Chat;