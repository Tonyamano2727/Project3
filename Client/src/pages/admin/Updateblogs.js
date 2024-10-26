import React, { useState, useEffect } from "react";
import { apiUpdateblogs, apiGetServices } from "../../apis";
import { getBase64 } from "../../ultils/helper";
import { useSnackbar } from "notistack";
const UpdateBlogs = ({ editBlog, render, setEditBlog }) => {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState(Array(7).fill(""));
  const [category, setCategory] = useState("");
  const [categories, setCategories] = useState([]);
  const [thumb, setThumb] = useState(null);
  const [images, setImages] = useState([]);
  const [thumbImage, setThumbImage] = useState(null);
  const [otherImages, setOtherImages] = useState([]);
  const { enqueueSnackbar } = useSnackbar();
  const hygieneLabels = [
    "Personal Hygiene",
    "Food Hygiene",
    "Water Hygiene",
    "Environmental Hygiene",
    "Hand Hygiene",
    "Oral Hygiene",
    "Clothing Hygiene",
  ];

  useEffect(() => {
    if (editBlog) {
      setTitle(editBlog.title);
      setDescription(editBlog.description);
      setCategory(editBlog.category);
      setThumbImage(editBlog.thumb);
      setOtherImages(editBlog.images); // Presuming editBlog.images contains URLs for previews
    }
  }, [editBlog]);

  const handleThumbFileChange = async (e) => {
    const file = e.target.files[0];
    if (file) {
      const base64 = await getBase64(file);
      setThumb(base64); // Store base64 representation
      setThumbImage(URL.createObjectURL(file)); // For preview
    }
  };

  // Handle other images file change
  const handleOtherFilesChange = async (e) => {
    const files = Array.from(e.target.files);
    const base64Files = await Promise.all(files.map((file) => getBase64(file))); // Convert to base64
    setImages(base64Files); // Store base64 files (if needed)
    const previewImages = files.map((file) => URL.createObjectURL(file)); // Preview images
    setOtherImages((prev) => [...prev, ...previewImages]); // Append new images
  };

  const handleRemoveImage = (index) => {
    setOtherImages((prev) => prev.filter((_, idx) => idx !== index)); // Remove image by index
  };

  const handleDescriptionChange = (index, value) => {
    const updatedDescriptions = [...description];
    updatedDescriptions[index] = value;
    setDescription(updatedDescriptions);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
  
    const formData = new FormData();
    formData.append("title", title);
    
    description.forEach((desc) => {
      formData.append("description", desc);
    });
  
    formData.append("category", category);
    if (thumb) formData.append("thumb", thumb);
    otherImages.forEach((image) => {
      formData.append("images", image);
    });
  
    try {
      const response = await apiUpdateblogs(formData, editBlog._id);
      if (response.success) {
        render();
        setEditBlog(null);
        enqueueSnackbar("Blog updated successfully!", { variant: "success" }); // Sử dụng thông báo mặc định
      } else {
        enqueueSnackbar("Failed to update blog.", { variant: "error" }); // Sử dụng thông báo mặc định
      }
    } catch (error) {
      console.error(
        "Error updating blog:",
        error.response ? error.response.data : error
      );
      enqueueSnackbar("An error occurred while updating the blog.", { variant: "error" }); // Thông báo lỗi mặc định
    }
  };
  

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const response = await apiGetServices();
        setCategories(response.service);
      } catch (err) {
        console.log("Error fetching categories:", err.message);
      }
    };

    fetchCategories();
  }, []);

  return (
    <div className="w-[100%] bg-white p-10 rounded-2xl border absolute z-50">
      <form onSubmit={handleSubmit}>
        <span
          className="cursor-pointer text-main"
          onClick={() => setEditBlog(null)}>
          Cancel
        </span>
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

        {/* Description Inputs */}
        <div className="flex flex-wrap gap-3 justify-between mb-4">
          {hygieneLabels.map((label, index) => (
            <div key={index} className="w-[48%]">
              <label>{label}</label>
              <textarea
                className="border rounded-xl mt-1 px-4 w-full"
                value={description[index]}
                onChange={(e) => handleDescriptionChange(index, e.target.value)}
                placeholder={`Describe ${label.toLowerCase()}`}
              />
            </div>
          ))}

          {/* Category Select */}
          <div className="w-[48%]">
            <label>Category</label>
            <select
              className="rounded-xl border h-[45px] mt-2 px-4 w-full"
              value={category}
              onChange={(e) => setCategory(e.target.value)}
              required>
              <option value="">Select Category</option>
              {categories.map((cat) => (
                <option key={cat._id} value={cat.title}>
                  {cat.title}
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Image Uploads */}
        <div className="flex items-center justify-around mb-5">
          {/* Thumbnail Image */}
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
              <img
                src={thumbImage}
                alt="Thumb Preview"
                className="mt-2 h-20 w-20 object-cover"
              />
            )}
          </div>

          {/* Other Images */}
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
                    {/* Delete Button */}
                    <button
                      type="button"
                      className="absolute top-0 right-0 bg-red-500 text-white rounded-full p-1"
                      onClick={() => handleRemoveImage(index)}>
                      &times; {/* Close icon */}
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        <button type="submit" className="w-full bg-slate-400 p-3 rounded-xl">
          Update Blog
        </button>
      </form>
    </div>
  );
};

export default UpdateBlogs;
