import { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

function SwapRequests() {
  const navigate = useNavigate();

  const [sentRequests, setSentRequests] = useState([]);
  const [receivedRequests, setReceivedRequests] = useState([]);

  const [activeTab, setActiveTab] = useState("received");

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [actionLoading, setActionLoading] = useState("");

  const fetchRequests = async () => {
    try {
      setLoading(true);
      setError("");

      const [sentResponse, receivedResponse] =
        await Promise.all([
          axios.get(
            `${import.meta.env.VITE_API_URL}/swap/sent`,
            {
              withCredentials: true,
            }
          ),

          axios.get(
            `${import.meta.env.VITE_API_URL}/swap/received`,
            {
              withCredentials: true,
            }
          ),
        ]);

      setSentRequests(
        sentResponse.data.requests || []
      );

      setReceivedRequests(
        receivedResponse.data.requests || []
      );
    } catch (err) {
      console.error("Fetch requests error:", err);

      setError(
        err.response?.data?.message ||
        "Failed to load swap requests"
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchRequests();
  }, []);


  const updateStatus = async (id, status) => {
    try {
      setActionLoading(`${id}-${status}`);
      setError("");

      await axios.put(
        `${import.meta.env.VITE_API_URL}/swap/status/${id}`,
        {
          status,
        },
        {
          withCredentials: true,
        }
      );

      // Refresh requests
      await fetchRequests();
    } catch (err) {
      console.error("Update request error:", err);

      setError(
        err.response?.data?.message ||
        "Failed to update request"
      );
    } finally {
      setActionLoading("");
    }
  };

  const getStatusStyle = (status) => {
    switch (status) {
      case "Pending":
        return "bg-yellow-100 text-yellow-700";

      case "Accepted":
        return "bg-green-100 text-green-700";

      case "Rejected":
        return "bg-red-100 text-red-700";

      case "Cancelled":
        return "bg-gray-100 text-gray-600";

      case "Completed":
        return "bg-blue-100 text-blue-700";

      default:
        return "bg-gray-100 text-gray-600";
    }
  };



  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">

        <div className="text-center">

          <div className="w-14 h-14 border-4 border-gray-200 border-t-black rounded-full animate-spin mx-auto"></div>

          <p className="mt-5 text-gray-600 font-medium">
            Loading swap requests...
          </p>

        </div>

      </div>
    );
  }



  const currentRequests =
    activeTab === "received"
      ? receivedRequests
      : sentRequests;

  const handleCompleteSwap = async (id) => {

    const confirmComplete = window.confirm(
      "Are you sure you have completed this swap?"
    );

    if (!confirmComplete) {
      return;
    }

    try {

      await axios.put(
        `${import.meta.env.VITE_API_URL}/swap/complete/${id}`,
        {},
        {
          withCredentials: true
        }
      );

      alert("Swap completed successfully!");

      // Refresh requests
      fetchRequests();

    } catch (error) {

      console.error(
        "Complete swap error:",
        error
      );

      alert(
        error.response?.data?.message ||
        "Unable to complete swap"
      );
    }
  };
  return (
    <div className="min-h-screen bg-gray-50">

    
      <section className="bg-black text-white">

        <div className="max-w-6xl mx-auto px-6 py-12">

          <p className="text-gray-400 uppercase tracking-widest text-sm font-semibold">
            Clothing Exchange
          </p>

          <h1 className="text-4xl font-bold mt-2">
            Swap Requests
          </h1>

          <p className="text-gray-400 mt-3">
            Manage your clothing swap requests.
          </p>

        </div>

      </section>



      <main className="max-w-6xl mx-auto px-4 sm:px-6 py-8">

        {/* Error */}

        {error && (
          <div className="mb-6 bg-red-50 border border-red-200 text-red-700 px-5 py-4 rounded-xl">
            ⚠️ {error}
          </div>
        )}




        <div className="bg-white border border-gray-200 rounded-xl p-1.5 flex gap-1 mb-8">

          <button
            onClick={() => setActiveTab("received")}
            className={`flex-1 py-3 rounded-lg font-semibold transition ${activeTab === "received"
              ? "bg-black text-white"
              : "text-gray-600 hover:bg-gray-100"
              }`}
          >
            Received
            {receivedRequests.length > 0 && (
              <span className="ml-2">
                ({receivedRequests.length})
              </span>
            )}
          </button>

          <button
            onClick={() => setActiveTab("sent")}
            className={`flex-1 py-3 rounded-lg font-semibold transition ${activeTab === "sent"
              ? "bg-black text-white"
              : "text-gray-600 hover:bg-gray-100"
              }`}
          >
            Sent
            {sentRequests.length > 0 && (
              <span className="ml-2">
                ({sentRequests.length})
              </span>
            )}
          </button>

        </div>



        {currentRequests.length === 0 && (

          <div className="bg-white border border-gray-200 rounded-2xl p-12 text-center">

            <div className="text-6xl">
              🔄
            </div>

            <h2 className="text-2xl font-bold text-gray-900 mt-5">
              No {activeTab} requests
            </h2>

            <p className="text-gray-500 mt-2">
              {activeTab === "received"
                ? "You haven't received any swap requests yet."
                : "You haven't sent any swap requests yet."}
            </p>

            <button
              onClick={() => navigate("/marketplace")}
              className="mt-6 bg-black text-white px-6 py-3 rounded-lg font-medium hover:bg-gray-800"
            >
              Browse Marketplace
            </button>

          </div>

        )}



        <div className="space-y-6">

          {currentRequests.map((request) => {

            const requestedItem =
              request.requestedItem;

            const offeredItem =
              request.offeredItem;

            const person =
              activeTab === "received"
                ? request.requester
                : request.receiver;

            return (

              <div
                key={request._id}
                className="bg-white border border-gray-200 rounded-2xl overflow-hidden shadow-sm hover:shadow-md transition"
              >

                

                <div className="px-5 py-4 border-b bg-gray-50 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">

                  <div>

                    <p className="text-sm text-gray-500">
                      {activeTab === "received"
                        ? "Swap request from"
                        : "Swap request to"}
                    </p>

                    <p className="font-semibold text-gray-900">
                      {person?.name ||
                        person?.email ||
                        "User"}
                    </p>

                  </div>


                  <span
                    className={`self-start sm:self-auto px-3 py-1.5 rounded-full text-xs font-bold ${getStatusStyle(
                      request.status
                    )}`}
                  >
                    {request.status}
                  </span>

                </div>


              

                <div className="p-5">

                  <div className="grid grid-cols-1 md:grid-cols-[1fr_auto_1fr] items-center gap-5">


                    {/* YOU GET */}

                    <div>

                      <p className="text-xs uppercase tracking-wide font-bold text-gray-400 mb-3">
                        {activeTab === "received"
                          ? "They want your"
                          : "You want"}
                      </p>

                      <div
                        className="border border-gray-200 rounded-xl overflow-hidden cursor-pointer hover:border-gray-400 transition"
                        onClick={() =>
                          requestedItem?._id &&
                          navigate(
                            `/clothing/${requestedItem._id}`
                          )
                        }
                      >

                        <div className="h-52 bg-gray-100">

                          {requestedItem?.images?.length > 0 ? (

                            <img
                              src={requestedItem.images[0]}
                              alt={requestedItem.title}
                              className="w-full h-full object-cover"
                            />

                          ) : (

                            <div className="h-full flex items-center justify-center text-5xl">
                              👕
                            </div>

                          )}

                        </div>


                        <div className="p-4">

                          <h3 className="font-bold text-gray-900 truncate">
                            {requestedItem?.title ||
                              "Item unavailable"}
                          </h3>

                          <p className="text-sm text-gray-500 mt-1">
                            {requestedItem?.brand}
                          </p>

                          <p className="text-sm font-semibold mt-2">
                            ₹
                            {requestedItem?.estimatedValue ||
                              0}
                          </p>

                        </div>

                      </div>

                    </div>


                    {/* SWAP ICON */}

                    <div className="flex justify-center">

                      <div className="w-12 h-12 rounded-full bg-black text-white flex items-center justify-center text-xl">
                        ⇄
                      </div>

                    </div>


                    {/* OFFERED ITEM */}

                    <div>

                      <p className="text-xs uppercase tracking-wide font-bold text-gray-400 mb-3">
                        {activeTab === "received"
                          ? "They offer"
                          : "You offer"}
                      </p>

                      <div
                        className="border border-gray-200 rounded-xl overflow-hidden cursor-pointer hover:border-gray-400 transition"
                        onClick={() =>
                          offeredItem?._id &&
                          navigate(
                            `/clothing/${offeredItem._id}`
                          )
                        }
                      >

                        <div className="h-52 bg-gray-100">

                          {offeredItem?.images?.length > 0 ? (

                            <img
                              src={offeredItem.images[0]}
                              alt={offeredItem.title}
                              className="w-full h-full object-cover"
                            />

                          ) : (

                            <div className="h-full flex items-center justify-center text-5xl">
                              👕
                            </div>

                          )}

                        </div>


                        <div className="p-4">

                          <h3 className="font-bold text-gray-900 truncate">
                            {offeredItem?.title ||
                              "Item unavailable"}
                          </h3>

                          <p className="text-sm text-gray-500 mt-1">
                            {offeredItem?.brand}
                          </p>

                          <p className="text-sm font-semibold mt-2">
                            ₹
                            {offeredItem?.estimatedValue ||
                              0}
                          </p>

                        </div>

                      </div>

                    </div>

                  </div>


                 

                  {request.message && (

                    <div className="mt-6 bg-gray-50 rounded-xl p-4">

                      <p className="text-xs uppercase tracking-wide text-gray-400 font-bold">
                        Message
                      </p>

                      <p className="text-gray-700 mt-2">
                        "{request.message}"
                      </p>

                    </div>

                  )}



                  {request.status === "Pending" && (

                    <div className="flex flex-col sm:flex-row gap-3 mt-6">


                      {/* RECEIVED */}

                      {activeTab === "received" && (

                        <>
                          <button
                            onClick={() =>
                              updateStatus(
                                request._id,
                                "Accepted"
                              )
                            }
                            disabled={
                              actionLoading ===
                              `${request._id}-Accepted`
                            }
                            className="flex-1 bg-black text-white py-3 rounded-xl font-semibold hover:bg-gray-800 disabled:bg-gray-300 transition"
                          >
                            {actionLoading ===
                              `${request._id}-Accepted`
                              ? "Accepting..."
                              : "✓ Accept Swap"}
                          </button>


                          <button
                            onClick={() =>
                              updateStatus(
                                request._id,
                                "Rejected"
                              )
                            }
                            disabled={
                              actionLoading ===
                              `${request._id}-Rejected`
                            }
                            className="flex-1 border border-red-300 text-red-600 py-3 rounded-xl font-semibold hover:bg-red-50 disabled:bg-gray-100 transition"
                          >
                            {actionLoading ===
                              `${request._id}-Rejected`
                              ? "Rejecting..."
                              : "✕ Reject"}
                          </button>
                        </>

                      )}


                      {/* SENT */}

                      {activeTab === "sent" && (

                        <button
                          onClick={() =>
                            updateStatus(
                              request._id,
                              "Cancelled"
                            )
                          }
                          disabled={
                            actionLoading ===
                            `${request._id}-Cancelled`
                          }
                          className="w-full border border-gray-300 text-gray-700 py-3 rounded-xl font-semibold hover:bg-gray-100 disabled:bg-gray-100 transition"
                        >
                          {actionLoading ===
                            `${request._id}-Cancelled`
                            ? "Cancelling..."
                            : "Cancel Request"}
                        </button>

                      )}

                    </div>

                  )}


                  {request.status === "Accepted" && (
                    <div className="flex flex-col sm:flex-row gap-3">

                      <button
                        onClick={() =>
                          navigate(`/chat/${request._id}`)
                        }
                        className="flex-1 bg-black text-white px-4 py-3 rounded-lg font-medium hover:bg-gray-800 transition"
                      >
                        💬 Open Chat
                      </button>

                      <button
                        onClick={() =>
                          handleCompleteSwap(request._id)
                        }
                        className="flex-1 border border-green-600 text-green-700 px-4 py-3 rounded-lg font-medium hover:bg-green-50 transition"
                      >
                        ✓ Mark as Completed
                      </button>

                    </div>
                  )}

                </div>

              </div>

            );
          })}

        </div>

      </main>

    </div>
  );
}

export default SwapRequests;