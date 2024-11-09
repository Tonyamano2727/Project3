import React, { useEffect, useState } from "react";
import { Breadcrumb } from "../../components";
import backgroundservice from "../../assets/backgroundservice.png";
import { Link, useParams } from "react-router-dom";
import {
  getdetailsblogs,
  getallblogs,
  createComment,
  likeBlog,
  dislikeBlog,
} from "../../apis";
import icons from "../../ultils/icons";
const { BiSolidTimeFive, FaUserShield, BiLike, BiDislike , FaEye} = icons;

const Detailsblogs = () => {
  const { bid } = useParams();
  const [blogDetails, setBlogDetails] = useState(null);
  const [blogs, setBlogs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [comment, setComment] = useState("");
  const [submissionError, setSubmissionError] = useState(null);

  const [currentPage, setCurrentPage] = useState(1);
  const commentsPerPage = 4;

  // Fetch blog details
  const fetchBlogDetails = async () => {
    try {
      const response = await getdetailsblogs(bid);
      if (response.success) {
        setBlogDetails(response.blog);
      } else {
        console.log("Failed to load blog details.");
      }
    } catch (err) {
      console.log(err.message);
    } finally {
      setLoading(false);
    }
  };

  // Fetch all blogs
  const fetchBlogs = async () => {
    try {
      const response = await getallblogs();
      if (response.success) {
        setBlogs(response.blogs);
      } else {
        setError("Cannot get all blogs");
      }
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleCommentSubmit = async (e) => {
    e.preventDefault();
    setSubmissionError(null);
  
    try {
      const response = await createComment(bid, { comment });
      if (response.success) {
        setComment("");
        fetchBlogDetails(); 
      } else {
        setSubmissionError(response.message);
      }
    } catch (err) {
      setSubmissionError(err.message);
    }
  };
  

  const handleLike = async () => {
    try {
      const response = await likeBlog(bid);
      if (response.success) {
        fetchBlogDetails(); 
      }
    } catch (err) {
      console.log(err.message);
    }
  };


  const handleDislike = async () => {
    try {
      const response = await dislikeBlog(bid);
      if (response.success) {
        fetchBlogDetails(); 
      }
    } catch (err) {
      console.log(err.message);
    }
  };

  useEffect(() => {
    fetchBlogs();
  }, []);

  useEffect(() => {
    fetchBlogDetails();
  }, [bid]);

  const indexOfLastComment = currentPage * commentsPerPage;
  const indexOfFirstComment = indexOfLastComment - commentsPerPage;
  const currentComments =
    blogDetails?.reviews.slice(indexOfFirstComment, indexOfLastComment) || [];

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
          <Breadcrumb title={blogDetails?.title} />
          <h1 className="text-3xl font-bold mb-4">{blogDetails?.title}</h1>
        </div>
      </div>
      <div className="flex justify-center w-[85%] gap-4 mt-10 p-5">
        <div className="w-[65%] flex flex-wrap">
          {blogDetails && (
            <div className="w-full px-4">
              <img
                src={blogDetails.thumb}
                alt={blogDetails.title}
                className="w-full h-auto mb-4"
              />
              <div className="flex items-center gap-5 mt-5 mb-5">
                <p className="text-sm flex justify-center items-center gap-1 text-blue-600">
                  <FaUserShield />: {blogDetails.author}
                </p>
                <p className="text-sm flex justify-center items-center gap-1 text-blue-600">
                  <BiSolidTimeFive />:{" "}
                  {new Date(blogDetails.createdAt).toLocaleDateString()}
                </p>
                <p className="text-sm flex justify-center items-center gap-1 text-blue-600">
                  <FaEye />:{" "}
                  {blogDetails.numberView}
                </p>
           
                <div className="flex items-center justify-center gap-4">
                  <button
                    className="text-sm flex justify-center items-center gap-1 text-blue-600"
                    onClick={handleLike}>
                    <BiLike /> {blogDetails.likes.length}
                  </button>
                  <button
                    className="text-sm flex justify-center items-center gap-1 text-red-600"
                    onClick={handleDislike}>
                    <BiDislike />
                    {blogDetails.dislikes.length}
                  </button>
                </div>
              </div>
              <hr />
              {blogDetails.description.map((desc, index) => (
                <p
                  key={index}
                  className="mb-5 text-[16px] text-[#3A4268] font-normal leading-[26px] mt-5">
                  {desc}
                </p>
              ))}
              <div className="flex flex-wrap gap-2">
                {blogDetails.images.map((img, index) => (
                  <img
                    key={index}
                    src={img}
                    alt={`Blog Image ${index + 1}`}
                    className="w-[48%]"
                  />
                ))}
              </div>
            </div>
          )}
        </div>
        <div className="w-[35%] top-20 flex flex-col">
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

          {blogDetails &&
            blogDetails.reviews &&
            blogDetails.reviews.length > 0 && (
              <div className="flex flex-col bg-[#f7f6ee] rounded-lg p-10 mt-10">
                <h3 className="font-extralight text-[20px] mb-4">Reviews</h3>
                {currentComments.map((review, index) => {
                  const firstName = review.user?.firstname || "Unknown";
                  const lastName = review.user?.lastname || "";

                  return (
                    <div
                      key={index}
                      className="border p-4 mb-4 rounded-md shadow bg-gradient-to-r from-[#e0b88a] to-[#e07c93]">
                      <div className="flex justify-between">
                        <p className="font-extralight">{`${firstName} ${lastName}`}</p>
                        <p className="text-xs text-white">
                          {new Date(review.createdAt).toLocaleDateString()}
                        </p>
                      </div>
                      <p className="text-sm text-gray-600">{review.comment}</p>
                    </div>
                  );
                })}
                <div className="flex justify-end mt-4">
                  {Array.from(
                    {
                      length: Math.ceil(
                        blogDetails.reviews.length / commentsPerPage
                      ),
                    },
                    (_, i) => (
                      <button
                        key={i + 1}
                        onClick={() => setCurrentPage(i + 1)}
                        className={`mx-1 px-3 py-1 rounded ${
                          currentPage === i + 1
                            ? "bg-blue-500 text-white"
                            : "bg-gray-300 text-black"
                        }`}>
                        {i + 1}
                      </button>
                    )
                  )}
                </div>
              </div>
            )}
          <form
            onSubmit={handleCommentSubmit}
            className="mt-6 bg-[#f7f6ee] p-4 rounded-lg">
            <h3 className="text-[#00197e] text-[20px] font-medium">Comment</h3>
            <textarea
              rows="4"
              className="w-full p-2 border border-gray-300 rounded-xl mt-2"
              value={comment}
              onChange={(e) => setComment(e.target.value)}
              placeholder="Type your comment here..."
              required></textarea>
            <button
              type="submit"
              className="mt-4 bg-gradient-to-r from-[#e0a96a] to-[#e07c93] px-4 py-2 rounded-full w-full text-white">
              Submit
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Detailsblogs;
