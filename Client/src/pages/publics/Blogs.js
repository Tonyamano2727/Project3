import React, { useEffect, useState } from "react";
import { Breadcrumb } from "../../components";
import backgroundservice from "../../assets/backgroundservice.png";
import { getallblogs } from "../../apis";
import { Link } from "react-router-dom";
import icons from "../../ultils/icons";
const { BiSolidTimeFive, FaUserShield , FaEye } = icons;

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
      <div className="flex justify-center w-full">
        <div className="w-full">
          <img
            className="relative"
            src={backgroundservice}
            alt="backgroundservice"
          />
        </div>
        <div className="flex absolute flex-col text-white left-20 top-[200px] p-4">
          <h2 className="text-[45px] mb-[8px] font-bold tracking-wide">
            Blogs
          </h2>
          <Breadcrumb title={title} />
        </div>
      </div>
      <div className="flex w-[85%] gap-6 justify-center p-8">
        <div className="w-[60%] flex flex-wrap">
          {currentBlogs.map((blog) => (
            <div key={blog._id} className="border rounded-xl relative mb-5 bg-white">
              <img
                className="flex h-[auto] w-full object-cover"
                src={blog.thumb}
                alt={blog.title}
              />
              <div className="flex gap-2 flex-col p-5 justify-start items-start">
                <div className="flex gap-4">
                  <p className="text-[#007bff] text-[14px] font-normal flex items-center justify-center gap-2">
                    <FaUserShield /> By: {blog.author}
                  </p>
                  <p className="text-[#007bff] text-[14px] font-normal flex items-center justify-center gap-2">
                    <BiSolidTimeFive />
                    {new Date(blog.createdAt).toLocaleDateString()}
                  </p>
                  <p className="text-sm flex justify-center items-center gap-1 text-blue-600">
                    <FaEye />: {blog.numberView}
                  </p>
                  <button
                    onClick={handleShare}
                    className="text-[#007bff] text-[14px] font-normal flex items-center justify-center gap-2 cursor-pointer">
                    Share
                  </button>
                </div>
                <h2 className="text-[25px] font-semibold hover:text-[text-#007bff]">
                  {blog.title}
                </h2>
                <p className="absolute flex top-4 bg-[#007bff] p-2 text-white rounded-lg">
                  {blog.category}
                </p>
                <p>{blog.description[0]}</p>
                <Link
                  to={`/blogs/${blog._id}/${blog.title}`}
                  className="flex mt-3 mb-3 bg-[#007bff] p-3 text-white w-[20%] text-[15px] text-center justify-center font-medium rounded-lg">
                  Read more
                </Link>
              </div>
            </div>
          ))}

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
        <div className="w-[35%] top-20">
          <div className="flex flex-col bg-[#f7f6ee] rounded-lg p-10">
            <h3 className="mt-[11px] font-bold text-[#00197e] text-[20px]">
              Article Summary
            </h3>
            {blogs.map((blog) => (
              <Link
                key={blog._id}
                to={`/blogs/${blog._id}/${blog.title}`}
                className="text-[#575f66] font-normal hover:text-[#00197e] transition-colors duration-300 mt-4 mb-4">
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
