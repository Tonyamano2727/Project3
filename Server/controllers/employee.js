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
        mes: "User already exists",
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
  try {
    const staff = await Employee.find();

    if (staff.length > 0) {
      return res.status(200).json({
        success: true,
        staff,
      });
    } else {
      return res.status(404).json({
        success: false,
        mes: "No employees found",
      });
    }
  } catch (error) {
    return res.status(500).json({
      success: false,
      mes: "Server error",
      error: error.message,
    });
  }
});

module.exports = {
  Registeremployee,
  updateEmployee,
  DeleteEmployee,
  getEmployee,
  getAllEmployees,
  getAllEmployee,
};
