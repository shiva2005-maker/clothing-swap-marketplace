import { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate, useParams } from "react-router-dom";
import { useAuth } from "../Context/Auth";

function ClothingDetails() {
    const { id } = useParams();
    const navigate = useNavigate();

    const [auth] = useAuth();

    const [item, setItem] = useState(null);
    const [selectedImage, setSelectedImage] = useState(0);

    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");

    

    const fetchItem = async () => {
        try {
            setLoading(true);
            setError("");

            const response = await axios.get(
                `${import.meta.env.VITE_API_URL}/clothing/getclothing/${id}`,
                {
                    withCredentials: true,
                }
            );

            const clothing =
                response.data.clothing ||
                response.data;

            setItem(clothing);

        } catch (err) {
            console.error("Fetch item error:", err);

            setError(
                err.response?.data?.message ||
                "Failed to load clothing details"
            );

        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchItem();
    }, [id]);


    if (loading) {
        return (
            <div className="min-h-screen bg-gray-50 flex items-center justify-center px-4">

                <div className="text-center">

                    <div className="w-14 h-14 border-4 border-gray-200 border-t-black rounded-full animate-spin mx-auto"></div>

                    <p className="mt-5 text-gray-600 font-medium">
                        Loading clothing details...
                    </p>

                </div>

            </div>
        );
    }



    if (error) {
        return (
            <div className="min-h-screen bg-gray-50 flex items-center justify-center px-6">

                <div className="bg-white border border-gray-200 rounded-2xl p-8 sm:p-10 text-center max-w-md w-full shadow-sm">

                    <div className="text-5xl">
                        ⚠️
                    </div>

                    <h2 className="text-2xl font-bold text-gray-900 mt-5">
                        Unable to load item
                    </h2>

                    <p className="text-gray-500 mt-2">
                        {error}
                    </p>

                    <button
                        onClick={() => navigate("/marketplace")}
                        className="mt-6 bg-black text-white px-6 py-3 rounded-lg font-medium hover:bg-gray-800 transition"
                    >
                        Back to Marketplace
                    </button>

                </div>

            </div>
        );
    }


    if (!item) {
        return null;
    }



    const images =
        Array.isArray(item.images)
            ? item.images
            : [];



    const currentUserId =
        auth?.user?._id ||
        auth?.user?.id;



    const owner =
        item.owner &&
        typeof item.owner === "object"
            ? item.owner
            : null;

    const ownerId =
        owner?._id ||
        item.owner;


    const isOwnItem =
        currentUserId &&
        ownerId &&
        String(currentUserId) ===
        String(ownerId);


    
    let location = "Location unavailable";

 
    if (
        item.locationName &&
        typeof item.locationName === "string"
    ) {
        location = item.locationName;
    }

    

    else if (
        typeof item.location === "string" &&
        item.location.trim() !== ""
    ) {
        location = item.location;
    }



    else if (
        item.location &&
        typeof item.location === "object"
    ) {

        if (item.location.city) {
            location = item.location.city;
        }

        else if (item.location.displayName) {
            location = item.location.displayName;
        }

        else if (
            Array.isArray(item.location.coordinates) &&
            item.location.coordinates.length === 2
        ) {
            location = "Location available";
        }
    }


    

    const getStatusStyle = () => {

        switch (item.status) {

            case "Available":
                return "bg-green-100 text-green-700";

            case "Pending Swap":
                return "bg-yellow-100 text-yellow-700";

            case "Swapped":
                return "bg-blue-100 text-blue-700";

            case "Inactive":
                return "bg-gray-100 text-gray-700";

            default:
                return "bg-gray-100 text-gray-700";
        }
    };


    return (

        <div className="min-h-screen bg-gray-50">


            

            <div className="bg-white border-b border-gray-200">

                <div className="max-w-7xl mx-auto px-4 sm:px-6 py-4">

                    <button
                        onClick={() => navigate("/marketplace")}
                        className="text-gray-600 hover:text-black font-medium transition"
                    >
                        ← Back to Marketplace
                    </button>

                </div>

            </div>


            

            <main className="max-w-7xl mx-auto px-4 sm:px-6 py-8">

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12">


                    

                    <div>

                        <div className="bg-white rounded-2xl overflow-hidden border border-gray-200 shadow-sm">

                            {images.length > 0 ? (

                                <img
                                    src={images[selectedImage]}
                                    alt={item.title}
                                    className="w-full h-[350px] sm:h-[450px] lg:h-[520px] object-cover"
                                />

                            ) : (

                                <div className="h-[350px] sm:h-[450px] lg:h-[520px] bg-gray-100 flex items-center justify-center">

                                    <div className="text-center text-gray-400">

                                        <div className="text-7xl">
                                            👕
                                        </div>

                                        <p className="mt-3">
                                            No image available
                                        </p>

                                    </div>

                                </div>

                            )}

                        </div>


                        {/* Thumbnails */}

                        {images.length > 1 && (

                            <div className="flex gap-3 mt-4 overflow-x-auto pb-2">

                                {images.map((image, index) => (

                                    <button
                                        key={index}
                                        onClick={() =>
                                            setSelectedImage(index)
                                        }
                                        className={`flex-shrink-0 w-20 h-20 rounded-lg overflow-hidden border-2 transition ${
                                            selectedImage === index
                                                ? "border-black"
                                                : "border-transparent"
                                        }`}
                                    >

                                        <img
                                            src={image}
                                            alt={`${item.title} ${index + 1}`}
                                            className="w-full h-full object-cover"
                                        />

                                    </button>

                                ))}

                            </div>

                        )}

                    </div>


                 

                    <div>


                        {/* STATUS */}

                        <div className="flex flex-wrap items-center gap-3 mb-4">

                            <span
                                className={`px-3 py-1.5 rounded-full text-xs font-bold ${getStatusStyle()}`}
                            >
                                {item.status}
                            </span>

                            {item.category && (

                                <span className="text-sm text-gray-400">
                                    {item.category}
                                </span>

                            )}

                        </div>


                        {/* TITLE */}

                        <h1 className="text-3xl sm:text-4xl font-bold text-gray-900 leading-tight">
                            {item.title}
                        </h1>


                        {/* BRAND */}

                        <p className="text-lg text-gray-500 mt-2">
                            {item.brand || "Brand not specified"}
                        </p>


                        {/* OWNER */}

                        {owner && (

                            <div className="mt-5 flex items-center gap-3">

                                <img
                                    src={
                                        owner.profileimage ||
                                        "https://cdn.pixabay.com/photo/2015/10/05/22/37/blank-profile-picture-973460_1280.png"
                                    }
                                    alt="Owner"
                                    className="w-10 h-10 rounded-full object-cover border border-gray-200"
                                />

                                <div>

                                    <p className="text-xs text-gray-400 uppercase tracking-wide">
                                        Listed by
                                    </p>

                                    <p className="font-semibold text-gray-800">
                                        {owner.name || "User"}
                                    </p>

                                </div>

                            </div>

                        )}


                        {/* VALUE */}

                        <div className="mt-6">

                            <p className="text-sm text-gray-400 uppercase tracking-wide">
                                Estimated Swap Value
                            </p>

                            <p className="text-3xl font-bold text-gray-900 mt-1">
                                ₹{item.estimatedValue || 0}
                            </p>

                        </div>


                        <div className="border-t border-gray-200 my-7"></div>


                        {/* SPECIFICATIONS */}

                        <div>

                            <h2 className="text-lg font-bold text-gray-900 mb-5">
                                Item Details
                            </h2>

                            <div className="grid grid-cols-2 gap-4">


                                {/* CATEGORY */}

                                <div className="bg-white rounded-xl border border-gray-200 p-4">

                                    <p className="text-xs text-gray-400 uppercase">
                                        Category
                                    </p>

                                    <p className="font-semibold text-gray-800 mt-1">
                                        {item.category || "-"}
                                    </p>

                                </div>


                                {/* SUB CATEGORY */}

                                <div className="bg-white rounded-xl border border-gray-200 p-4">

                                    <p className="text-xs text-gray-400 uppercase">
                                        Sub Category
                                    </p>

                                    <p className="font-semibold text-gray-800 mt-1">
                                        {item.subCategory || "-"}
                                    </p>

                                </div>


                                {/* SIZE */}

                                <div className="bg-white rounded-xl border border-gray-200 p-4">

                                    <p className="text-xs text-gray-400 uppercase">
                                        Size
                                    </p>

                                    <p className="font-semibold text-gray-800 mt-1">
                                        {item.size || "-"}
                                    </p>

                                </div>


                                {/* GENDER */}

                                <div className="bg-white rounded-xl border border-gray-200 p-4">

                                    <p className="text-xs text-gray-400 uppercase">
                                        Gender
                                    </p>

                                    <p className="font-semibold text-gray-800 mt-1">
                                        {item.gender || "-"}
                                    </p>

                                </div>


                                {/* CONDITION */}

                                <div className="bg-white rounded-xl border border-gray-200 p-4">

                                    <p className="text-xs text-gray-400 uppercase">
                                        Condition
                                    </p>

                                    <p className="font-semibold text-gray-800 mt-1">
                                        {item.condition || "-"}
                                    </p>

                                </div>


                                {/* COLOR */}

                                <div className="bg-white rounded-xl border border-gray-200 p-4">

                                    <p className="text-xs text-gray-400 uppercase">
                                        Color
                                    </p>

                                    <p className="font-semibold text-gray-800 mt-1">
                                        {item.color || "-"}
                                    </p>

                                </div>

                            </div>

                        </div>



                        <div className="mt-6 bg-white border border-gray-200 rounded-xl p-4">

                            <p className="text-xs text-gray-400 uppercase tracking-wide">
                                Location
                            </p>

                            <p className="font-semibold text-gray-800 mt-1">
                                📍 {location}
                            </p>

                        </div>



                        <div className="mt-7">

                            <h2 className="text-lg font-bold text-gray-900 mb-3">
                                Description
                            </h2>

                            <p className="text-gray-600 leading-relaxed">
                                {item.description ||
                                    "No description provided for this item."}
                            </p>

                        </div>


                        

                        {isOwnItem && (

                            <div className="mt-8 bg-gray-100 border border-gray-200 rounded-xl p-4">

                                <p className="font-semibold text-gray-800">
                                    This is your clothing item.
                                </p>

                                <p className="text-sm text-gray-500 mt-1">
                                    You cannot send a swap request for your own item.
                                </p>

                                <button
                                    onClick={() =>
                                        navigate("/my-listings")
                                    }
                                    className="mt-4 border border-gray-300 bg-white px-5 py-2.5 rounded-lg text-sm font-medium hover:bg-gray-100 transition"
                                >
                                    View My Listings
                                </button>

                            </div>

                        )}



                        {!isOwnItem &&
                            item.status === "Available" && (

                                <button
                                    onClick={() =>
                                        navigate(
                                            `/swap-request/${item._id}`
                                        )
                                    }
                                    className="w-full mt-8 bg-black text-white py-4 rounded-xl font-semibold text-lg hover:bg-gray-800 active:scale-[0.99] transition"
                                >
                                    🔄 Request Swap
                                </button>

                            )}


                        {!isOwnItem &&
                            item.status !== "Available" && (

                                <div className="mt-8 bg-gray-100 border border-gray-200 text-gray-600 text-center py-4 rounded-xl font-medium">

                                    This item is currently unavailable for swapping.

                                </div>

                            )}

                    </div>

                </div>

            </main>

        </div>
    );
}

export default ClothingDetails;