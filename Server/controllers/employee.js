const asyncHandler = require("express-async-handler");
const Employee = require("../models/employee");
const Supervisor = require("../models/supervisor");
const Servicecategory = require("../models/servicecategory");

const Registeremployee = asyncHandler(async (req, res) => {
  try {
    const { email, mobile, name, job, district, baseSalary } = req.body;

    if (
      !email ||
      !mobile ||
      !name ||
      !job ||
      !district ||
      !req.file ||
      !baseSalary
    ) {
      return res.status(400).json({
        success: false,
        mes: "Missing input",
      });
    }

    const employee = await Employee.findOne({ email });
    if (employee) {
      return res.status(400).json({
        success: false,
        mes: "Employee already exists",
      });
    }

    const newEmployeeData = {
      email,
      mobile,
      name,
      job,
      district,
      avatar: req.file.path,
      baseSalary,
    };

    const newEmployee = await Employee.create(newEmployeeData);

    return res.status(200).json({
      success: true,
      mes: "Register successfully",
      employee: newEmployee,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      mes: error.message,
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
