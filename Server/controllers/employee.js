const asyncHandler = require("express-async-handler");
const Employee = require("../models/employee");
const Supervisor = require("../models/supervisor");
const Servicecategory = require("../models/servicecategory");

const Registeremployee = asyncHandler(async (req, res) => {
  try {
    const { email, mobile, name, job, district, baseSalary } = req.body;

    console.log("Request Body:", req.body);
    console.log("File Received:", req.file);

    // Kiểm tra các trường bắt buộc
    if (!email || !mobile || !name || !job || !district || !baseSalary) {
      return res.status(400).json({
        success: false,
        mes: "Missing required fields",
      });
    }

    // Kiểm tra định dạng email
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return res.status(400).json({
        success: false,
        mes: "Invalid email format",
      });
    }

    // Kiểm tra định dạng số điện thoại
    const phoneRegex = /^[0-9]{10,12}$/;
    if (!phoneRegex.test(mobile)) {
      return res.status(400).json({
        success: false,
        mes: "Invalid phone number format",
      });
    }

    // Kiểm tra nếu nhân viên đã tồn tại
    const employee = await Employee.findOne({ email });
    if (employee) {
      return res.status(400).json({
        success: false,
        mes: "Employee already exists",
      });
    }

    // Tạo dữ liệu nhân viên mới
    const newEmployeeData = {
      email,
      mobile,
      name,
      job,
      district,
      avatar: req.file?.path || null, // Nếu không có ảnh, giá trị là null
      baseSalary,
    };

    console.log("New Employee Data:", newEmployeeData);

    // Lưu nhân viên vào cơ sở dữ liệu
    const newEmployee = await Employee.create(newEmployeeData);

    console.log("Employee Created:", newEmployee);

    return res.status(200).json({
      success: true,
      mes: "Register successfully",
      employee: newEmployee,
      avatarInfo: req.file
        ? {
            fileName: req.file.filename,
            url: req.file.path,
          }
        : null,
    });
  } catch (error) {
    console.error("Error in Registeremployee:", error);

    return res.status(500).json({
      success: false,
      mes: "Internal server error",
      error: error.message,
    });
  }
});

const updateEmployee = asyncHandler(async (req, res) => {
  try {
    const { eid } = req.params;
    const { email, mobile, name, job, baseSalary } = req.body;

    const updatedData = {
      email,
      mobile,
      name,
      job,
      baseSalary,
    };

    if (req.file) updatedData.avatar = req.file.path;

    const updatedEmployee = await Employee.findByIdAndUpdate(eid, updatedData, {
      new: true,
    });

    if (!updatedEmployee) {
      return res.status(404).json({
        success: false,
        mes: "Employee not found",
      });
    }

    return res.status(200).json({
      success: true,
      mes: "Employee updated successfully",
      employee: updatedEmployee,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      mes: error.message,
    });
  }
});

const DeleteEmployee = asyncHandler(async (req, res) => {
  try {
    const { eid } = req.params;

    const deletedEmployee = await Employee.findByIdAndDelete(eid);
    if (!deletedEmployee) {
      return res.status(404).json({
        success: false,
        mes: "Employee not found",
      });
    }

    return res.status(200).json({
      success: true,
      mes: "Employee permanently deleted",
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      mes: error.message,
    });
  }
});

const getEmployee = asyncHandler(async (req, res) => {
  try {
    const { eid } = req.params;
    const employee = await Employee.findById(eid);

    if (!employee) {
      return res.status(404).json({
        success: false,
        mes: "Employee not found",
      });
    }

    return res.status(200).json({
      success: true,
      employee,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      mes: error.message,
    });
  }
});

const getAllEmployees = asyncHandler(async (req, res) => {
  const { _id } = req.user;
  const supervisor = await Supervisor.findById(_id);

  if (!supervisor) {
    return res.status(404).json({
      success: false,
      mes: "Supervisor not found",
    });
  }

  const staff = await Employee.find({ district: supervisor.district });

  return res.status(200).json({
    success: true,
    staff,
  });
});

const getAllEmployee = asyncHandler(async (req, res) => {
  let queries = { ...req.query };

  // Tách các trường dặt biệt không phải là phần lọc
  const excludeFields = ["limit", "sort", "page", "fields"];
  excludeFields.forEach((el) => delete queries[el]);

  // Format lại các operator cho đúng cú pháp mongoose (gte, lte, gt, lt)
  let queryString = JSON.stringify(queries);
  queryString = queryString.replace(
    /\b(gte|gt|lt|lte)\b/g,
    (matchedEl) => `$${matchedEl}`
  );
  const formatedQueries = JSON.parse(queryString);

  // Lọc theo tên nếu có
  if (queries?.name) {
    formatedQueries.name = { $regex: queries.name, $options: "i" };
  }

  // Nếu có query "q" (tìm kiếm chung), lọc theo nhiều trường
  if (req.query.q) {
    delete formatedQueries.q;
    formatedQueries["$or"] = [
      { name: { $regex: req.query.q, $options: "i" } },
      { district: { $regex: req.query.q, $options: "i" } },
      { job: { $regex: req.query.q, $options: "i" } },
      { mobile: { $regex: req.query.q, $options: "i" } },
    ];
  }

  let queryConmmand = Employee.find(formatedQueries);

  // Sắp xếp nếu có tham số sort
  if (req.query.sort) {
    const sortBy = req.query.sort.split(",").join(" ");
    queryConmmand = queryConmmand.sort(sortBy);
  }

  // Lấy trường cụ thể nếu có tham số fields
  if (req.query.fields) {
    const fields = req.query.fields.split(",").join(" ");
    queryConmmand = queryConmmand.select(fields);
  }

  // Phân trang (pagination)
  const page = +req.query.page || 1;
  const limit = +req.query.limit || process.env.LIMIT_PRODUCTS;
  const skip = (page - 1) * limit;
  queryConmmand.skip(skip).limit(limit);

  queryConmmand.exec(async (err, response) => {
    if (err) throw new Error(err.message);
    const counts = await Employee.find(formatedQueries).countDocuments();
    return res.status(200).json({
      success: response ? true : false,
      counts,
      staff: response ? response : "Cant not get staff",
    });
  });
});

module.exports = {
  Registeremployee,
  updateEmployee,
  DeleteEmployee,
  getEmployee,
  getAllEmployees,
  getAllEmployee,
};
