import { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate, useParams } from "react-router-dom";
import { useAuth } from "../Context/Auth";


function SwapRequest() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [auth] = useAuth();
  const currentUser = auth?.user

  const [requestedItem, setRequestedItem] = useState(null);
  const [myListings, setMyListings] = useState([]);

  const [selectedItem, setSelectedItem] = useState("");
  const [message, setMessage] = useState("");

  const [loading, setLoading] = useState(true);
  const [sending, setSending] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  // ==========================================
  // FETCH REQUESTED ITEM + MY LISTINGS
  // ==========================================

  const fetchData = async () => {
    try {
      setLoading(true);
      setError("");

      const [requestedResponse, listingsResponse] =
        await Promise.all([
          axios.get(
            `${import.meta.env.VITE_API_URL}/clothing/getclothing/${id}`,
            {
              withCredentials: true,
            }
          ),

          axios.get(
            `${import.meta.env.VITE_API_URL}/clothing/mylistings`,
            {
              withCredentials: true,
            }
          ),
        ]);

      // ==========================================
      // REQUESTED ITEM
      // ==========================================

      const requestedData =
        requestedResponse.data?.clothing ||
        requestedResponse.data;

      // ==========================================
      // MY LISTINGS
      // ==========================================

      const listingsData =
        listingsResponse.data?.clothing ||
        listingsResponse.data;

      // Make sure requested item exists
      if (!requestedData || !requestedData._id) {
        setError("Clothing item not found.");
        return;
      }

      // ==========================================
      // CHECK ITEM OWNER
      // ==========================================

      const requestedOwnerId =
        requestedData.owner?._id ||
        requestedData.owner;

      const currentUserId =
        currentUser?._id ||
        currentUser?.id;

      console.log("================================");
      console.log("Current User ID:", currentUserId);
      console.log("Requested Item ID:", requestedData._id);
      console.log("Requested Item Owner ID:", requestedOwnerId);
      console.log("================================");

      // ==========================================
      // USER CANNOT REQUEST OWN ITEM
      // ==========================================

      if (
        currentUserId &&
        requestedOwnerId &&
        String(currentUserId) === String(requestedOwnerId)
      ) {
        setError("You cannot request your own clothing.");

        setRequestedItem({
          ...requestedData,
          isOwnItem: true,
        });

        setMyListings([]);

        return;
      }

      // ==========================================
      // SET REQUESTED ITEM
      // ==========================================

      setRequestedItem(requestedData);

      // ==========================================
      // FILTER MY AVAILABLE CLOTHES
      // ==========================================

      const availableListings = Array.isArray(listingsData)
        ? listingsData.filter(
          (item) =>
            item.status === "Available" &&
            String(item._id) !== String(id)
        )
        : [];

      console.log(
        "Available items to offer:",
        availableListings
      );

      setMyListings(availableListings);

    } catch (err) {
      console.error("================================");
      console.error("FETCH SWAP DATA ERROR");
      console.error("================================");

      console.error("STATUS:", err.response?.status);
      console.error("DATA:", err.response?.data);
      console.error("MESSAGE:", err.message);

      setError(
        err.response?.data?.message ||
        err.message ||
        "Failed to load swap request details"
      );
    } finally {
      setLoading(false);
    }
  };
  useEffect(() => {

    fetchData();
  }, [id, currentUser]);

  // ==========================================
  // SEND REQUEST
  // ==========================================

  const handleSubmit = async (e) => {
    e.preventDefault();

    setError("");
    setSuccess("");

    if (!selectedItem) {
      setError("Please select a clothing item to offer.");
      return;
    }

    try {
      setSending(true);

      await axios.post(
        `${import.meta.env.VITE_API_URL}/swap/create`,
        {
          requestedItem: id,
          offeredItem: selectedItem,
          message: message.trim(),
        },
        {
          withCredentials: true,
        }
      );

      setSuccess(
        "Swap request sent successfully!"
      );

      setSelectedItem("");
      setMessage("");

      // Go back after a short delay
      setTimeout(() => {
        navigate("/marketplace");
      }, 1500);

    } catch (err) {
      console.error("Send swap request error:", err);
      console.error("Swap request response:", {
        status: err.response?.status,
        data: err.response?.data,
      });

      setError(
        err.response?.data?.message ||
        "Failed to send swap request"
      );
    } finally {
      setSending(false);
    }
  };


  
  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">

        <div className="text-center">

          <div className="w-14 h-14 border-4 border-gray-200 border-t-black rounded-full animate-spin mx-auto"></div>

          <p className="mt-5 text-gray-600 font-medium">
            Preparing swap request...
          </p>

        </div>

      </div>
    );
  }




  if (!requestedItem) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center px-6">

        <div className="bg-white rounded-2xl border p-10 text-center max-w-md">

          <div className="text-5xl">
            ⚠️
          </div>

          <h2 className="text-2xl font-bold mt-5">
            Item not found
          </h2>

          <p className="text-gray-500 mt-2">
            {error || "Unable to load this clothing item."}
          </p>

          <button
            onClick={() => navigate("/marketplace")}
            className="mt-6 bg-black text-white px-6 py-3 rounded-lg"
          >
            Back to Marketplace
          </button>

        </div>

      </div>
    );
  }

  const isOwnItem = requestedItem.isOwnItem === true;


  return (
    <div className="min-h-screen bg-gray-50">

      
      <div className="bg-white border-b">

        <div className="max-w-6xl mx-auto px-6 py-5">

          <button
            onClick={() =>
              navigate(`/clothing/${id}`)
            }
            className="text-gray-600 hover:text-black font-medium"
          >
            ← Back to Item
          </button>

        </div>

      </div>


      

      <main className="max-w-6xl mx-auto px-4 sm:px-6 py-10">

        <div className="mb-8">

          <p className="text-sm uppercase tracking-widest text-gray-400 font-semibold">
            Clothing Exchange
          </p>

          <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mt-2">
            Request a Swap
          </h1>

          <p className="text-gray-500 mt-2">
            Choose one of your clothing items to offer
            in exchange.
          </p>

        </div>


        

        {error && (
          <div className="mb-6 bg-red-50 border border-red-200 text-red-700 px-5 py-4 rounded-xl">
            ⚠️ {error}
          </div>
        )}

        {success && (
          <div className="mb-6 bg-green-50 border border-green-200 text-green-700 px-5 py-4 rounded-xl">
            ✅ {success}
          </div>
        )}

        {isOwnItem ? (
          <div className="bg-yellow-50 border border-yellow-200 text-yellow-800 rounded-xl p-5 mb-6">
            ⚠️ You cannot request your own clothing item.
          </div>
        ) : (
          <form onSubmit={handleSubmit}>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">


              

              <div>

                <h2 className="text-lg font-bold text-gray-900 mb-4">
                  You Want
                </h2>

                <div className="bg-white rounded-2xl overflow-hidden border border-gray-200 shadow-sm">

                  {/* Image */}

                  <div className="h-96 bg-gray-100">

                    {requestedItem.images?.length > 0 ? (

                      <img
                        src={requestedItem.images[0]}
                        alt={requestedItem.title}
                        className="w-full h-full object-cover"
                      />

                    ) : (

                      <div className="h-full flex items-center justify-center text-gray-400">

                        <div className="text-center">

                          <div className="text-6xl">
                            👕
                          </div>

                          <p className="mt-2">
                            No image
                          </p>

                        </div>

                      </div>

                    )}

                  </div>


                  {/* Details */}

                  <div className="p-6">

                    <div className="flex items-start justify-between gap-4">

                      <div>

                        <h3 className="text-xl font-bold text-gray-900">
                          {requestedItem.title}
                        </h3>

                        <p className="text-gray-500 mt-1">
                          {requestedItem.brand}
                        </p>

                      </div>

                      <span className="bg-green-100 text-green-700 px-3 py-1.5 rounded-full text-xs font-bold">
                        {requestedItem.status}
                      </span>

                    </div>


                    <div className="grid grid-cols-2 gap-4 mt-6">

                      <div>
                        <p className="text-xs text-gray-400">
                          Category
                        </p>
                        <p className="font-semibold mt-1">
                          {requestedItem.category}
                        </p>
                      </div>

                      <div>
                        <p className="text-xs text-gray-400">
                          Size
                        </p>
                        <p className="font-semibold mt-1">
                          {requestedItem.size}
                        </p>
                      </div>

                      <div>
                        <p className="text-xs text-gray-400">
                          Condition
                        </p>
                        <p className="font-semibold mt-1">
                          {requestedItem.condition}
                        </p>
                      </div>

                      <div>
                        <p className="text-xs text-gray-400">
                          Value
                        </p>
                        <p className="font-semibold mt-1">
                          ₹{requestedItem.estimatedValue}
                        </p>
                      </div>

                    </div>

                  </div>

                </div>

              </div>


              

              <div>

                <h2 className="text-lg font-bold text-gray-900 mb-4">
                  You Offer
                </h2>


                {myListings.length === 0 ? (

                  <div className="bg-white border border-gray-200 rounded-2xl p-8 text-center">

                    <div className="text-5xl">
                      👕
                    </div>

                    <h3 className="text-xl font-bold text-gray-900 mt-5">
                      No items available
                    </h3>

                    <p className="text-gray-500 mt-2">
                      You need at least one available
                      clothing item to make a swap.
                    </p>

                    <button
                      type="button"
                      onClick={() =>
                        navigate("/add-clothing")
                      }
                      className="mt-6 bg-black text-white px-6 py-3 rounded-lg font-medium hover:bg-gray-800"
                    >
                      + Add Clothing
                    </button>

                  </div>

                ) : (

                  <div className="space-y-4">

                    {myListings.map((item) => {

                      const selected =
                        selectedItem === item._id;

                      return (

                        <button
                          type="button"
                          key={item._id}
                          onClick={() =>
                            setSelectedItem(item._id)
                          }
                          className={`w-full text-left bg-white rounded-2xl border-2 overflow-hidden transition ${selected
                            ? "border-black shadow-lg"
                            : "border-gray-200 hover:border-gray-400"
                            }`}
                        >

                          <div className="flex">

                            {/* Image */}

                            <div className="w-32 h-32 flex-shrink-0 bg-gray-100">

                              {item.images?.length > 0 ? (

                                <img
                                  src={item.images[0]}
                                  alt={item.title}
                                  className="w-full h-full object-cover"
                                />

                              ) : (

                                <div className="w-full h-full flex items-center justify-center text-3xl">
                                  👕
                                </div>

                              )}

                            </div>


                            {/* Details */}

                            <div className="p-4 flex-1">

                              <div className="flex justify-between gap-3">

                                <div>

                                  <h3 className="font-bold text-gray-900">
                                    {item.title}
                                  </h3>

                                  <p className="text-sm text-gray-500 mt-1">
                                    {item.brand}
                                  </p>

                                </div>


                                {selected && (
                                  <div className="w-6 h-6 bg-black text-white rounded-full flex items-center justify-center text-sm">
                                    ✓
                                  </div>
                                )}

                              </div>


                              <div className="flex flex-wrap gap-2 mt-3">

                                <span className="text-xs bg-gray-100 px-2.5 py-1 rounded-full">
                                  {item.size}
                                </span>

                                <span className="text-xs bg-gray-100 px-2.5 py-1 rounded-full">
                                  {item.condition}
                                </span>

                                <span className="text-xs bg-gray-100 px-2.5 py-1 rounded-full">
                                  ₹{item.estimatedValue}
                                </span>

                              </div>

                            </div>

                          </div>

                        </button>

                      );
                    })}

                  </div>

                )}


                {myListings.length > 0 && (

                  <div className="mt-6">

                    <label className="block text-sm font-semibold text-gray-800 mb-2">
                      Message
                      <span className="font-normal text-gray-400">
                        {" "}(optional)
                      </span>
                    </label>

                    <textarea
                      value={message}
                      onChange={(e) =>
                        setMessage(e.target.value)
                      }
                      maxLength={500}
                      rows={5}
                      placeholder="Write a message to the clothing owner..."
                      className="w-full border border-gray-300 rounded-xl px-4 py-3 outline-none resize-none focus:border-black focus:ring-1 focus:ring-black"
                    />

                    <p className="text-xs text-gray-400 text-right mt-1">
                      {message.length}/500
                    </p>

                  </div>

                )}



                {myListings.length > 0 && (

                  <button
                    type="submit"
                    disabled={sending || !selectedItem}
                    className="w-full mt-6 bg-black text-white py-4 rounded-xl font-semibold text-lg hover:bg-gray-800 disabled:bg-gray-300 disabled:cursor-not-allowed transition"
                  >
                    {sending
                      ? "Sending Request..."
                      : "🔄 Send Swap Request"}
                  </button>

                )}

              </div>

            </div>

          </form>

        )}
      </main>

    </div>
  );
}

export default SwapRequest;