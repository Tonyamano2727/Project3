import React, { useCallback, useEffect, useState } from "react";
import { getallblogs, apiDeleteBlog } from "../../apis"; 
import { sortByDate } from "../../ultils/contants";
import { Inputfields, Pagination, Selectinput } from "../../components";
import useDebounce from "../../hooks/useDebounce";
import { Link, useSearchParams } from "react-router-dom";
import { useSnackbar } from "notistack";
import Swal from "sweetalert2";
import { FaEdit } from "react-icons/fa";
import { RiDeleteBin6Line } from "react-icons/ri";
import Updateblogs from "./Updateblogs";

const Manageblogs = () => {
  const { enqueueSnackbar } = useSnackbar();
  const [blogs, setBlogs] = useState([]);
  const [counts, setCounts] = useState(0);
  const [queries, setQueries] = useState({
    q: "",
    category: "",
  });
  const [sort, setSort] = useState("");
  const [params] = useSearchParams();
  const [editBlog, setEditBlog] = useState(null);
  const [update, setUpdate] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState("");

  const [allCategories, setAllCategories] = useState([]);

  const queriesDebounce = useDebounce(queries.q, 800);

  const fetchBlogs = async (params) => {
    try {
      const response = await getallblogs({
        ...params,
        limit: process.env.REACT_APP_PRODUCT_LIMIT,
        sort,
      });
      console.log(response);
      if (response.success) {
        setBlogs(response.blogs);
        setCounts(response.counts);
        if (!allCategories.length) {
          const uniqueCategories = [...new Set(response.blogs.map((blog) => blog.category))];
          setAllCategories(uniqueCategories);
        }
      } else {
        enqueueSnackbar("Failed to load blogs", { variant: "error" });
      }
    } catch (error) {
      enqueueSnackbar("An error occurred while fetching blogs", {
        variant: "error",
      });
    }
  };

  useEffect(() => {
    const searchParams = Object.fromEntries([...params]);
    if (queriesDebounce) searchParams.q = queriesDebounce;
    if (selectedCategory) {
      searchParams.category = selectedCategory;
    } else {
      delete searchParams.category;
    }
    fetchBlogs(searchParams);
  }, [params, queriesDebounce, sort, selectedCategory]);

  const handleDeleteBlog = async (blogId) => {
    const result = await Swal.fire({
      title: "Are you sure?",
      text: "Do you want to remove this blog?",
      icon: "warning",
      showCancelButton: true,
    });
  
    if (result.isConfirmed) {
      const response = await apiDeleteBlog(blogId);
      if (response.success) {
        enqueueSnackbar(String(response.message || "Blog deleted successfully."), { variant: "success" });
        fetchBlogs(Object.fromEntries([...params])); 
      } else {
        enqueueSnackbar(String(response.message || "Failed to delete blog."), { variant: "error" });
      }
    }
  };
  

  const changeValue = (value) => {
    setSort(value);
  };

  const render = useCallback(() => {
    setUpdate(!update);
  }, [update]);

  return (
    <div className="w-[90%] flex flex-col gap-4 relative h-[760px]">
      {editBlog && (
        <Updateblogs
          editBlog={editBlog}
          setEditBlog={setEditBlog}
          render={render}
        />
      )}
      <div className="w-full flex p-2 gap-10 flex-col justify-start">
        <Link
          to="/admin/create-blogs"
          className="p-2 bg-gradient-to-r from-[#979db6] to-gray-300 rounded-2xl w-[15%] text-[14px] text-black text-center">
          + New Blog
        </Link>
        <div className="flex gap-10">
          <Selectinput
            className={'bg-gradient-to-r from-[#979db6] to-gray-300'}
            changeValue={(value) => {
              setSelectedCategory(value);
              if (!value) {
                const searchParams = { ...Object.fromEntries(params) };
                delete searchParams.category;
                fetchBlogs(searchParams);
              }
            }}
            value={selectedCategory}
            options={[
              ...allCategories.map((category) => ({
                text: category,
                value: category,
              })),
            ]}
          />
          <Selectinput
           className={'bg-gradient-to-r from-[#979db6] to-gray-300'}
            changeValue={changeValue}
            value={sort}
            options={sortByDate}
          />
        </div>
      </div>
      <div className="flex w-full items-center">
        <Inputfields
          style={"inputsearcadmin"}
          nameKey={"q"}
          value={queries.q}
          setValue={setQueries}
          placeholder="Search blog title..."
          isHidelabel
        />
      </div>
      <div className="border rounded-2xl p-5 bg-white z-1">
        <table className="overflow-hidden w-full leading-10">
          <thead>
            <tr className="text-[13px]">
              <th>STT</th>
              <th>Title</th>
              <th>Category</th>
              <th>Views</th>
              <th>Created At</th>
              <th>Author</th>
              <th>Action</th>
            </tr>
          </thead>
          <tbody className="text-center">
            {blogs.map((blog, idx) => (
              <tr
                className="text-[13px] transition duration-300 ease-in-out transform hover:scale-105 focus:outline-none"
                key={blog._id}>
                <td>{idx + 1}</td>
                <td>
                  <span className="font-medium">{blog.title}</span>
                </td>
                <td>{blog.category}</td>
                <td>{blog.numberView}</td>
                <td>{new Date(blog.createdAt).toLocaleDateString()}</td>
                <td>{blog.author || "Unknown"}</td>
                <td>
                  <div className="flex items-center justify-center">
                    <span
                      onClick={() => setEditBlog(blog)}
                      className="hover:underline cursor-pointer px-2 text-blue-500">
                      <FaEdit size={20} />
                    </span>
                    <span
                      onClick={() => handleDeleteBlog(blog._id)}
                      className="text-red-500 hover:underline cursor-pointer px-2">
                      <RiDeleteBin6Line size={20} />
                    </span>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <div className="w-full flex justify-end my-8">
        <Pagination totalCount={counts} />
      </div>
    </div>
  );
};

export default Manageblogs;
