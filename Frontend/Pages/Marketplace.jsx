import { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../Context/Auth";

function Marketplace() {
  const navigate = useNavigate();

  

  const [auth] = useAuth();

  const currentUser = auth?.user;

  const [clothing, setClothing] = useState([]);
  const [filteredClothing, setFilteredClothing] = useState([]);

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");



  const [search, setSearch] = useState("");
  const [category, setCategory] = useState("All");
  const [size, setSize] = useState("All");
  const [condition, setCondition] = useState("All");
  const [gender, setGender] = useState("All");


  const fetchClothing = async () => {
    try {
      setLoading(true);
      setError("");

      const response = await axios.get(
        `${import.meta.env.VITE_API_URL}/clothing/getallclothing`,
        {
          withCredentials: true,
        }
      );

      const data =
        response.data?.clothing ||
        response.data?.items ||
        response.data;

      if (!Array.isArray(data)) {
        setClothing([]);
        setFilteredClothing([]);
        return;
      }

      console.log("All clothing:", data);

      setClothing(data);
    } catch (err) {
      console.error("Fetch clothing error:", err);

      console.error("STATUS:", err.response?.status);
      console.error("DATA:", err.response?.data);

      setError(
        err.response?.data?.message ||
        "Failed to load clothing listings"
      );
    } finally {
      setLoading(false);
    }
  };

  

  useEffect(() => {
    fetchClothing();
  }, []);


  useEffect(() => {
    // AuthContext nunchi user ID inka load kakapothe
    // filtering cheyyakunda wait cheddam.
    if (!currentUser?._id && !currentUser?.id) {
      setFilteredClothing([]);
      return;
    }

    let result = [...clothing];

    // ==========================================
    // REMOVE LOGGED-IN USER'S PRODUCTS
    // ==========================================

    const currentUserId =
      currentUser?._id ||
      currentUser?.id;

    result = result.filter((item) => {
      const ownerId =
        item.owner?._id ||
        item.owner;

      return String(ownerId) !== String(currentUserId);
    });

    console.log(
      "After removing my products:",
      result
    );


    if (search.trim() !== "") {
      const searchText =
        search.toLowerCase().trim();

      result = result.filter((item) => {
        return (
          item.title
            ?.toLowerCase()
            .includes(searchText) ||

          item.brand
            ?.toLowerCase()
            .includes(searchText) ||

          item.category
            ?.toLowerCase()
            .includes(searchText) ||

          item.description
            ?.toLowerCase()
            .includes(searchText)
        );
      });
    }


    if (category !== "All") {
      result = result.filter(
        (item) =>
          item.category === category
      );
    }


    if (size !== "All") {
      result = result.filter(
        (item) =>
          item.size === size
      );
    }


    if (condition !== "All") {
      result = result.filter(
        (item) =>
          item.condition === condition
      );
    }


    if (gender !== "All") {
      result = result.filter(
        (item) =>
          item.gender === gender
      );
    }

    console.log(
      "Final Marketplace items:",
      result
    );

    setFilteredClothing(result);

  }, [
    clothing,
    currentUser?._id,
    currentUser?.id,
    search,
    category,
    size,
    condition,
    gender,
  ]);


  const resetFilters = () => {
    setSearch("");
    setCategory("All");
    setSize("All");
    setCondition("All");
    setGender("All");
  };


  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">

        <div className="text-center">

          <div className="w-14 h-14 border-4 border-gray-200 border-t-black rounded-full animate-spin mx-auto"></div>

          <p className="mt-5 text-gray-600 font-medium">
            Loading marketplace...
          </p>

        </div>

      </div>
    );
  }


  return (
    <div className="min-h-screen bg-gray-50">


      <section className="bg-black text-white">

        <div className="max-w-7xl mx-auto px-6 py-14">

          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-8">

            <div className="max-w-2xl">

              <p className="text-gray-400 uppercase tracking-widest text-sm font-medium mb-3">
                Clothing Exchange
              </p>

              <h1 className="text-4xl md:text-5xl font-bold tracking-tight">
                Find Your Next
                <span className="text-gray-400">
                  {" "}Perfect Swap
                </span>
              </h1>

              <p className="text-gray-400 mt-4 text-lg leading-relaxed">
                Explore clothing listed by the community and
                discover something you would love to swap.
              </p>

            </div>
            <div className="flex flex-wrap gap-3">

              <button
                onClick={() =>
                  navigate("/my-listings")
                }
                className="border border-gray-600 text-white px-6 py-3 rounded-xl font-semibold hover:bg-white hover:text-black transition"
              >
                My Listings
              </button>
              <button
                onClick={() =>
                  navigate("/add-clothing")
                }
                className="bg-white text-black px-7 py-3.5 rounded-xl font-semibold hover:bg-gray-200 transition duration-200 whitespace-nowrap"
              >
                + List Clothing
              </button>
            </div>

          </div>

        </div>

      </section>


      <main className="max-w-7xl mx-auto px-4 sm:px-6 py-8">


        <section className="bg-white rounded-2xl border border-gray-200 shadow-sm p-5 md:p-6 mb-8">

          {/* SEARCH */}

          <div className="relative">

            <span className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 text-xl">
              🔍
            </span>

            <input
              type="text"
              value={search}
              onChange={(e) =>
                setSearch(e.target.value)
              }
              placeholder="Search by title, brand, category..."
              className="w-full border border-gray-300 rounded-xl pl-12 pr-4 py-3.5 text-gray-800 outline-none focus:border-black focus:ring-1 focus:ring-black transition"
            />

          </div>

          {/* FILTERS */}

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mt-5">

            {/* CATEGORY */}

            <div>

              <label className="block text-sm font-medium text-gray-700 mb-2">
                Category
              </label>

              <select
                value={category}
                onChange={(e) =>
                  setCategory(e.target.value)
                }
                className="w-full border border-gray-300 rounded-lg px-4 py-3 bg-white outline-none focus:border-black focus:ring-1 focus:ring-black"
              >

                <option value="All">
                  All Categories
                </option>

                <option value="Shirts">
                  Shirts
                </option>

                <option value="T-Shirts">
                  T-Shirts
                </option>

                <option value="Jeans">
                  Jeans
                </option>

                <option value="Dresses">
                  Dresses
                </option>

                <option value="Jackets">
                  Jackets
                </option>

                <option value="Trousers">
                  Trousers
                </option>

                <option value="Sweaters">
                  Sweaters
                </option>

                <option value="Others">
                  Others
                </option>

              </select>

            </div>

            {/* SIZE */}

            <div>

              <label className="block text-sm font-medium text-gray-700 mb-2">
                Size
              </label>

              <select
                value={size}
                onChange={(e) =>
                  setSize(e.target.value)
                }
                className="w-full border border-gray-300 rounded-lg px-4 py-3 bg-white outline-none focus:border-black focus:ring-1 focus:ring-black"
              >

                <option value="All">
                  All Sizes
                </option>

                <option value="XS">
                  XS
                </option>

                <option value="S">
                  S
                </option>

                <option value="M">
                  M
                </option>

                <option value="L">
                  L
                </option>

                <option value="XL">
                  XL
                </option>

                <option value="XXL">
                  XXL
                </option>

              </select>

            </div>

            {/* CONDITION */}

            <div>

              <label className="block text-sm font-medium text-gray-700 mb-2">
                Condition
              </label>

              <select
                value={condition}
                onChange={(e) =>
                  setCondition(e.target.value)
                }
                className="w-full border border-gray-300 rounded-lg px-4 py-3 bg-white outline-none focus:border-black focus:ring-1 focus:ring-black"
              >

                <option value="All">
                  All Conditions
                </option>

                <option value="New">
                  New
                </option>

                <option value="Like New">
                  Like New
                </option>

                <option value="Good">
                  Good
                </option>

                <option value="Fair">
                  Fair
                </option>

              </select>

            </div>

            {/* GENDER */}

            <div>

              <label className="block text-sm font-medium text-gray-700 mb-2">
                Gender
              </label>

              <select
                value={gender}
                onChange={(e) =>
                  setGender(e.target.value)
                }
                className="w-full border border-gray-300 rounded-lg px-4 py-3 bg-white outline-none focus:border-black focus:ring-1 focus:ring-black"
              >

                <option value="All">
                  All Genders
                </option>

                <option value="Men">
                  Men
                </option>

                <option value="Women">
                  Women
                </option>

                <option value="Unisex">
                  Unisex
                </option>

              </select>

            </div>

          </div>

          {/* FILTER BOTTOM */}

          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mt-6 pt-5 border-t border-gray-100">

            <p className="text-sm text-gray-500">
              Showing{" "}
              <span className="font-semibold text-gray-900">
                {filteredClothing.length}
              </span>{" "}
              items available for swap
            </p>
            <button
              onClick={resetFilters}
              className="text-sm font-semibold text-gray-600 hover:text-black transition"
            >
              Clear All Filters
            </button>

          </div>

        </section>


        {error && (

          <div className="bg-red-50 border border-red-200 rounded-xl p-4 mb-8">

            <div className="flex items-center gap-3">

              <span className="text-xl">
                ⚠️
              </span>

              <p className="text-red-700 font-medium">
                {error}
              </p>

            </div>

          </div>

        )}


        {filteredClothing.length === 0 && !error && (

          <div className="bg-white rounded-2xl border border-gray-200 p-12 md:p-16 text-center">

            <div className="w-20 h-20 bg-gray-100 rounded-full flex items-center justify-center mx-auto text-4xl">
              🔍
            </div>

            <h2 className="text-2xl font-bold text-gray-900 mt-6">
              No clothing found
            </h2>

            <p className="text-gray-500 mt-2 max-w-md mx-auto">
              We couldn't find anything matching your search
              or selected filters.
            </p>

            <button
              onClick={resetFilters}
              className="mt-6 bg-black text-white px-6 py-3 rounded-lg font-medium hover:bg-gray-800 transition"
            >
              Clear Filters
            </button>

          </div>

        )}


        {filteredClothing.length > 0 && (

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">

            {filteredClothing.map((item) => (

              <article
                key={item._id}
                className="bg-white rounded-2xl overflow-hidden border border-gray-200 shadow-sm hover:shadow-xl transition-all duration-300 group"
              >

                {/* IMAGE */}

                <div className="relative h-80 bg-gray-100 overflow-hidden">

                  {item.images?.length > 0 ? (

                    <img
                      src={item.images[0]}
                      alt={item.title}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    />

                  ) : (

                    <div className="w-full h-full flex items-center justify-center">

                      <div className="text-center text-gray-400">

                        <div className="text-6xl">
                          👕
                        </div>

                        <p className="mt-2 text-sm">
                          No image available
                        </p>

                      </div>

                    </div>

                  )}

                  {/* STATUS */}

                  <div className="absolute top-4 left-4">

                    <span
                      className={`px-3 py-1.5 rounded-full text-xs font-bold ${item.status === "Available"
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

                  {/* CATEGORY */}

                  <div className="absolute top-4 right-4">

                    <span className="bg-white/90 backdrop-blur-sm text-gray-800 px-3 py-1.5 rounded-full text-xs font-semibold">
                      {item.category}
                    </span>

                  </div>

                </div>

                {/* CARD CONTENT */}

                <div className="p-5">

                  <h2 className="text-lg font-bold text-gray-900 truncate">
                    {item.title}
                  </h2>

                  <p className="text-sm text-gray-500 mt-1">
                    {item.brand || "Brand not specified"}
                  </p>

                  {/* DETAILS */}

                  <div className="grid grid-cols-2 gap-y-4 gap-x-3 mt-5">

                    <div>

                      <p className="text-xs text-gray-400 uppercase tracking-wide">
                        Size
                      </p>

                      <p className="text-sm font-semibold text-gray-800 mt-1">
                        {item.size || "-"}
                      </p>

                    </div>

                    <div>

                      <p className="text-xs text-gray-400 uppercase tracking-wide">
                        Condition
                      </p>

                      <p className="text-sm font-semibold text-gray-800 mt-1">
                        {item.condition || "-"}
                      </p>

                    </div>

                    <div>

                      <p className="text-xs text-gray-400 uppercase tracking-wide">
                        Gender
                      </p>

                      <p className="text-sm font-semibold text-gray-800 mt-1">
                        {item.gender || "-"}
                      </p>

                    </div>

                    <div>

                      <p className="text-xs text-gray-400 uppercase tracking-wide">
                        Value
                      </p>

                      <p className="text-sm font-bold text-gray-900 mt-1">
                        ₹{item.estimatedValue || 0}
                      </p>

                    </div>

                  </div>

                  {/* LOCATION */}

                  <div className="mt-5 pt-4 border-t border-gray-100">

                    <p className="text-sm text-gray-500 truncate">

                      📍{" "}

                      {typeof item.location === "object"
                        ? item.location?.city ||
                        "Location unavailable"
                        : item.location ||
                        "Location unavailable"}

                    </p>

                  </div>

                  {/* VIEW BUTTON */}

                  <button
                    onClick={() =>
                      navigate(`/clothing/${item._id}`)
                    }
                    className="w-full mt-5 bg-black text-white py-3 rounded-xl font-semibold hover:bg-gray-800 active:scale-[0.98] transition"
                  >
                    View Details
                  </button>

                </div>

              </article>

            ))}

          </div>

        )}

      </main>

    </div>
  );
}

export default Marketplace;