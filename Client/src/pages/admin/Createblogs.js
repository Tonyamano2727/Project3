import React, { useState, useEffect } from "react";
import { apiCreateBlogs , apiGetServices} from "../../apis";
import axios from "axios";
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
      setThumb(file);
      setThumbImage(URL.createObjectURL(file));
    }
  };

  // Handle other images file change
  const handleOtherFilesChange = (e) => {
    const files = Array.from(e.target.files);
    setImages(files);
    const previewImages = files.map((file) => URL.createObjectURL(file));
    setOtherImages(previewImages);
  };

  // Handle description change
  const handleDescriptionChange = (index, value) => {
    const updatedDescriptions = [...description];
    updatedDescriptions[index] = value;
    setDescription(updatedDescriptions);
  };

  // Delete thumbnail image
  const handleDeleteThumb = () => {
    setThumb(null);
    setThumbImage(null);
  };

  // Delete other image
  const handleDeleteOtherImage = (index) => {
    const updatedImages = [...otherImages];
    const updatedFiles = [...images];
    updatedImages.splice(index, 1);
    updatedFiles.splice(index, 1);
    setOtherImages(updatedImages);
    setImages(updatedFiles);
  };

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();

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
                className="border rounded-xl mt-1 px-4 w-full"
                value={description[index]}
                onChange={(e) => handleDescriptionChange(index, e.target.value)}
                placeholder={`Describe ${label.toLowerCase()}`}
              />
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
          </div>
        </div>
        <div className="w-full">
          <Button fw type="submit">Create Blog</Button>
        </div>
      </form>
    </div>
  );
};

export default CreateBlogs;
