import { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

function AddClothing() {
  const navigate = useNavigate();

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
  });

  const [images, setImages] = useState([]);
  const [previewImages, setPreviewImages] = useState([]);

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  // =========================
  // CATEGORY WISE SIZE OPTIONS
  // =========================

  const sizeOptions = {
    "T-Shirts": ["XS", "S", "M", "L", "XL", "XXL"],

    "Shirts": ["XS", "S", "M", "L", "XL", "XXL"],

    "Jeans": ["28", "30", "32", "34", "36", "38", "40", "42"],

    "Trousers": ["28", "30", "32", "34", "36", "38", "40", "42"],

    "Jackets": ["XS", "S", "M", "L", "XL", "XXL"],

    "Dresses": ["XS", "S", "M", "L", "XL", "XXL"],

    "Skirts": ["XS", "S", "M", "L", "XL", "XXL"],

    "Sweaters": ["XS", "S", "M", "L", "XL", "XXL"],

    "Hoodies": ["XS", "S", "M", "L", "XL", "XXL"],

    "Shoes": ["6", "7", "8", "9", "10", "11", "12"],

    "Accessories": ["One Size"],

    "Other": ["XS", "S", "M", "L", "XL", "XXL"],
  };


  // =========================
  // HANDLE TEXT INPUTS
  // =========================

  const handleChange = (e) => {
    const { name, value } = e.target;

    setFormData((prev) => ({
      ...prev,
      [name]: value,

      // Category change ayithe old size clear
      ...(name === "category" && {
        size: "",
      }),
    }));

    setError("");
  };


  // =========================
  // HANDLE IMAGES
  // =========================

  const handleImageChange = (e) => {
    const files = Array.from(e.target.files);

    if (files.length > 5) {
      setError("You can upload maximum 5 images");
      return;
    }

    // Validate image size
    const invalidFile = files.find(
      (file) => file.size > 5 * 1024 * 1024
    );

    if (invalidFile) {
      setError("Each image must be less than 5MB");
      return;
    }

    setError("");
    setImages(files);

    const previews = files.map((file) =>
      URL.createObjectURL(file)
    );

    setPreviewImages(previews);
  };


  // =========================
  // SUBMIT FORM
  // =========================

  const handleSubmit = async (e) => {
    e.preventDefault();

    setError("");
    setSuccess("");

    if (
      !formData.title ||
      !formData.description ||
      !formData.category ||
      !formData.brand ||
      !formData.size ||
      !formData.gender ||
      !formData.condition ||
      !formData.estimatedValue ||
      !formData.location
    ) {
      setError("Please fill all required fields");
      return;
    }

    if (images.length === 0) {
      setError("Please upload at least one image");
      return;
    }

    if (Number(formData.estimatedValue) <= 0) {
      setError("Estimated value must be greater than 0");
      return;
    }

    try {
      setLoading(true);

      const data = new FormData();

      data.append("title", formData.title);
      data.append("description", formData.description);
      data.append("category", formData.category);
      data.append("subCategory", formData.subCategory);
      data.append("brand", formData.brand);
      data.append("size", formData.size);
      data.append("gender", formData.gender);
      data.append("condition", formData.condition);
      data.append("color", formData.color);
      data.append("estimatedValue", formData.estimatedValue);
      data.append("location", formData.location);

      images.forEach((image) => {
        data.append("images", image);
      });

      const response = await axios.post(
        `${import.meta.env.VITE_API_URL}/clothing/addclothing`,
        data,
        {
          withCredentials: true,
        }
      );

      console.log(response.data);

      setSuccess("Clothing listed successfully!");

      setFormData({
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
      });

      setImages([]);
      setPreviewImages([]);

      setTimeout(() => {
        navigate("/marketplace");
      }, 1000);

    } catch (err) {
      console.error("Create clothing error:", err);

      setError(
        err.response?.data?.message ||
        "Something went wrong while creating the listing"
      );

    } finally {
      setLoading(false);
    }
  };


  return (
    <div className="min-h-screen bg-gray-100 py-8 sm:py-10 lg:py-12 px-4">

      <div className="max-w-5xl mx-auto">


        <div className="mb-8">

          <button
            type="button"
            onClick={() => navigate(-1)}
            className="text-sm text-gray-500 hover:text-black transition mb-4"
          >
            ← Back
          </button>

          <h1 className="text-3xl sm:text-4xl font-bold text-black">
            Add Clothing
          </h1>

          <p className="text-gray-500 mt-2">
            List your clothing item and find something new to swap.
          </p>

        </div>



        <div className="bg-white rounded-2xl border border-gray-200 shadow-sm p-5 sm:p-8 lg:p-10">

   

          {error && (
            <div className="mb-6 bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg text-sm">
              ⚠️ {error}
            </div>
          )}

          {success && (
            <div className="mb-6 bg-green-50 border border-green-200 text-green-700 px-4 py-3 rounded-lg text-sm">
              ✓ {success}
            </div>
          )}


          <form onSubmit={handleSubmit}>

            <div>

              <h2 className="text-xl font-bold text-gray-900">
                Basic Information
              </h2>

              <p className="text-sm text-gray-500 mt-1">
                Tell others about the clothing item.
              </p>

            </div>


            <div className="grid grid-cols-1 md:grid-cols-2 gap-5 mt-6">



              <div className="md:col-span-2">

                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Title <span className="text-red-500">*</span>
                </label>

                <input
                  type="text"
                  name="title"
                  value={formData.title}
                  onChange={handleChange}
                  placeholder="Nike Dri-FIT T-Shirt"
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg outline-none focus:border-black focus:ring-1 focus:ring-black transition"
                />

              </div>



              <div className="md:col-span-2">

                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Description <span className="text-red-500">*</span>
                </label>

                <textarea
                  name="description"
                  value={formData.description}
                  onChange={handleChange}
                  placeholder="Describe the clothing item, how often it was used, any special details..."
                  rows={5}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg outline-none resize-none focus:border-black focus:ring-1 focus:ring-black transition"
                />

              </div>


   
              <div>

                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Category <span className="text-red-500">*</span>
                </label>

                <select
                  name="category"
                  value={formData.category}
                  onChange={handleChange}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg outline-none bg-white focus:border-black focus:ring-1 focus:ring-black transition"
                >

                  <option value="">
                    Select Category
                  </option>

                  <option value="T-Shirts">
                    T-Shirts
                  </option>

                  <option value="Shirts">
                    Shirts
                  </option>

                  <option value="Jeans">
                    Jeans
                  </option>

                  <option value="Trousers">
                    Trousers
                  </option>

                  <option value="Jackets">
                    Jackets
                  </option>

                  <option value="Dresses">
                    Dresses
                  </option>

                  <option value="Skirts">
                    Skirts
                  </option>

                  <option value="Sweaters">
                    Sweaters
                  </option>

                  <option value="Hoodies">
                    Hoodies
                  </option>

                  <option value="Shoes">
                    Shoes
                  </option>

                  <option value="Accessories">
                    Accessories
                  </option>

                  <option value="Other">
                    Other
                  </option>

                </select>

              </div>



              <div>

                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Sub Category
                </label>

                <input
                  type="text"
                  name="subCategory"
                  value={formData.subCategory}
                  onChange={handleChange}
                  placeholder="Sports T-Shirt"
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg outline-none focus:border-black focus:ring-1 focus:ring-black transition"
                />

              </div>


              <div>

                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Brand <span className="text-red-500">*</span>
                </label>

                <input
                  type="text"
                  name="brand"
                  value={formData.brand}
                  onChange={handleChange}
                  placeholder="Nike"
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg outline-none focus:border-black focus:ring-1 focus:ring-black transition"
                />

              </div>

              <div>

                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Size <span className="text-red-500">*</span>
                </label>

                <select
                  name="size"
                  value={formData.size}
                  onChange={handleChange}
                  disabled={!formData.category}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg outline-none bg-white focus:border-black focus:ring-1 focus:ring-black transition disabled:bg-gray-100 disabled:text-gray-400 disabled:cursor-not-allowed"
                >

                  <option value="">
                    {formData.category
                      ? "Select Size"
                      : "Select Category First"}
                  </option>

                  {(sizeOptions[formData.category] || []).map(
                    (size) => (
                      <option
                        key={size}
                        value={size}
                      >
                        {size}
                      </option>
                    )
                  )}

                </select>

                {formData.category === "Shoes" && (
                  <p className="text-xs text-gray-400 mt-2">
                    Shoe sizes are shown in standard number format.
                  </p>
                )}

                {(formData.category === "Jeans" ||
                  formData.category === "Trousers") && (
                  <p className="text-xs text-gray-400 mt-2">
                    Select waist size in inches.
                  </p>
                )}

              </div>


              <div>

                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Gender <span className="text-red-500">*</span>
                </label>

                <select
                  name="gender"
                  value={formData.gender}
                  onChange={handleChange}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg outline-none bg-white focus:border-black focus:ring-1 focus:ring-black transition"
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

                  <option value="Kids">
                    Kids
                  </option>

                </select>

              </div>

              <div>

                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Condition <span className="text-red-500">*</span>
                </label>

                <select
                  name="condition"
                  value={formData.condition}
                  onChange={handleChange}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg outline-none bg-white focus:border-black focus:ring-1 focus:ring-black transition"
                >

                  <option value="">
                    Select Condition
                  </option>

                  <option value="Like New">
                    Like New
                  </option>

                  <option value="Excellent">
                    Excellent
                  </option>

                  <option value="Good">
                    Good
                  </option>

                  <option value="Fair">
                    Fair
                  </option>

                </select>

              </div>

              <div>

                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Color
                </label>

                <input
                  type="text"
                  name="color"
                  value={formData.color}
                  onChange={handleChange}
                  placeholder="Black"
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg outline-none focus:border-black focus:ring-1 focus:ring-black transition"
                />

              </div>



              <div>

                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Estimated Swap Value{" "}
                  <span className="text-red-500">*</span>
                </label>

                <div className="relative">

                  <span className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500 font-medium">
                    ₹
                  </span>

                  <input
                    type="number"
                    name="estimatedValue"
                    value={formData.estimatedValue}
                    onChange={handleChange}
                    placeholder="1200"
                    min="1"
                    className="w-full pl-9 pr-4 py-3 border border-gray-300 rounded-lg outline-none focus:border-black focus:ring-1 focus:ring-black transition"
                  />

                </div>

                <p className="text-xs text-gray-400 mt-2">
                  Used only to compare swap values. No money is exchanged.
                </p>

              </div>



              <div>

                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Location <span className="text-red-500">*</span>
                </label>

                <input
                  type="text"
                  name="location"
                  value={formData.location}
                  onChange={handleChange}
                  placeholder="Hyderabad, Telangana"
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg outline-none focus:border-black focus:ring-1 focus:ring-black transition"
                />

                <p className="text-xs text-gray-400 mt-2">
                  Helps users find clothing available near them.
                </p>

              </div>

            </div>


            <div className="border-t border-gray-200 mt-10 pt-8">

              <h2 className="text-xl font-bold text-gray-900">
                Clothing Images
              </h2>

              <p className="text-sm text-gray-500 mt-1">
                Upload clear photos of your clothing item.
              </p>


              <div className="mt-5">

                <label
                  htmlFor="clothing-images"
                  className="block border-2 border-dashed border-gray-300 rounded-xl p-8 text-center cursor-pointer hover:border-gray-500 hover:bg-gray-50 transition"
                >

                  <div className="text-5xl">
                    📷
                  </div>

                  <p className="font-semibold text-gray-800 mt-3">
                    Click to upload images
                  </p>

                  <p className="text-sm text-gray-500 mt-1">
                    PNG, JPG, JPEG • Maximum 5 images
                  </p>

                  <p className="text-xs text-gray-400 mt-1">
                    Maximum 5MB per image
                  </p>

                  <span className="inline-block mt-4 bg-black text-white px-5 py-2.5 rounded-lg text-sm font-medium">
                    Choose Images
                  </span>

                </label>

                <input
                  id="clothing-images"
                  type="file"
                  accept="image/*"
                  multiple
                  onChange={handleImageChange}
                  className="hidden"
                />

              </div>


         

              {previewImages.length > 0 && (

                <div className="mt-6">

                  <div className="flex items-center justify-between mb-3">

                    <h3 className="font-semibold text-gray-800">
                      Preview
                    </h3>

                    <span className="text-sm text-gray-500">
                      {previewImages.length}/5 images
                    </span>

                  </div>


                  <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-4">

                    {previewImages.map((image, index) => (

                      <div
                        key={index}
                        className="relative aspect-square rounded-xl overflow-hidden border border-gray-200 bg-gray-100"
                      >

                        <img
                          src={image}
                          alt={`Preview ${index + 1}`}
                          className="w-full h-full object-cover"
                        />

                        <div className="absolute bottom-0 left-0 right-0 bg-black/60 text-white text-xs text-center py-1">
                          Image {index + 1}
                        </div>

                      </div>

                    ))}

                  </div>

                </div>

              )}

            </div>



            <div className="border-t border-gray-200 mt-10 pt-7">

              <div className="flex flex-col-reverse sm:flex-row sm:items-center sm:justify-between gap-4">

                <button
                  type="button"
                  onClick={() => navigate(-1)}
                  className="w-full sm:w-auto px-6 py-3 border border-gray-300 rounded-lg font-medium text-gray-700 hover:bg-gray-100 transition"
                >
                  Cancel
                </button>


                <button
                  type="submit"
                  disabled={loading}
                  className="w-full sm:w-auto px-8 py-3 bg-black text-white rounded-lg font-semibold hover:bg-gray-800 transition disabled:bg-gray-400 disabled:cursor-not-allowed"
                >
                  {loading
                    ? "Listing..."
                    : "List Clothing"}
                </button>

              </div>

            </div>

          </form>

        </div>



        <p className="text-center text-xs text-gray-400 mt-5">
          Your clothing will be visible to other SwapWear users after listing.
        </p>

      </div>

    </div>
  );
}

export default AddClothing;