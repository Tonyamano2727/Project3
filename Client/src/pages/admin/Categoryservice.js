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
  const inputRef = useRef(null);

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const response = await apigetallcategoryservice();
        if (Array.isArray(response) && response.length > 0) {
          setCategories(response);
        } else {
          setError("Failed to fetch categories");
        }
      } catch (err) {
        setError("Error fetching categories: " + err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchCategories();
  }, []);

  const handleDelete = async (id) => {
    try {
      const response = await apideletecategoryservice(id);
      console.log("Delete API response:", response);

      if (response && response.message === "Category deleted successfully") {
        setCategories((prev) => prev.filter((category) => category._id !== id));
        console.log("Category deleted successfully");
      } else {
        console.log("Delete failed: Unknown error");
      }
    } catch (error) {
      console.log("Error deleting category:", error.message || "Unknown error");
    }
  };

  const handleCreate = async () => {
    if (newCategoryTitle.trim() === "") {
      console.log("Please enter a valid category title.");
      return;
    }

    try {
      const response = await apicreatecategoryservice({
        title: newCategoryTitle,
      });
      console.log("Create API response:", response);

      // Kiểm tra phản hồi từ API
      if (response && response._id) {
        // Cập nhật danh sách danh mục bằng cách thêm danh mục mới vào danh sách hiện tại
        setCategories((prev) => [...prev, response]); // Giả sử response chứa thông tin danh mục mới
        setNewCategoryTitle("");
        setShowCreateForm(false);
        console.log("Category created successfully");
      } else {
        console.log("Create failed: Unknown error");
      }
    } catch (error) {
      console.log("Error creating category:", error.message || "Unknown error");
    }
  };
  return (
    <div className="flex flex-col w-full items-center">
      <div className="flex w-[85%] justify-start items-start">
        <button
          onClick={() => setShowCreateForm((prev) => !prev)}
          className="p-2 bg-gradient-to-r from-[#e0a96a] to-[#e07c93] rounded-2xl w-[15%] text-[14px] text-white text-center">
          + New Category
        </button>
      </div>

      {showCreateForm && (
        <div className="w-[85%] mt-4">
          <input
            type="text"
            placeholder="Category Title"
            value={newCategoryTitle}
            onChange={(e) => setNewCategoryTitle(e.target.value)}
            className="border p-2 w-full mb-2 rounded-2xl"
          />
          <button
            onClick={handleCreate}
            className="bg-blue-500 text-white px-4 py-2 rounded-2xl mr-2">
            Create
          </button>
          <button
            onClick={() => setShowCreateForm(false)}
            className="bg-gray-300 text-black px-4 py-2 rounded-2xl">
            Cancel
          </button>
        </div>
      )}

      <div className="border rounded-2xl mt-4 p-5 bg-white z-1 w-[85%] flex flex-col items-center">
        {categories.length > 0 ? (
          <ul className="w-full ">
            {categories.map((category) => (
              <li
                key={category._id}
                className="flex justify-between p-2">
                <div className="flex gap-5">
                  <span>{category.title}</span>
                  <span className="text-gray-500 ml-2">
                 
                    {moment(category.createdAt).format("DD/MM/YYYY")}
                  </span>
                </div>
                <button
                  onClick={() => handleDelete(category._id)}
                  className="text-red-500 hover:underline ml-4">
                  Delete
                </button>
              </li>
            ))}
          </ul>
        ) : (
          <p>No categories</p>
        )}
      </div>
    </div>
  );
};

export default Categoryservice;
