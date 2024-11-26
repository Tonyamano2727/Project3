const express = require("express");
const asyncHandler = require("express-async-handler");
const Supervisor = require("../models/supervisor");
const Employee = require("../models/employee");
const {
  generrateAccessToken,
  generrateRefreshToken,
} = require("../middlewares/jwt");
const supervisor = require("../models/supervisor");

const getSupervisors = asyncHandler(async (req, res) => {
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
  // Filtering
  if (queries?.name)
    formatedQueries.name = { $regex: queries.name, $options: "i" };

  if (req.query.q) {
    delete formatedQueries.q;
    formatedQueries["$or"] = [
      { district: { $regex: req.query.q, $options: "i" } },
      { name: { $regex: req.query.q, $options: "i" } },
      { email: { $regex: req.query.q, $options: "i" } },
      { phone: { $regex: req.query.q, $options: "i" } },
    ];
  }
  let queryConmmand = Supervisor.find(formatedQueries);

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
    const counts = await Supervisor.find(formatedQueries).countDocuments();
    return res.status(200).json({
      success: response ? true : false,
      counts,
      supervisor: response ? response : "Cant not get product",
    });
  });
});

const getSupervisorById = asyncHandler(async (req, res) => {
  try {
    const supervisor = await Supervisor.findById(req.params.id);
    if (!supervisor) {
      return res
        .status(404)
        .json({ success: false, mes: "Supervisor not found" });
    }
    return res.status(200).json({ success: true, data: supervisor });
  } catch (error) {
    return res.status(500).json({ success: false, mes: error.message });
  }
});

const updateSupervisor = asyncHandler(async (req, res) => {
  try {
    const supervisor = await Supervisor.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true }
    );
    if (!supervisor) {
      return res
        .status(404)
        .json({ success: false, mes: "Supervisor not found" });
    }
    return res.status(200).json({ success: true, data: supervisor });
  } catch (error) {
    return res.status(500).json({ success: false, mes: error.message });
  }
});

const deleteSupervisor = asyncHandler(async (req, res) => {
  try {
    const { spid } = req.params;
    const supervisor = await Supervisor.findByIdAndDelete(spid);
    if (!supervisor) {
      return res
        .status(404)
        .json({ success: false, mes: "Supervisor not found" });
    }
    return res
      .status(200)
      .json({ success: true, mes: "Supervisor deleted successfully" });
  } catch (error) {
    return res.status(500).json({ success: false, mes: error.message });
  }
});

const registerSupervisor = asyncHandler(async (req, res) => {
  const { name, email, password, district, phone } = req.body;

  // Kiểm tra đầu vào
  if (!name || !email || !password || !district || !phone) {
    return res.status(400).json({ success: false, mes: "Missing input" });
  }

  // Kiểm tra xem Supervisor đã tồn tại chưa
  const supervisorExists = await Supervisor.findOne({ email });
  if (supervisorExists) {
    return res
      .status(400)
      .json({ success: false, mes: "Supervisor already exists" });
  }

  // Tạo Supervisor mới
  const supervisor = await Supervisor.create({
    name,
    email,
    password,
    district,
    phone,
  });

  if (supervisor) {
    // Tạo access token và refresh token
    const accessToken = generrateAccessToken(supervisor._id);
    const refreshToken = generrateRefreshToken(supervisor._id);

    return res.status(201).json({
      success: true,
      _id: supervisor._id,
      name: supervisor.name,
      email: supervisor.email,
      accessToken, // Gửi access token
      refreshToken, // Gửi refresh token
    });
  } else {
    return res
      .status(400)
      .json({ success: false, mes: "Invalid Supervisor data" });
  }
});

const loginSupervisor = asyncHandler(async (req, res) => {
  const { email, password } = req.body;
  const supervisor = await Supervisor.findOne({ email });

  if (!supervisor || !(await supervisor.matchPassword(password))) {
    return res.status(401).json({
      success: false,
      message: "Invalid email or password",
    });
  }

  const accessToken = generrateAccessToken(supervisor._id, supervisor.role); // Ensure consistent naming
  const refreshToken = generrateRefreshToken(supervisor._id); // Ensure consistent naming

  // Save tokens to localStorage (assuming you have a frontend mechanism to do this)
  // You would typically handle this in your frontend code after receiving the response
  return res.status(200).json({
    success: true,
    accessToken, // Updated naming
    refreshToken, // Updated naming
    supervisor: {
      id: supervisor._id,
      name: supervisor.name,
      district: supervisor.district,
      role: supervisor.role,
    },
  });
});

const getDistricts = asyncHandler(async (req, res) => {
  try {
    const supervisor = await Supervisor.findById(req.user._id);

    if (!supervisor) {
      return res.status(404).json({
        success: false,
        mes: "Supervisor not found",
      });
    }

    return res.status(200).json({
      success: true,
      districts: [supervisor.district],
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      mes: error.message,
    });
  }
});

module.exports = {
  registerSupervisor,
  loginSupervisor,
  getSupervisors,
  updateSupervisor,
  getSupervisorById,
  deleteSupervisor,
  getDistricts,
};
