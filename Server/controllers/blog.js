const express = require('express');
const Blog = require("../models/blog");
const asyncHandler = require("express-async-handler");

const createNewBlog = asyncHandler(async (req, res) => {
  const { title, description, category } = req.body;

  if (!title || !description || !category) {
    return res.status(400).json({ success: false, mes: "Missing inputs" });
  }

  const newBlogData = {
    title,
    description,
    category,
    thumb: req.files && req.files.thumb ? req.files.thumb[0].path : null,
    images: req.files && req.files.images ? req.files.images.map(file => file.path) : [],
  };

  try {
    const response = await Blog.create(newBlogData);
    return res.json({
      success: true,
      createBlog: response,
    });
  } catch (error) {
    console.error('Error creating blog:', error); 
    return res.status(500).json({
      success: false,
      message: 'Error creating blog',
      error: error.message, 
    });
  }
});

const updateBlog = asyncHandler(async (req, res) => {
  const { bid } = req.params;

  if (Object.keys(req.body).length === 0 && (!req.files || Object.keys(req.files).length === 0)) {
    return res.status(400).json({
      success: false,
      mes: "Missing inputs",
    });
  }

  const updateData = { ...req.body };

  if (req.files && req.files.thumb) {
    updateData.thumb = req.files.thumb[0].path; // Sửa lại để sử dụng chỉ số [0]
  }

  if (req.files && req.files.images) {
    updateData.images = req.files.images.map((file) => file.path); // Chuyển đổi tất cả các tệp thành đường dẫn
  }

  const response = await Blog.findByIdAndUpdate(bid, updateData, { new: true });

  return res.status(200).json({
    success: response ? true : false,
    updateBlog: response ? response : "Cannot update Blog",
  });
});


const getallBlog = asyncHandler(async (req, res) => {
  const queries = { ...req.query };
  // Tách các trường dặt biệt
  const excludeFields = ["limit", "sort", "page", "fields"];
  excludeFields.forEach((el) => delete queries[el]);

  // Format lại các operator cho đúng cú pháp mongoose      //gt is > // lt is <
  let queryString = JSON.stringify(queries);
  queryString = queryString.replace(
    /\b(gte|gt|lt|lte)\b/g,
    (macthedEl) => `$${macthedEl}`
  );
  const formatedQueries = JSON.parse(queryString);
  let colorQueryObject = {};
  // Filtering
  if (queries?.title)
    formatedQueries.title = { $regex: queries.title, $options: "i" };
  if (queries?.category)
    formatedQueries.category = { $regex: queries.category, $options: "i" };
  let queryObject = {};
  if (queries?.q) {
    delete formatedQueries.q;
    queryObject = {
      $or: [
        { title: { $regex: queries.q, $options: "i" } },
        { category: { $regex: queries.q, $options: "i" } },
      ],
    };
  }
  const qr = { ...colorQueryObject, ...formatedQueries, ...queryObject };
  let queryConmmand = Blog.find(qr);

  // Sorting
  //abc,efg => [abc,efg] => abc efg
  if (req.query.sort) {
    const sortBy = req.query.sort.split(",").join(" ");
    queryConmmand = queryConmmand.sort(sortBy);
  }

  // fields limiting    // Lấy trường
  if (req.query.fields) {
    const fields = req.query.fields.split(",").join(" ");
    queryConmmand = queryConmmand.select(fields);
  }
  // Pagination
  // limit: số object lấy về goin API
  // skip: 2
  // 1 2 3 ... 10

  // + conver kieu du lieu
  const page = +req.query.page || 1;
  const limit = +req.query.limit || process.env.LIMIT_PRODUCTS;
  const skip = (page - 1) * limit;
  queryConmmand.skip(skip).limit(limit);
  // Execute query
  // Số Lượng sản phẩm thõa mản điều kiện !== số lượng sp trả về 1 lần gọi API
  queryConmmand.exec(async (err, response) => {
    if (err) throw new Error(err.message);
    const counts = await Blog.find(qr).countDocuments();
    return res.status(200).json({
      success: response ? true : false,
      counts,
      blogs: response ? response : "Cant not get product",
    });
  });
});


const addReview = asyncHandler(async (req, res) => {
  const { comment } = req.body;
  const { bid } = req.params;
  const userId = req.user._id;

  if (!comment) {
    return res.status(400).json({ success: false, message: "Comment is required" });
  }

  try {
    const blog = await Blog.findById(bid);

    if (!blog) {
      return res.status(404).json({ success: false, message: "Blog not found" });
    }

    const existingReview = blog.reviews.find(
      (review) => review.user.toString() === userId.toString()
    );

    const now = new Date();
    const twentyMinutes = 20 * 60 * 1000; 

    if (existingReview) {
      const timeSinceLastUpdate = now - existingReview.updatedAt;

      if (timeSinceLastUpdate < twentyMinutes) {
        return res.status(400).json({
          success: false,
          message: "You can only update your comment every 20 minutes."
        });
      }

  
      existingReview.comment = comment;
      existingReview.updatedAt = now;
    } else {
   
      const newReview = {
        user: userId,
        comment,
        createdAt: now,
        updatedAt: now
      };
      blog.reviews.push(newReview);
    }

    await blog.save();

    return res.status(201).json({
      success: true,
      message: existingReview ? "Review updated successfully" : "Review added successfully",
      reviews: blog.reviews,
    });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
});




// Khi người dùng like một bài blog thì :
// 1. Check người dùng đó trước đó có dislike hay không
// 2. Check xem người dùng trước đó có like hay chưa => bỏ like or thêm like

const likeBlog = asyncHandler(async (req, res) => {
  const { _id } = req.user;
  const { bid } = req.params;
  if (!bid) throw new Error("Missing input");
  const blog = await Blog.findById(bid);
  const alreadyDisliked = blog?.dislikes?.find((el) => el.toString() === _id);
  if (alreadyDisliked) {
    const response = await Blog.findByIdAndUpdate(
      bid,
      { $pull: { dislikes: _id } },
      { new: true }
    );
    return res.json({
      success: response ? true : false,
      rs: response,
    });
  }
  const isLiked = blog?.likes?.find((el) => el.toString() === _id);
  if (isLiked) {
    const response = await Blog.findByIdAndUpdate(
      bid,
      { $pull: { likes: _id } },
      { new: true }
    );
    return res.json({
      success: response ? true : false,
      rs: response,
    });
  } else {
    const response = await Blog.findByIdAndUpdate(
      bid,
      { $push: { likes: _id } },
      { new: true }
    );
    return res.json({
      success: response ? true : false,
      rs: response,
    });
  }
});

const dislikeBlog = asyncHandler(async (req, res) => {
  const { _id } = req.user;
  const { bid } = req.params;
  if (!bid) throw new Error("Missing input");
  const blog = await Blog.findById(bid);
  const alreadyliked = blog?.likes?.find((el) => el.toString() === _id);
  if (alreadyliked) {
    const response = await Blog.findByIdAndUpdate(
      bid,
      { $pull: { likes: _id } },
      { new: true }
    );
    return res.json({
      success: response ? true : false,
      rs: response,
    });
  }
  const isDisLiked = blog?.dislikes?.find((el) => el.toString() === _id);
  if (isDisLiked) {
    const response = await Blog.findByIdAndUpdate(
      bid,
      { $pull: { dislikes: _id } },
      { new: true }
    );
    return res.json({
      success: response ? true : false,
      rs: response,
    });
  } else {
    const response = await Blog.findByIdAndUpdate(
      bid,
      { $push: { dislikes: _id } },
      { new: true }
    );
    return res.json({
      success: response ? true : false,
      rs: response,
    });
  }
});

const getBlog = asyncHandler(async (req, res) => {
  const { bid } = req.params; 
  try {
    const blog = await Blog.findByIdAndUpdate(
      bid,
      { $inc: { numberView: 1 } },
      { new: true }
    )
      .populate("likes", "firstname lastname")
      .populate("dislikes", "firstname lastname")
      .populate("reviews.user", "firstname lastname avatar"); 

    if (!blog) {
      return res.status(404).json({
        success: false,
        message: "Blog not found",
      });
    }
    return res.status(200).json({
      success: true,
      blog,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
});


const deleteBlog = asyncHandler(async (req, res) => {
  const { bid } = req.params;
  const blog = await Blog.findByIdAndDelete(bid);
  return res.json({
    success: blog ? true : false,
    deletedBlog: blog || "Some thing went wrong",
  });
});


module.exports = {
  addReview,
  createNewBlog,
  updateBlog,
  getallBlog,
  likeBlog,
  dislikeBlog,
  getBlog,
  deleteBlog,
  // uploadImagesBlog
};
