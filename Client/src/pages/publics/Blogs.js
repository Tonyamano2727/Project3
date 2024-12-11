import React, { useEffect, useState } from "react";
import { Breadcrumb } from "../../components";
import backgroundservice from "../../assets/backgroundservice.png";
import { getallblogs } from "../../apis";
import { Link } from "react-router-dom";
import icons from "../../ultils/icons";
const { BiSolidTimeFive, FaUserShield, FaEye } = icons;

const Blogs = ({ title }) => {
  const [blogs, setBlogs] = useState([]);

  const [currentPage, setCurrentPage] = useState(1);
  const blogsPerPage = 2;

  const fetchBlogs = async (params) => {
    const response = await getallblogs({
      ...params,
      limit: process.env.REACT_APP_PRODUCT_LIMIT,
    });
    if (response.success) {
      const sortedBlogs = response.blogs.sort(
        (a, b) => new Date(b.createdAt) - new Date(a.createdAt)
      );
      setBlogs(response.blogs);
    }
  };

  useEffect(() => {
    fetchBlogs();
  }, []);

  const indexOfLastBlog = currentPage * blogsPerPage;
  const indexOfFirstBlog = indexOfLastBlog - blogsPerPage;
  const currentBlogs = blogs.slice(indexOfFirstBlog, indexOfLastBlog); // Sử dụng blogs, không cần thêm kiểm tra vì blogs đã được khởi tạo là mảng

  const paginate = (pageNumber) => setCurrentPage(pageNumber);

  const totalPages = Math.ceil(blogs.length / blogsPerPage);

  const handleShare = () => {
    const url = window.location.href;
    const facebookShareUrl = `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(
      url
    )}`;
    window.open(facebookShareUrl, "_blank", "width=600,height=400");
  };

  return (
    <div className="w-full flex justify-center items-center flex-col">
      <div className="w-full relative flex justify-center items-center flex-col bg-[#E7E7E7]">
        <img
          className="w-full object-cover h-[200px] md:h-[350px]"
          src={backgroundservice}
          alt="backgroundservice"
        />
        <div className="absolute text-white flex flex-col items-center md:items-start md:left-20 p-4">
          <h2 className="text-[24px] md:text-[45px] font-bold tracking-wide">
            Blogs
          </h2>
          <Breadcrumb title={title} />
        </div>
      </div>
      <div className="flex flex-col md:flex-row w-[90%] gap-6 justify-center p-4">
        <div className="w-full md:w-[60%]">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {currentBlogs.map((blog) => (
              <div
                key={blog._id}
                className="border rounded-xl bg-white shadow-lg overflow-hidden">
                <img
                  className="w-full h-[200px] object-cover"
                  src={blog.thumb}
                  alt={blog.title}
                />

                <div className="p-4">
                  <div className="flex flex-wrap gap-2 text-sm text-blue-600 mb-2">
                    <span className="flex items-center gap-1">
                      <FaUserShield /> {blog.author}
                    </span>
                    <span className="flex items-center gap-1">
                      <BiSolidTimeFive />
                      {new Date(blog.createdAt).toLocaleDateString()}
                    </span>
                    <span className="flex items-center gap-1">
                      <FaEye /> {blog.numberView}
                    </span>
                    <button
                      onClick={handleShare}
                      className="text-[#007bff] flex items-center gap-1 cursor-pointer">
                      Share
                    </button>
                  </div>

                  <h2 className="text-[20px] font-bold text-gray-800 hover:text-[#007bff] mb-2">
                    {blog.title}
                  </h2>

                  <p className="absolute top-4 left-4 bg-[#007bff] text-white px-2 py-1 text-sm rounded-lg">
                    {blog.category}
                  </p>

                  <p className="text-gray-600 text-sm mb-3">
                    {blog.description[0]}
                  </p>

                  <Link
                    to={`/blogs/${blog._id}/${blog.title}`}
                    className="inline-block bg-[#007bff] text-white px-4 py-2 text-sm font-medium rounded-md hover:bg-[#0056b3]">
                    Read more
                  </Link>
                </div>
              </div>
            ))}
          </div>

          <div className="flex justify-center mt-6">
            {Array.from({ length: totalPages }, (_, i) => (
              <button
                key={i + 1}
                onClick={() => paginate(i + 1)}
                className={`mx-1 px-3 py-1 border rounded-lg ${
                  currentPage === i + 1
                    ? "bg-[#007bff] text-white"
                    : "bg-white text-[#007bff]"
                }`}>
                {i + 1}
              </button>
            ))}
          </div>
        </div>

        <div className="w-full md:w-[35%]">
          <div className="bg-[#f7f6ee] rounded-lg p-6 shadow-lg">
            <h3 className="font-bold text-[#00197e] text-lg mb-4">
              Article Summary
            </h3>
            {blogs.map((blog) => (
              <Link
                key={blog._id}
                to={`/blogs/${blog._id}/${blog.title}`}
                className="block text-[#575f66] font-normal hover:text-[#00197e] transition duration-300 mb-2">
                {blog.title}
              </Link>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Blogs;
