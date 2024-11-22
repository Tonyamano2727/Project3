import React, { useState, useEffect } from "react";
import { apiCreateBlogs, apiGetServices } from "../../apis";
import { Button } from "../../components";

const CreateBlogs = () => {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState(Array(7).fill(""));
  const [category, setCategory] = useState("");
  const [categories, setCategories] = useState([]);
  const [thumb, setThumb] = useState(null);
  const [images, setImages] = useState([]);
  const [thumbImage, setThumbImage] = useState(null);
  const [otherImages, setOtherImages] = useState([]);
  const [validationErrors, setValidationErrors] = useState(Array(7).fill(""));
  const [thumbError, setThumbError] = useState(""); 
  const [imagesError, setImagesError] = useState("");

  const hygieneLabels = [
    "Personal Hygiene",
    "Food Hygiene",
    "Water Hygiene",
    "Environmental Hygiene",
    "Hand Hygiene",
    "Oral Hygiene",
    "Clothing Hygiene",
  ];

  // Handle thumbnail file change
  const handleThumbFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      // Validate file type and size
      if (!file.type.startsWith("image/")) {
        setThumbError("Thumbnail must be an image file.");
        return;
      }
      if (file.size > 5 * 1024 * 1024) { // 5MB limit
        setThumbError("Thumbnail image size must be less than 5MB.");
        return;
      }
      setThumb(file);
      setThumbImage(URL.createObjectURL(file));
      setThumbError(""); // Clear error if valid
    }
  };

  // Handle other images file change
  const handleOtherFilesChange = (e) => {
    const files = Array.from(e.target.files);
    const updatedErrors = []; // Reset error messages

    files.forEach((file) => {
      // Validate file type and size for each file
      if (!file.type.startsWith("image/")) {
        updatedErrors.push("All files must be image files.");
      } else if (file.size > 5 * 1024 * 1024) { // 5MB limit
        updatedErrors.push("Each image size must be less than 5MB.");
      } else {
        updatedErrors.push(""); // Clear error if valid
      }
    });

    setImages(files);
    const previewImages = files.map((file) => URL.createObjectURL(file));
    setOtherImages(previewImages);
    setImagesError(""); // Clear images error when selecting files
  };

  // Handle description change
  const handleDescriptionChange = (index, value) => {
    const updatedDescriptions = [...description];
    updatedDescriptions[index] = value;
    setDescription(updatedDescriptions);
    // Clear validation error when the user starts typing
    const updatedErrors = [...validationErrors];
    updatedErrors[index] = value.length < 80 ? "Must be at least 80 characters." : "";
    setValidationErrors(updatedErrors);
  };

  // Delete thumbnail image
  const handleDeleteThumb = () => {
    setThumb(null);
    setThumbImage(null);
    setThumbError(""); // Clear error when deleted
  };

  // Delete other image
  const handleDeleteOtherImage = (index) => {
    const updatedImages = [...otherImages];
    const updatedFiles = [...images];
    updatedImages.splice(index, 1);
    updatedFiles.splice(index, 1);
    setOtherImages(updatedImages);
    setImages(updatedFiles);
    setImagesError(""); // Clear error if images are deleted
  };

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();

    // Validate descriptions
    const newValidationErrors = description.map((desc) =>
      desc.length < 80 ? "Must be at least 80 characters." : ""
    );

    setValidationErrors(newValidationErrors);

    // Reset error states
    setThumbError("");
    setImagesError("");

    // Check if any validation errors exist
    if (
      newValidationErrors.some((error) => error) || 
      !thumb || // Check if thumbnail is missing
      images.length === 0 // Check if additional images are missing
    ) {
      if (!thumb) {
        setThumbError("Thumbnail is required.");
      }

      if (images.length === 0) {
        setImagesError("At least one additional image is required.");
      }
      return; // Prevent submission if validation fails
    }

    const formData = new FormData();
    formData.append("title", title);

    description.forEach((desc) => {
      formData.append("description", desc);
    });

    formData.append("category", category);
    if (thumb) formData.append("thumb", thumb);
    images.forEach((image) => {
      formData.append("images", image);
    });

    try {
      const response = await apiCreateBlogs(formData);
      if (response && response.data) {
        if (response.data.success) {
          alert("Blog created successfully!");
        } else {
          alert("Failed to create blog.");
        }
      } else {
        console.log("Unexpected response structure:", response);
      }
    } catch (error) {
      console.error(
        "Error creating blog:",
        error.response ? error.response.data : error
      );
    }
  };

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const response = await apiGetServices();
        console.log(response);
        setCategories(response.service);
      } catch (err) {
        console.log("Error fetching categories:", err.message);
      }
    };
    fetchCategories();
  }, []);

  return (
    <div className="w-[85%] bg-white p-10 rounded-2xl border">
      <form onSubmit={handleSubmit}>
        <div className="w-full mb-4">
          <label>Title</label>
          <input
            className="h-10 border rounded-xl mt-1 px-4 w-full"
            type="text"
            placeholder="Blog Title"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            required
          />
        </div>
        <div className="flex flex-wrap gap-3 justify-between mb-4">
          {hygieneLabels.map((label, index) => (
            <div key={index} className="w-[48%]">
              <label>{label}</label>
              <textarea
                className="border rounded-xl mt-1 px-4 w-full h-[100px]"
                value={description[index]}
                onChange={(e) => handleDescriptionChange(index, e.target.value)}
                placeholder={`Describe ${label.toLowerCase()}`}
              />
              {validationErrors[index] && (
                <p className="text-red-500 text-sm">{validationErrors[index]}</p>
              )}
            </div>
          ))}
          <div className="w-[48%]">
            <label>Category</label>
            <select
              className="rounded-xl border h-[45px] mt-2 px-4 w-full"
              value={category}
              onChange={(e) => setCategory(e.target.value)}
              required>
              <option value="">Select Category</option>
              {categories.map((cat) => (
                <option key={cat._id} value={cat.category}>
                  {cat.category}
                </option>
              ))}
            </select>
          </div>
        </div>
        <div className="flex items-center justify-around mb-5">
          <div className="flex flex-col justify-center items-center">
            <label
              htmlFor="thumbImage"
              className="mt-2 bg-gradient-to-r from-blue-400 to-purple-500 text-white px-4 py-2 rounded-lg cursor-pointer">
              Thumb Image
            </label>
            <input
              id="thumbImage"
              className="hidden"
              type="file"
              accept="image/*"
              onChange={handleThumbFileChange}
            />
            {thumbImage && (
              <div className="relative">
                <img
                  src={thumbImage}
                  alt="Thumb Preview"
                  className="mt-2 h-20 w-20 object-cover"
                />
                <button
                  onClick={handleDeleteThumb}
                  className="absolute top-0 right-0 bg-red-600 text-white rounded-full p-1">
                  X
                </button>
              </div>
            )}
            {thumbError && <p className="text-red-500 text-sm">{thumbError}</p>}
          </div>

          <div className="flex flex-col justify-center items-center">
            <label
              htmlFor="otherImages"
              className="mt-2 bg-gradient-to-r from-blue-400 to-purple-500 text-white px-4 py-2 rounded-lg cursor-pointer">
              Other Images
            </label>
            <input
              id="otherImages"
              className="hidden"
              type="file"
              accept="image/*"
              multiple
              onChange={handleOtherFilesChange}
            />
            {otherImages.length > 0 && (
              <div className="mt-2 grid grid-cols-3 gap-2">
                {otherImages.map((image, index) => (
                  <div key={index} className="relative">
                    <img
                      src={image}
                      alt={`Other Image ${index}`}
                      className="h-20 w-20 object-cover"
                    />
                    <button
                      onClick={() => handleDeleteOtherImage(index)}
                      className="absolute top-0 right-0 bg-red-600 text-white rounded-full p-1">
                      X
                    </button>
                  </div>
                ))}
              </div>
            )}
            {imagesError && <p className="text-red-500 text-sm">{imagesError}</p>}
          </div>
        </div>
        <div className="w-full">
          <Button fw type="submit" style={'w-full p-2 mt-2 bg-white rounded-2xl bg-gradient-to-r from-[#979db6] to-gray-300'}>Create Blog</Button>
        </div>
      </form>
    </div>
  );
};

export default CreateBlogs;
