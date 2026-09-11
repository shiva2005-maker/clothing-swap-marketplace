import { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

function MyListings() {
  const navigate = useNavigate();

  const [listings, setListings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const fetchMyListings = async () => {
    try {
      setLoading(true);
      setError("");

      const response = await axios.get(
        `${import.meta.env.VITE_API_URL}/clothing/mylistings`,
        {
          withCredentials: true,
        }
      );

      setListings(response.data.clothing || response.data);
    } catch (err) {
      console.error("Fetch listings error:", err);

      setError(
        err.response?.data?.message ||
          "Failed to fetch your clothing listings"
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchMyListings();
  }, []);

  const handleDelete = async (id) => {
    const confirmDelete = window.confirm(
      "Are you sure you want to delete this listing?"
    );

    if (!confirmDelete) return;

    try {
      await axios.delete(
        `${import.meta.env.VITE_API_URL}/clothing/delete/${id}`,
        {
          withCredentials: true,
        }
      );

      setListings((prevListings) =>
        prevListings.filter((item) => item._id !== id)
      );
    } catch (err) {
      console.error("Delete listing error:", err);

      setError(
        err.response?.data?.message || "Failed to delete the listing"
      );
    }
  };

  // Loading UI
  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="w-12 h-12 border-4 border-gray-300 border-t-black rounded-full animate-spin mx-auto"></div>

          <p className="mt-4 text-gray-600 text-lg">
            Loading your listings...
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">

      {/* Header */}
      <div className="bg-white border-b">
        <div className="max-w-7xl mx-auto px-6 py-8">

          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">

            <div>
              <h1 className="text-3xl font-bold text-gray-900">
                My Listings
              </h1>

              <p className="text-gray-500 mt-1">
                Manage the clothes you have listed for swapping.
              </p>
            </div>

            <button
              onClick={() => navigate("/add-clothing")}
              className="bg-black text-white px-6 py-3 rounded-lg font-medium hover:bg-gray-800 transition duration-200 shadow-sm"
            >
              + Add Clothing
            </button>

          </div>

        </div>
      </div>


      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-6 py-8">

        {/* Error */}
        {error && (
          <div className="mb-6 bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg">
            {error}
          </div>
        )}


        {/* Empty State */}
        {listings.length === 0 && !error && (
          <div className="bg-white rounded-2xl border border-gray-200 p-12 text-center shadow-sm">

            <div className="w-20 h-20 bg-gray-100 rounded-full flex items-center justify-center mx-auto text-4xl">
              👕
            </div>

            <h2 className="text-2xl font-semibold text-gray-900 mt-6">
              No listings yet
            </h2>

            <p className="text-gray-500 mt-2 max-w-md mx-auto">
              You haven't listed any clothing yet. Add your first item
              and start swapping with others.
            </p>

            <button
              onClick={() => navigate("/add-clothing")}
              className="mt-6 bg-black text-white px-6 py-3 rounded-lg font-medium hover:bg-gray-800 transition"
            >
              Add Your First Item
            </button>

          </div>
        )}


        {/* Listings */}
        {listings.length > 0 && (
          <>
            {/* Count */}
            <div className="flex items-center justify-between mb-6">
              <p className="text-gray-600">
                <span className="font-semibold text-gray-900">
                  {listings.length}
                </span>{" "}
                {listings.length === 1 ? "item" : "items"} listed
              </p>
            </div>


            {/* Cards */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">

              {listings.map((item) => (

                <div
                  key={item._id}
                  className="bg-white rounded-2xl overflow-hidden border border-gray-200 shadow-sm hover:shadow-lg transition duration-300 group"
                >

                  {/* Image */}
                  <div className="relative h-72 bg-gray-100 overflow-hidden">

                    {item.images && item.images.length > 0 ? (
                      <img
                        src={item.images[0]}
                        alt={item.title}
                        className="w-full h-full object-cover group-hover:scale-105 transition duration-500"
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center text-gray-400">
                        <div className="text-center">
                          <div className="text-5xl">👕</div>
                          <p className="mt-2">No Image</p>
                        </div>
                      </div>
                    )}


                    {/* Status Badge */}
                    <div className="absolute top-3 left-3">
                      <span
                        className={`px-3 py-1 rounded-full text-xs font-semibold ${
                          item.status === "Available"
                            ? "bg-green-100 text-green-700"
                            : item.status === "Pending Swap"
                            ? "bg-yellow-100 text-yellow-700"
                            : item.status === "Swapped"
                            ? "bg-blue-100 text-blue-700"
                            : "bg-gray-100 text-gray-700"
                        }`}
                      >
                        {item.status}
                      </span>
                    </div>

                  </div>


                  {/* Card Content */}
                  <div className="p-5">

                    <h2 className="text-lg font-semibold text-gray-900 truncate">
                      {item.title}
                    </h2>

                    <p className="text-sm text-gray-500 mt-1">
                      {item.brand}
                    </p>


                    {/* Details */}
                    <div className="grid grid-cols-2 gap-3 mt-4">

                      <div>
                        <p className="text-xs text-gray-400">
                          Size
                        </p>

                        <p className="text-sm font-medium text-gray-800">
                          {item.size}
                        </p>
                      </div>


                      <div>
                        <p className="text-xs text-gray-400">
                          Condition
                        </p>

                        <p className="text-sm font-medium text-gray-800">
                          {item.condition}
                        </p>
                      </div>


                      <div>
                        <p className="text-xs text-gray-400">
                          Category
                        </p>

                        <p className="text-sm font-medium text-gray-800">
                          {item.category}
                        </p>
                      </div>


                      <div>
                        <p className="text-xs text-gray-400">
                          Value
                        </p>

                        <p className="text-sm font-semibold text-gray-900">
                          ₹{item.estimatedValue}
                        </p>
                      </div>

                    </div>


                    {/* Location */}
                    <div className="mt-4 pt-4 border-t border-gray-100">

                      <p className="text-sm text-gray-500">
                        📍 {item.location || "Location not specified"}
                      </p>

                    </div>


                    {/* Buttons */}
                    <div className="flex gap-2 mt-5">

                      <button
                        onClick={() =>
                          navigate(`/clothing/${item._id}`)
                        }
                        className="flex-1 border border-gray-300 text-gray-800 py-2.5 rounded-lg text-sm font-medium hover:bg-gray-100 transition"
                      >
                        View
                      </button>


                      <button
                        onClick={() =>
                          navigate(`/edit-clothing/${item._id}`)
                        }
                        className="flex-1 bg-black text-white py-2.5 rounded-lg text-sm font-medium hover:bg-gray-800 transition"
                      >
                        Edit
                      </button>

                    </div>


                    {/* Delete */}
                    <button
                      onClick={() => handleDelete(item._id)}
                      className="w-full mt-2 py-2 text-sm font-medium text-red-600 hover:bg-red-50 rounded-lg transition"
                    >
                      Delete Listing
                    </button>

                  </div>

                </div>

              ))}

            </div>
          </>
        )}

      </main>

    </div>
  );
}

export default MyListings;