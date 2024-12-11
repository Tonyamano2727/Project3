import React, { useEffect, useState, useRef } from "react";
import {
  apicreatecategoryservice,
  apigetallcategoryservice,
  apideletecategoryservice,
} from "../../apis";
import moment from "moment";

const Categoryservice = () => {
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [newCategoryTitle, setNewCategoryTitle] = useState("");
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [successMessage, setSuccessMessage] = useState("");
  const inputRef = useRef(null);

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const response = await apigetallcategoryservice();
        console.log("Fetched categories:", response); // Log the response
        if (
          Array.isArray(response.categories) &&
          response.categories.length > 0
        ) {
          setCategories(response.categories); // Set categories
        }
      } catch (err) {
        setError("Error fetching categories: " + err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchCategories();
  }, []);

  // Handle delete category
  const handleDelete = async (id) => {
    try {
      const response = await apideletecategoryservice(id);
      if (response && response.message === "Category deleted successfully") {
        setCategories((prev) => prev.filter((category) => category._id !== id));
        setSuccessMessage("Category deleted successfully");
      } else {
        setError("Delete failed: Unknown error");
      }
    } catch (error) {
      setError("Error deleting category: " + error.message || "Unknown error");
    }
  };

  // Handle create category
  const handleCreate = async () => {
    if (newCategoryTitle.trim() === "") {
      setError("Please enter a valid category title.");
      return;
    }

    try {
      const response = await apicreatecategoryservice({
        title: newCategoryTitle,
      });
      if (response && response._id) {
        setCategories((prev) => [...prev, response]);
        setNewCategoryTitle("");
        setShowCreateForm(false);
        setSuccessMessage("Category created successfully");
      } else {
        setError("Create failed: Unknown error");
      }
    } catch (error) {
      setError("Error creating category: " + error.message || "Unknown error");
    }
  };

  return (
    <div className="flex flex-col w-full items-center">
      <div className="flex w-[95%] justify-start items-start">
        <button
          onClick={() => setShowCreateForm((prev) => !prev)}
          className="p-2 bg-gradient-to-r from-[#979db6] to-gray-300 rounded-2xl w-[15%] text-[14px] text-black text-center">
          + New Category
        </button>
      </div>

      {successMessage && <div className="text-green-500">{successMessage}</div>}
      {error && <div className="text-red-500">{error}</div>}

      {showCreateForm && (
        <div className="w-[95%] mt-4">
          <input
            type="text"
            placeholder="Category Title"
            value={newCategoryTitle}
            onChange={(e) => setNewCategoryTitle(e.target.value)}
            className="border p-2 w-full mb-2 rounded-full"
          />
          <div className="flex gap-5">
            <button
              onClick={handleCreate}
              className="bg-gradient-to-r from-[#979db6] to-gray-300 p-3 rounded-full">
              Create
            </button>
            <button
              onClick={() => setShowCreateForm(false)}
              className="bg-gray-300 text-black rounded-full p-3">
              Cancel
            </button>
          </div>
        </div>
      )}

      <div className="border rounded-2xl mt-4 p-5 bg-white z-1 w-[95%] flex flex-col items-center">
        <ul className="w-full ">
          {categories.map((category) => (
            <li key={category._id} className="flex justify-between p-2">
              <div className="flex gap-5">
                <span>{category.title}</span>
              </div>
              <button
                onClick={() => handleDelete(category._id)}
                className="text-red-500 hover:underline ml-4">
                Delete
              </button>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
};

export default Categoryservice;
