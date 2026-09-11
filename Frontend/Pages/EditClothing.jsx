import { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate, useParams } from "react-router-dom";

function EditClothing() {
  const navigate = useNavigate();
  const { id } = useParams();


  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const [formData, setFormData] = useState({
    title: "",
    description: "",
    category: "",
    subCategory: "",
    brand: "",
    size: "",
    gender: "",
    condition: "",
    color: "",
    estimatedValue: "",
    location: "",
    status: "Available",
  });

  const [images, setImages] = useState([]);
  const [newImages, setNewImages] = useState([]);


  useEffect(() => {
    const fetchClothing = async () => {
      try {
        setLoading(true);
        setError("");

        const response = await axios.get(
          `${import.meta.env.VITE_API_URL}/clothing/getclothing/${id}`,
          {
            withCredentials: true,
          }
        );

        console.log("Clothing:", response.data);

        const item =
          response.data?.clothing ||
          response.data?.item ||
          response.data;

        if (!item) {
          setError("Clothing not found");
          return;
        }


        let locationValue = "";

        if (typeof item.location === "object") {
          locationValue =
            item.location?.city ||
            "";
        } else {
          locationValue =
            item.location ||
            "";
        }

        setFormData({
          title: item.title || "",
          description: item.description || "",
          category: item.category || "",
          subCategory: item.subCategory || "",
          brand: item.brand || "",
          size: item.size || "",
          gender: item.gender || "",
          condition: item.condition || "",
          color: item.color || "",
          estimatedValue:
            item.estimatedValue || "",
          location: locationValue,
          status: item.status || "Available",
        });

        setImages(
          Array.isArray(item.images)
            ? item.images
            : []
        );

      } catch (err) {
        console.error(
          "Fetch clothing error:",
          err.response?.data || err.message
        );

        setError(
          err.response?.data?.message ||
            "Failed to load clothing"
        );
      } finally {
        setLoading(false);
      }
    };

    if (id) {
      fetchClothing();
    }
  }, [id]);


  const handleChange = (e) => {
    const { name, value } = e.target;

    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };


  const handleImageChange = (e) => {
    const selectedFiles = Array.from(
      e.target.files || []
    );

    if (selectedFiles.length === 0) {
      return;
    }

    const totalImages =
      images.length + newImages.length;

    if (
      totalImages + selectedFiles.length >
      5
    ) {
      setError(
        "You can have maximum 5 images."
      );
      return;
    }

    setNewImages((prev) => [
      ...prev,
      ...selectedFiles,
    ]);

    setError("");
  };


  const removeOldImage = (index) => {
    setImages((prev) =>
      prev.filter((_, i) => i !== index)
    );
  };


  const removeNewImage = (index) => {
    setNewImages((prev) =>
      prev.filter((_, i) => i !== index)
    );
  };


  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      setSaving(true);
      setError("");
      setSuccess("");


      if (!formData.title.trim()) {
        setError("Title is required.");
        setSaving(false);
        return;
      }

      if (!formData.category) {
        setError("Category is required.");
        setSaving(false);
        return;
      }

      if (!formData.size) {
        setError("Size is required.");
        setSaving(false);
        return;
      }

      if (!formData.gender) {
        setError("Gender is required.");
        setSaving(false);
        return;
      }

      if (!formData.condition) {
        setError("Condition is required.");
        setSaving(false);
        return;
      }


      const data = new FormData();

      data.append(
        "title",
        formData.title.trim()
      );

      data.append(
        "description",
        formData.description.trim()
      );

      data.append(
        "category",
        formData.category
      );

      data.append(
        "subCategory",
        formData.subCategory
      );

      data.append(
        "brand",
        formData.brand.trim()
      );

      data.append(
        "size",
        formData.size
      );

      data.append(
        "gender",
        formData.gender
      );

      data.append(
        "condition",
        formData.condition
      );

      data.append(
        "color",
        formData.color.trim()
      );

      data.append(
        "estimatedValue",
        formData.estimatedValue
      );

      data.append(
        "location",
        formData.location.trim()
      );

      data.append(
        "status",
        formData.status
      );


      data.append(
        "existingImages",
        JSON.stringify(images)
      );


      newImages.forEach((image) => {
        data.append("images", image);
      });

      console.log(
        "Updating clothing..."
      );


      const response = await axios.put(
        `${import.meta.env.VITE_API_URL}/clothing/update/${id}`,
        data,
        {
          withCredentials: true,
          headers: {
            "Content-Type":
              "multipart/form-data",
          },
        }
      );

      console.log(
        "Update response:",
        response.data
      );

      setSuccess(
        "Clothing updated successfully!"
      );


      setTimeout(() => {
        navigate(`/clothing/${id}`);
      }, 1000);

    } catch (err) {
      console.error(
        "Update clothing error:",
        err.response?.data || err.message
      );

      setError(
        err.response?.data?.message ||
          "Failed to update clothing"
      );
    } finally {
      setSaving(false);
    }
  };


  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">

        <div className="text-center">

          <div className="w-14 h-14 border-4 border-gray-200 border-t-black rounded-full animate-spin mx-auto"></div>

          <p className="mt-5 text-gray-600 font-medium">
            Loading clothing...
          </p>

        </div>

      </div>
    );
  }


  return (
    <div className="min-h-screen bg-gray-50">


      <section className="bg-black text-white">

        <div className="max-w-5xl mx-auto px-6 py-12">

          <p className="text-gray-400 uppercase tracking-widest text-sm font-medium mb-2">
            Manage Listing
          </p>

          <h1 className="text-4xl md:text-5xl font-bold">
            Edit Clothing
          </h1>

          <p className="text-gray-400 mt-3 text-lg">
            Update your clothing listing details.
          </p>

        </div>

      </section>


      <main className="max-w-5xl mx-auto px-4 sm:px-6 py-8">

        {/* SUCCESS */}

        {success && (
          <div className="bg-green-50 border border-green-200 rounded-xl p-4 mb-6">

            <p className="text-green-700 font-medium">
              ✅ {success}
            </p>

          </div>
        )}

        {/* ERROR */}

        {error && (
          <div className="bg-red-50 border border-red-200 rounded-xl p-4 mb-6">

            <p className="text-red-700 font-medium">
              ⚠️ {error}
            </p>

          </div>
        )}

        <form
          onSubmit={handleSubmit}
          className="bg-white rounded-2xl border border-gray-200 shadow-sm p-6 md:p-8"
        >


          <div className="mb-8">

            <h2 className="text-xl font-bold text-gray-900">
              Basic Information
            </h2>

            <p className="text-gray-500 text-sm mt-1">
              Update the basic details of your clothing.
            </p>

          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">

            {/* TITLE */}

            <div className="md:col-span-2">

              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Title *
              </label>

              <input
                type="text"
                name="title"
                value={formData.title}
                onChange={handleChange}
                placeholder="Example: Black Denim Jacket"
                className="w-full border border-gray-300 rounded-xl px-4 py-3 outline-none focus:border-black focus:ring-1 focus:ring-black"
              />

            </div>

            {/* DESCRIPTION */}

            <div className="md:col-span-2">

              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Description
              </label>

              <textarea
                name="description"
                value={formData.description}
                onChange={handleChange}
                rows="5"
                placeholder="Describe your clothing..."
                className="w-full border border-gray-300 rounded-xl px-4 py-3 outline-none focus:border-black focus:ring-1 focus:ring-black resize-none"
              />

            </div>

            {/* CATEGORY */}

            <div>

              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Category *
              </label>

              <select
                name="category"
                value={formData.category}
                onChange={handleChange}
                className="w-full border border-gray-300 rounded-xl px-4 py-3 bg-white outline-none focus:border-black focus:ring-1 focus:ring-black"
              >

                <option value="">
                  Select Category
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

            {/* SUB CATEGORY */}

            <div>

              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Sub Category
              </label>

              <input
                type="text"
                name="subCategory"
                value={formData.subCategory}
                onChange={handleChange}
                placeholder="Example: Casual"
                className="w-full border border-gray-300 rounded-xl px-4 py-3 outline-none focus:border-black focus:ring-1 focus:ring-black"
              />

            </div>

            {/* BRAND */}

            <div>

              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Brand
              </label>

              <input
                type="text"
                name="brand"
                value={formData.brand}
                onChange={handleChange}
                placeholder="Example: Levi's"
                className="w-full border border-gray-300 rounded-xl px-4 py-3 outline-none focus:border-black focus:ring-1 focus:ring-black"
              />

            </div>

            {/* COLOR */}

            <div>

              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Color
              </label>

              <input
                type="text"
                name="color"
                value={formData.color}
                onChange={handleChange}
                placeholder="Example: Black"
                className="w-full border border-gray-300 rounded-xl px-4 py-3 outline-none focus:border-black focus:ring-1 focus:ring-black"
              />

            </div>

            {/* SIZE */}

            <div>

              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Size *
              </label>

              <select
                name="size"
                value={formData.size}
                onChange={handleChange}
                className="w-full border border-gray-300 rounded-xl px-4 py-3 bg-white outline-none focus:border-black focus:ring-1 focus:ring-black"
              >

                <option value="">
                  Select Size
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

            {/* GENDER */}

            <div>

              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Gender *
              </label>

              <select
                name="gender"
                value={formData.gender}
                onChange={handleChange}
                className="w-full border border-gray-300 rounded-xl px-4 py-3 bg-white outline-none focus:border-black focus:ring-1 focus:ring-black"
              >

                <option value="">
                  Select Gender
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

            {/* CONDITION */}

            <div>

              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Condition *
              </label>

              <select
                name="condition"
                value={formData.condition}
                onChange={handleChange}
                className="w-full border border-gray-300 rounded-xl px-4 py-3 bg-white outline-none focus:border-black focus:ring-1 focus:ring-black"
              >

                <option value="">
                  Select Condition
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

            {/* VALUE */}

            <div>

              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Estimated Value
              </label>

              <input
                type="number"
                name="estimatedValue"
                value={formData.estimatedValue}
                onChange={handleChange}
                min="0"
                placeholder="Example: 1500"
                className="w-full border border-gray-300 rounded-xl px-4 py-3 outline-none focus:border-black focus:ring-1 focus:ring-black"
              />

            </div>

            {/* LOCATION */}

            <div className="md:col-span-2">

              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Location
              </label>

              <input
                type="text"
                name="location"
                value={formData.location}
                onChange={handleChange}
                placeholder="Example: Hyderabad"
                className="w-full border border-gray-300 rounded-xl px-4 py-3 outline-none focus:border-black focus:ring-1 focus:ring-black"
              />

            </div>

          </div>


          <div className="mt-8 pt-8 border-t border-gray-200">

            <h2 className="text-xl font-bold text-gray-900">
              Listing Status
            </h2>

            <div className="mt-4">

              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Status
              </label>

              <select
                name="status"
                value={formData.status}
                onChange={handleChange}
                className="w-full md:w-1/2 border border-gray-300 rounded-xl px-4 py-3 bg-white outline-none focus:border-black focus:ring-1 focus:ring-black"
              >

                <option value="Available">
                  Available
                </option>

                <option value="Inactive">
                  Inactive
                </option>

              </select>

            </div>

          </div>


          <div className="mt-8 pt-8 border-t border-gray-200">

            <h2 className="text-xl font-bold text-gray-900">
              Clothing Images
            </h2>

            <p className="text-gray-500 text-sm mt-1">
              You can keep existing images or add new ones.
              Maximum 5 images.
            </p>

            {/* EXISTING IMAGES */}

            {images.length > 0 && (

              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-4 mt-5">

                {images.map((image, index) => (

                  <div
                    key={index}
                    className="relative h-32 rounded-xl overflow-hidden bg-gray-100 border border-gray-200"
                  >

                    <img
                      src={image}
                      alt={`Existing ${index + 1}`}
                      className="w-full h-full object-cover"
                    />

                    <button
                      type="button"
                      onClick={() =>
                        removeOldImage(index)
                      }
                      className="absolute top-2 right-2 w-7 h-7 rounded-full bg-black text-white flex items-center justify-center hover:bg-red-600"
                    >
                      ×
                    </button>

                  </div>

                ))}

              </div>

            )}

            {/* NEW IMAGES */}

            {newImages.length > 0 && (

              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-4 mt-5">

                {newImages.map((image, index) => (

                  <div
                    key={index}
                    className="relative h-32 rounded-xl overflow-hidden bg-gray-100 border border-gray-200"
                  >

                    <img
                      src={URL.createObjectURL(image)}
                      alt={`New ${index + 1}`}
                      className="w-full h-full object-cover"
                    />

                    <button
                      type="button"
                      onClick={() =>
                        removeNewImage(index)
                      }
                      className="absolute top-2 right-2 w-7 h-7 rounded-full bg-black text-white flex items-center justify-center hover:bg-red-600"
                    >
                      ×
                    </button>

                  </div>

                ))}

              </div>

            )}

            {/* FILE INPUT */}

            {images.length + newImages.length < 5 && (

              <div className="mt-5">

                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Add New Images
                </label>

                <input
                  type="file"
                  accept="image/*"
                  multiple
                  onChange={handleImageChange}
                  className="w-full border border-gray-300 rounded-xl px-4 py-3 bg-white"
                />

                <p className="text-xs text-gray-400 mt-2">
                  Remaining slots:{" "}
                  {5 -
                    images.length -
                    newImages.length}
                </p>

              </div>

            )}

          </div>


          <div className="mt-10 pt-6 border-t border-gray-200 flex flex-col sm:flex-row gap-3 sm:justify-end">

            <button
              type="button"
              onClick={() =>
                navigate(-1)
              }
              className="border border-gray-300 px-7 py-3 rounded-xl font-semibold text-gray-700 hover:border-black hover:text-black transition"
            >
              Cancel
            </button>

            <button
              type="submit"
              disabled={saving}
              className="bg-black text-white px-7 py-3 rounded-xl font-semibold hover:bg-gray-800 disabled:opacity-50 disabled:cursor-not-allowed transition"
            >
              {saving
                ? "Saving Changes..."
                : "Save Changes"}
            </button>

          </div>

        </form>

      </main>

    </div>
  );
}

export default EditClothing;