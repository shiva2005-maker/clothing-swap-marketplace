import { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../Context/Auth";

function Dashboard() {
  const navigate = useNavigate();
  const [auth] = useAuth();
  const currentUser = auth?.user;

  

  const [myListings, setMyListings] = useState([]);
  const [sentRequests, setSentRequests] = useState([]);
  const [receivedRequests, setReceivedRequests] = useState([]);

  const [loading, setLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState("");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const [activeTab, setActiveTab] = useState("listings");

 

  const fetchDashboardData = async () => {
    try {
      setLoading(true);
      setError("");

      const [
        listingsResponse,
        sentResponse,
        receivedResponse,
      ] = await Promise.all([
        axios.get(
          `${import.meta.env.VITE_API_URL}/clothing/mylistings`,
          {
            withCredentials: true,
          }
        ),

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


      const listingsData =
        listingsResponse.data?.clothing ||
        listingsResponse.data?.items ||
        listingsResponse.data?.listings ||
        listingsResponse.data;


      const sentData =
        sentResponse.data?.requests ||
        sentResponse.data?.swapRequests ||
        sentResponse.data;


      const receivedData =
        receivedResponse.data?.requests ||
        receivedResponse.data?.swapRequests ||
        receivedResponse.data;

      setMyListings(
        Array.isArray(listingsData)
          ? listingsData
          : []
      );

      setSentRequests(
        Array.isArray(sentData)
          ? sentData
          : []
      );

      setReceivedRequests(
        Array.isArray(receivedData)
          ? receivedData
          : []
      );

      console.log("My Listings:", listingsData);
      console.log("Sent Requests:", sentData);
      console.log("Received Requests:", receivedData);

    } catch (err) {
      console.error(
        "Dashboard error:",
        err.response?.data || err.message
      );

      setError(
        err.response?.data?.message ||
          "Failed to load dashboard"
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDashboardData();
  }, []);


  useEffect(() => {
    if (!success) return;

    const timer = setTimeout(() => {
      setSuccess("");
    }, 3000);

    return () => clearTimeout(timer);
  }, [success]);


  const updateRequestStatus = async (
    requestId,
    status
  ) => {
    try {
      setActionLoading(requestId);
      setError("");
      setSuccess("");

      await axios.put(
        `${import.meta.env.VITE_API_URL}/swap/status/${requestId}`,
        {
          status,
        },
        {
          withCredentials: true,
        }
      );

      if (status === "Accepted") {
        setSuccess("Swap request accepted successfully.");
      } else if (status === "Rejected") {
        setSuccess("Swap request rejected.");
      } else if (status === "Cancelled") {
        setSuccess("Swap request cancelled.");
      }

      // Refresh all dashboard data
      await fetchDashboardData();

    } catch (err) {
      console.error(
        "Update request error:",
        err.response?.data || err.message
      );

      setError(
        err.response?.data?.message ||
          "Failed to update swap request"
      );
    } finally {
      setActionLoading("");
    }
  };


  const deleteListing = async (listingId) => {
    const confirmDelete = window.confirm(
      "Are you sure you want to delete this clothing?"
    );

    if (!confirmDelete) return;

    try {
      setActionLoading(listingId);
      setError("");
      setSuccess("");

      await axios.delete(
        `${import.meta.env.VITE_API_URL}/clothing/delete/${listingId}`,
        {
          withCredentials: true,
        }
      );

      setSuccess("Clothing deleted successfully.");

      await fetchDashboardData();

    } catch (err) {
      console.error(
        "Delete listing error:",
        err.response?.data || err.message
      );

      setError(
        err.response?.data?.message ||
          "Failed to delete clothing"
      );
    } finally {
      setActionLoading("");
    }
  };


  const availableListings =
    myListings.filter(
      (item) => item.status === "Available"
    ).length;

  const pendingListings =
    myListings.filter(
      (item) => item.status === "Pending Swap"
    ).length;

  const swappedListings =
    myListings.filter(
      (item) => item.status === "Swapped"
    ).length;

  const pendingReceived =
    receivedRequests.filter(
      (request) => request.status === "Pending"
    ).length;

  const acceptedRequests =
    [...sentRequests, ...receivedRequests].filter(
      (request) => request.status === "Accepted"
    ).length;


  const getStatusStyle = (status) => {
    switch (status) {
      case "Available":
        return "bg-green-100 text-green-700";

      case "Pending Swap":
        return "bg-yellow-100 text-yellow-700";

      case "Accepted":
        return "bg-green-100 text-green-700";

      case "Rejected":
        return "bg-red-100 text-red-700";

      case "Cancelled":
        return "bg-gray-100 text-gray-700";

      case "Completed":
        return "bg-blue-100 text-blue-700";

      case "Swapped":
        return "bg-blue-100 text-blue-700";

      default:
        return "bg-gray-100 text-gray-700";
    }
  };


  const userName =
    currentUser?.name ||
    currentUser?.username ||
    "User";


  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">

        <div className="text-center">

          <div className="w-14 h-14 border-4 border-gray-200 border-t-black rounded-full animate-spin mx-auto"></div>

          <p className="mt-5 text-gray-600 font-medium">
            Loading dashboard...
          </p>

        </div>

      </div>
    );
  }


  return (
    <div className="min-h-screen bg-gray-50">


      <section className="bg-black text-white">

        <div className="max-w-7xl mx-auto px-6 py-12">

          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-6">

            <div>

              <p className="text-gray-400 uppercase tracking-widest text-sm font-medium mb-2">
                My Dashboard
              </p>

              <h1 className="text-4xl md:text-5xl font-bold tracking-tight">
                Welcome, {userName}
              </h1>

              <p className="text-gray-400 mt-3 text-lg">
                Manage your listings and swap activity.
              </p>

            </div>

            <div className="flex flex-wrap gap-3">

              <button
                onClick={() =>
                  navigate("/marketplace")
                }
                className="border border-gray-600 text-white px-6 py-3 rounded-xl font-semibold hover:bg-white hover:text-black transition"
              >
                Browse Marketplace
              </button>

              <button
                onClick={() =>
                  navigate("/add-clothing")
                }
                className="bg-white text-black px-6 py-3 rounded-xl font-semibold hover:bg-gray-200 transition"
              >
                + List Clothing
              </button>

            </div>

          </div>

        </div>

      </section>


      <main className="max-w-7xl mx-auto px-4 sm:px-6 py-8">


        {success && (
          <div className="bg-green-50 border border-green-200 rounded-xl p-4 mb-6">

            <div className="flex items-center gap-3">

              <span className="text-xl">
                ✅
              </span>

              <p className="text-green-700 font-medium">
                {success}
              </p>

            </div>

          </div>
        )}


        {error && (
          <div className="bg-red-50 border border-red-200 rounded-xl p-4 mb-6">

            <div className="flex items-center justify-between gap-4">

              <div className="flex items-center gap-3">

                <span className="text-xl">
                  ⚠️
                </span>

                <p className="text-red-700 font-medium">
                  {error}
                </p>

              </div>

              <button
                onClick={() => setError("")}
                className="text-red-500 hover:text-red-700 text-xl"
              >
                ×
              </button>

            </div>

          </div>
        )}


        <section className="bg-white rounded-2xl border border-gray-200 shadow-sm p-6 mb-8">

          <div className="flex flex-col sm:flex-row sm:items-center gap-5">

            <div className="w-20 h-20 rounded-full bg-gray-100 flex items-center justify-center overflow-hidden">

              {currentUser?.image ? (

                <img
                  src={currentUser.image}
                  alt={userName}
                  className="w-full h-full object-cover"
                />

              ) : (

                <span className="text-3xl">
                  👤
                </span>

              )}

            </div>

            <div className="flex-1">

              <h2 className="text-2xl font-bold text-gray-900">
                {userName}
              </h2>

              <p className="text-gray-500 mt-1">
                {currentUser?.email ||
                  "Email unavailable"}
              </p>

              {currentUser?.location && (
                <p className="text-gray-500 text-sm mt-1">
                  📍{" "}
                  {typeof currentUser.location ===
                  "object"
                    ? currentUser.location?.city
                    : currentUser.location}
                </p>
              )}

            </div>

            <button
              onClick={() =>
                navigate("/profile")
              }
              className="border border-gray-300 px-5 py-2.5 rounded-lg font-semibold text-gray-700 hover:border-black hover:text-black transition"
            >
              Edit Profile
            </button>

          </div>

        </section>


        <section className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4 mb-8">

          {/* LISTINGS */}

          <div className="bg-white rounded-2xl border border-gray-200 shadow-sm p-5">

            <p className="text-sm text-gray-500">
              My Listings
            </p>

            <div className="flex items-center justify-between mt-3">

              <h2 className="text-3xl font-bold">
                {myListings.length}
              </h2>

              <span className="text-2xl">
                👕
              </span>

            </div>

          </div>

          {/* AVAILABLE */}

          <div className="bg-white rounded-2xl border border-gray-200 shadow-sm p-5">

            <p className="text-sm text-gray-500">
              Available
            </p>

            <div className="flex items-center justify-between mt-3">

              <h2 className="text-3xl font-bold">
                {availableListings}
              </h2>

              <span className="text-2xl">
                ✅
              </span>

            </div>

          </div>

          {/* PENDING */}

          <div className="bg-white rounded-2xl border border-gray-200 shadow-sm p-5">

            <p className="text-sm text-gray-500">
              Pending Swap
            </p>

            <div className="flex items-center justify-between mt-3">

              <h2 className="text-3xl font-bold">
                {pendingListings}
              </h2>

              <span className="text-2xl">
                🔄
              </span>

            </div>

          </div>

          {/* SWAPPED */}

          <div className="bg-white rounded-2xl border border-gray-200 shadow-sm p-5">

            <p className="text-sm text-gray-500">
              Swapped
            </p>

            <div className="flex items-center justify-between mt-3">

              <h2 className="text-3xl font-bold">
                {swappedListings}
              </h2>

              <span className="text-2xl">
                🎉
              </span>

            </div>

          </div>

          {/* REQUESTS */}

          <div className="bg-white rounded-2xl border border-gray-200 shadow-sm p-5">

            <p className="text-sm text-gray-500">
              Pending Requests
            </p>

            <div className="flex items-center justify-between mt-3">

              <h2 className="text-3xl font-bold">
                {pendingReceived}
              </h2>

              <span className="text-2xl">
                📩
              </span>

            </div>

          </div>

        </section>


        <section className="bg-white rounded-2xl border border-gray-200 shadow-sm mb-8">

          <div className="border-b border-gray-200 px-5">

            <div className="flex gap-8 overflow-x-auto">

              <button
                onClick={() =>
                  setActiveTab("listings")
                }
                className={`py-4 text-sm font-semibold whitespace-nowrap border-b-2 transition ${
                  activeTab === "listings"
                    ? "border-black text-black"
                    : "border-transparent text-gray-500 hover:text-black"
                }`}
              >
                My Listings ({myListings.length})
              </button>

              <button
                onClick={() =>
                  setActiveTab("sent")
                }
                className={`py-4 text-sm font-semibold whitespace-nowrap border-b-2 transition ${
                  activeTab === "sent"
                    ? "border-black text-black"
                    : "border-transparent text-gray-500 hover:text-black"
                }`}
              >
                Sent Requests ({sentRequests.length})
              </button>

              <button
                onClick={() =>
                  setActiveTab("received")
                }
                className={`py-4 text-sm font-semibold whitespace-nowrap border-b-2 transition ${
                  activeTab === "received"
                    ? "border-black text-black"
                    : "border-transparent text-gray-500 hover:text-black"
                }`}
              >
                Received Requests ({receivedRequests.length})

                {pendingReceived > 0 && (
                  <span className="ml-2 bg-red-500 text-white text-xs px-2 py-0.5 rounded-full">
                    {pendingReceived}
                  </span>
                )}

              </button>

            </div>

          </div>


          {activeTab === "listings" && (

            <div className="p-5">

              {myListings.length === 0 ? (

                <div className="text-center py-14">

                  <div className="text-6xl">
                    👕
                  </div>

                  <h3 className="text-xl font-bold mt-5">
                    No listings yet
                  </h3>

                  <p className="text-gray-500 mt-2">
                    List your first clothing item and
                    start swapping.
                  </p>

                  <button
                    onClick={() =>
                      navigate("/add-clothing")
                    }
                    className="mt-5 bg-black text-white px-6 py-3 rounded-lg font-semibold hover:bg-gray-800"
                  >
                    + List Clothing
                  </button>

                </div>

              ) : (

                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">

                  {myListings.map((item) => (

                    <article
                      key={item._id}
                      className="border border-gray-200 rounded-2xl overflow-hidden hover:shadow-lg transition"
                    >

                      {/* IMAGE */}

                      <div className="h-60 bg-gray-100">

                        {item.images?.length > 0 ? (

                          <img
                            src={item.images[0]}
                            alt={item.title}
                            className="w-full h-full object-cover"
                          />

                        ) : (

                          <div className="w-full h-full flex items-center justify-center text-5xl">
                            👕
                          </div>

                        )}

                      </div>

                      {/* CONTENT */}

                      <div className="p-4">

                        <div className="flex justify-between gap-2">

                          <h3 className="font-bold text-gray-900 truncate">
                            {item.title}
                          </h3>

                          <span
                            className={`px-2 py-1 rounded-full text-xs font-bold whitespace-nowrap ${getStatusStyle(
                              item.status
                            )}`}
                          >
                            {item.status}
                          </span>

                        </div>

                        <p className="text-sm text-gray-500 mt-1">
                          {item.brand ||
                            "Brand not specified"}
                        </p>

                        <div className="flex justify-between mt-4">

                          <span className="text-sm">
                            Size:{" "}
                            <strong>
                              {item.size || "-"}
                            </strong>
                          </span>

                          <span className="text-sm font-bold">
                            ₹
                            {item.estimatedValue ||
                              0}
                          </span>

                        </div>

                        {/* ACTIONS */}

                        <div className="grid grid-cols-2 gap-2 mt-5">

                          <button
                            onClick={() =>
                              navigate(
                                `/clothing/${item._id}`
                              )
                            }
                            className="border border-gray-300 py-2.5 rounded-lg text-sm font-semibold hover:border-black"
                          >
                            View
                          </button>

                          <button
                            onClick={() =>
                              navigate(
                                `/edit-clothing/${item._id}`
                              )
                            }
                            className="border border-gray-300 py-2.5 rounded-lg text-sm font-semibold hover:border-black"
                          >
                            Edit
                          </button>

                        </div>

                        <button
                          onClick={() =>
                            deleteListing(item._id)
                          }
                          disabled={
                            actionLoading === item._id
                          }
                          className="w-full mt-2 border border-red-200 text-red-600 py-2.5 rounded-lg text-sm font-semibold hover:bg-red-50 disabled:opacity-50"
                        >
                          {actionLoading ===
                          item._id
                            ? "Deleting..."
                            : "Delete"}
                        </button>

                      </div>

                    </article>

                  ))}

                </div>

              )}

            </div>

          )}


          {activeTab === "sent" && (

            <div className="p-5">

              {sentRequests.length === 0 ? (

                <div className="text-center py-14">

                  <div className="text-5xl">
                    📤
                  </div>

                  <h3 className="text-xl font-bold mt-4">
                    No sent requests
                  </h3>

                  <p className="text-gray-500 mt-2">
                    Browse the marketplace and request a
                    swap.
                  </p>

                  <button
                    onClick={() =>
                      navigate("/marketplace")
                    }
                    className="mt-5 bg-black text-white px-6 py-3 rounded-lg font-semibold"
                  >
                    Browse Marketplace
                  </button>

                </div>

              ) : (

                <div className="space-y-4">

                  {sentRequests.map((request) => (

                    <div
                      key={request._id}
                      className="border border-gray-200 rounded-xl p-5"
                    >

                      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">

                        <div className="flex-1">

                          <p className="text-xs text-gray-400 uppercase tracking-wide">
                            You requested
                          </p>

                          <h3 className="text-lg font-bold text-gray-900 mt-1">
                            {request.requestedItem
                              ?.title ||
                              "Requested Clothing"}
                          </h3>

                          <p className="text-sm text-gray-500 mt-2">
                            You offered:{" "}
                            <span className="font-semibold text-gray-700">
                              {request.offeredItem
                                ?.title ||
                                "Clothing"}
                            </span>
                          </p>

                          {request.receiver?.name && (
                            <p className="text-sm text-gray-500 mt-1">
                              Owner:{" "}
                              {request.receiver.name}
                            </p>
                          )}

                        </div>

                        <div className="flex flex-col items-start md:items-end gap-3">

                          <span
                            className={`px-4 py-1.5 rounded-full text-xs font-bold ${getStatusStyle(
                              request.status
                            )}`}
                          >
                            {request.status}
                          </span>

                          {request.status ===
                            "Pending" && (

                            <button
                              onClick={() =>
                                updateRequestStatus(
                                  request._id,
                                  "Cancelled"
                                )
                              }
                              disabled={
                                actionLoading ===
                                request._id
                              }
                              className="border border-red-200 text-red-600 px-4 py-2 rounded-lg text-sm font-semibold hover:bg-red-50 disabled:opacity-50"
                            >
                              {actionLoading ===
                              request._id
                                ? "Cancelling..."
                                : "Cancel Request"}
                            </button>

                          )}

                          {request.status ===
                            "Accepted" && (

                            <button
                              onClick={() =>
                                navigate(
                                  `/chat/${request._id}`
                                )
                              }
                              className="bg-black text-white px-5 py-2 rounded-lg text-sm font-semibold hover:bg-gray-800"
                            >
                              Open Chat
                            </button>

                          )}

                        </div>

                      </div>

                      {request.message && (

                        <div className="mt-4 pt-4 border-t border-gray-100">

                          <p className="text-xs text-gray-400">
                            Message
                          </p>

                          <p className="text-sm text-gray-600 mt-1">
                            {request.message}
                          </p>

                        </div>

                      )}

                    </div>

                  ))}

                </div>

              )}

            </div>

          )}


          {activeTab === "received" && (

            <div className="p-5">

              {receivedRequests.length === 0 ? (

                <div className="text-center py-14">

                  <div className="text-5xl">
                    📥
                  </div>

                  <h3 className="text-xl font-bold mt-4">
                    No received requests
                  </h3>

                  <p className="text-gray-500 mt-2">
                    Requests for your clothing will appear
                    here.
                  </p>

                </div>

              ) : (

                <div className="space-y-4">

                  {receivedRequests.map((request) => (

                    <div
                      key={request._id}
                      className="border border-gray-200 rounded-xl p-5"
                    >

                      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">

                        <div className="flex-1">

                          <p className="text-xs text-gray-400 uppercase tracking-wide">
                            Swap request
                          </p>

                          <h3 className="text-lg font-bold text-gray-900 mt-1">
                            {request.requester?.name ||
                              "Someone"}{" "}
                            wants your{" "}
                            {request.requestedItem
                              ?.title ||
                              "clothing"}
                          </h3>

                          <p className="text-sm text-gray-500 mt-2">
                            They offered:{" "}
                            <span className="font-semibold text-gray-700">
                              {request.offeredItem
                                ?.title ||
                                "Clothing"}
                            </span>
                          </p>

                        </div>

                        <div className="flex flex-col items-start md:items-end gap-3">

                          <span
                            className={`px-4 py-1.5 rounded-full text-xs font-bold ${getStatusStyle(
                              request.status
                            )}`}
                          >
                            {request.status}
                          </span>

                          {/* PENDING ACTIONS */}

                          {request.status ===
                            "Pending" && (

                            <div className="flex gap-2">

                              <button
                                onClick={() =>
                                  updateRequestStatus(
                                    request._id,
                                    "Accept"
                                  )
                                }
                                disabled={
                                  actionLoading ===
                                  request._id
                                }
                                className="bg-black text-white px-5 py-2 rounded-lg text-sm font-semibold hover:bg-gray-800 disabled:opacity-50"
                              >
                                {actionLoading ===
                                request._id
                                  ? "..."
                                  : "Accept"}
                              </button>

                              <button
                                onClick={() =>
                                  updateRequestStatus(
                                    request._id,
                                    "Reject"
                                  )
                                }
                                disabled={
                                  actionLoading ===
                                  request._id
                                }
                                className="border border-red-200 text-red-600 px-5 py-2 rounded-lg text-sm font-semibold hover:bg-red-50 disabled:opacity-50"
                              >
                                Reject
                              </button>

                            </div>

                          )}

                          {/* ACCEPTED */}

                          {request.status ===
                            "Accepted" && (

                            <button
                              onClick={() =>
                                navigate(
                                  `/chat/${request._id}`
                                )
                              }
                              className="bg-black text-white px-5 py-2 rounded-lg text-sm font-semibold hover:bg-gray-800"
                            >
                              Open Chat
                            </button>

                          )}

                        </div>

                      </div>

                      {request.message && (

                        <div className="mt-4 pt-4 border-t border-gray-100">

                          <p className="text-xs text-gray-400">
                            Message
                          </p>

                          <p className="text-sm text-gray-600 mt-1">
                            {request.message}
                          </p>

                        </div>

                      )}

                    </div>

                  ))}

                </div>

              )}

            </div>

          )}

        </section>


        <section className="grid grid-cols-1 md:grid-cols-3 gap-5">

          <button
            onClick={() =>
              navigate("/marketplace")
            }
            className="bg-white border border-gray-200 rounded-2xl p-6 text-left hover:shadow-lg transition group"
          >

            <div className="text-3xl">
              🔍
            </div>

            <h3 className="font-bold text-lg mt-4">
              Browse Marketplace
            </h3>

            <p className="text-gray-500 text-sm mt-1">
              Find clothes from other users.
            </p>

            <p className="font-semibold text-sm mt-4 group-hover:underline">
              Explore →
            </p>

          </button>

          <button
            onClick={() =>
              navigate("/add-clothing")
            }
            className="bg-white border border-gray-200 rounded-2xl p-6 text-left hover:shadow-lg transition group"
          >

            <div className="text-3xl">
              ➕
            </div>

            <h3 className="font-bold text-lg mt-4">
              Add Clothing
            </h3>

            <p className="text-gray-500 text-sm mt-1">
              List something you want to swap.
            </p>

            <p className="font-semibold text-sm mt-4 group-hover:underline">
              Create Listing →
            </p>

          </button>

          <button
            onClick={() =>
              navigate("/swap-requests")
            }
            className="bg-white border border-gray-200 rounded-2xl p-6 text-left hover:shadow-lg transition group"
          >

            <div className="text-3xl">
              🔄
            </div>

            <h3 className="font-bold text-lg mt-4">
              Swap Requests
            </h3>

            <p className="text-gray-500 text-sm mt-1">
              Manage all your swap requests.
            </p>

            <p className="font-semibold text-sm mt-4 group-hover:underline">
              Manage →
            </p>

          </button>

        </section>

      </main>

    </div>
  );
}

export default Dashboard;