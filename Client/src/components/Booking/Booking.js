import React, { useEffect, useState } from "react";
import animation from "../../assets/animation.png";
import backgroundfrom from "../../assets/backgroundfrom.png";
import icons from "../../ultils/icons";
import { Link } from "react-router-dom";
import { createcounsel, getallblogs } from "../../apis";
import { useSnackbar } from "notistack";

const { FaCheck, FaArrowRightLong } = icons;

const Booking = () => {
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [service, setService] = useState("");
  const [blogs, setBlogs] = useState([]);

  const { enqueueSnackbar } = useSnackbar();

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!name || !phone || !service) {
      enqueueSnackbar("Please fill in all required fields.", {
        variant: "warning",
      });
      return;
    }

    try {
      await createcounsel({
        name,
        mobile: phone,
        service,
      });

      setName("");
      setPhone("");
      setService("");

      enqueueSnackbar("Send Consultation successfully!", {
        variant: "success",
      });
    } catch (error) {
      console.error("Error creating counsel:", error);

      enqueueSnackbar("Failed to send consultation. Please try again.", {
        variant: "error",
      });
    }
  };

  useEffect(() => {
    const fetchBlogs = async () => {
      try {
        const response = await getallblogs();
        if (response.success) {
          // Lọc dữ liệu cần thiết từ API
          const blogData = response.blogs.map((blog) => ({
            id: blog._id,
            thumb: blog.thumb,
            title: blog.title,
            category: blog.category,
            createdAt: blog.createdAt, // Nếu có trường này
          }));

          // Sắp xếp blogs theo thời gian tạo (mới nhất trước)
          const sortedBlogs = blogData.sort(
            (a, b) => new Date(b.createdAt) - new Date(a.createdAt)
          );

          // Lấy 3 blog mới nhất
          setBlogs(sortedBlogs.slice(0, 3));
        } else {
          console.error("Failed to fetch blogs:", response.message);
        }
      } catch (err) {
        console.error("Error fetching blogs:", err.message);
      }
    };

    fetchBlogs();
  }, []);

  return (
    <div className="flex flex-col items-center justify-center mt-20">
      <div className="bg-[#00187E] w-full flex flex-col relative items-center py-20">
        <div className="marquee-block flex absolute top-[-13px]">
          <img className="animation-image" src={animation} alt="Animation" />
          <img className="animation-image" src={animation} alt="Animation" />
        </div>

        <div className="w-full lg:w-[70%] animate-zoom-background top-0 absolute">
          <img src={backgroundfrom} alt="Background" />
        </div>

        <div className="w-full flex flex-col items-center relative z-10 mt-10">
          <h3 className="text-[28px] lg:text-[44px] font-bold text-white">
            Send Free Consultation
          </h3>
          <form
            onSubmit={handleSubmit}
            className="w-full flex flex-col lg:flex-row items-center justify-center gap-5 mt-8 px-5">
            <input
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="p-3 lg:p-4 w-full lg:w-[21%] placeholder:text-gray-500 text-[14px] rounded-lg border border-gray-300 focus:outline-none"
              placeholder="Your Name*"
            />
            <input
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              className="p-3 lg:p-4 w-full lg:w-[21%] placeholder:text-gray-500 text-[14px] rounded-lg border border-gray-300 focus:outline-none"
              placeholder="Phone No.*"
            />
            <select
              value={service}
              onChange={(e) => setService(e.target.value)}
              className="p-3 lg:p-4 w-full lg:w-[21%] text-[14px] rounded-lg border border-gray-300 text-gray-500">
              <option value="">Select Blog</option>
              {blogs.map((blog) => (
                <option key={blog.id} value={blog.title}>
                  {blog.title}
                </option>
              ))}
            </select>
            <button
              type="submit"
              className="p-3 lg:p-4 w-full lg:w-[21%] rounded-lg bg-[#FFC704] transition-all duration-300 hover:bg-blue-500 hover:text-white">
              Send Consultation
            </button>
          </form>
        </div>

        <div className="w-full flex flex-col items-center mt-20 px-5">
          <h5 className="text-[#FFC704] text-center">OUR BLOGS</h5>
          <h3 className="text-[28px] lg:text-[44px] font-bold text-white text-center mt-3">
            Latest Blogs
          </h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-10 w-full max-w-[1200px] mt-10">
            {blogs.map(({ id, thumb, title, category }) => (
              <div key={id} className="relative flex flex-col items-center">
                <img src={thumb} alt={title} className="w-full rounded-lg object-cover h-[250px]" />
                <div className="flex flex-col w-full p-6 bg-[#0A2A99] rounded-br-lg rounded-tr-lg mt-[-30px] z-10 transition-all hover:scale-105">
                  <h3 className="text-white text-[20px] lg:text-[24px] font-semibold w-full line-clamp-1">
                    {title}
                  </h3>
                  <span className="mt-4 text-[#B8B9D5] text-[14px] lg:text-[16px]">
                    {category}
                  </span>
                  <hr className="my-4" />
                  <Link
  to={`/blogs/${id}/${title}`}
  className="flex items-center gap-3 text-white text-[14px] lg:text-[16px] font-medium mt-4 hover:text-[#FFC704] transition-all">
  View Details <FaArrowRightLong />
</Link>

                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="marquee-block flex absolute bottom-[-13px]">
          <img className="animation-image" src={animation} alt="Animation" />
          <img className="animation-image" src={animation} alt="Animation" />
        </div>
      </div>
    </div>
  );
};

export default Booking;
