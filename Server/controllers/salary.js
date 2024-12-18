const asyncHandler = require("express-async-handler");
const Employee = require("../models/employee");
const Booking = require("../models/booking");
const Salary = require("../models/salary");
const Supervisor = require("../models/supervisor");

const mongoose = require("mongoose");

const calculateSalary = asyncHandler(async (req, res) => {
  const { month, year } = req.body;
  const employeeId = req.params.employeeId;

  if (!employeeId || !mongoose.Types.ObjectId.isValid(employeeId)) {
    return res.status(400).json({
      success: false,
      mes: "ID nhân viên không hợp lệ.",
    });
  }

  const employee = await Employee.findById(employeeId);
  if (!employee) {
    return res.status(404).json({
      success: false,
      mes: "Nhân viên không tồn tại.",
    });
  }

  const completedBookings = await Booking.find({
    employeeDetails: {
      $elemMatch: {
        employeeId: employeeId,
      },
    },
    status: "Completed",
    createdAt: {
      $gte: new Date(year, month - 1, 1),
      $lt: new Date(year, month, 1),
    },
  });

  let commission = 0;
  let bookingDetails = [];

  if (completedBookings.length > 0) {
    const totalBookingValue = completedBookings.reduce(
      (sum, booking) => sum + booking.totalPrice,
      0
    );
    commission = totalBookingValue * 0.3;

    bookingDetails = completedBookings.map((booking) => ({
      bookingId: booking._id,
      totalPrice: booking.totalPrice,
      createdAt: booking.createdAt,
    }));
  }

  const totalSalary = employee.baseSalary + commission;

  const existingSalaryRecord = await Salary.findOne({
    employee: employeeId,
    month: month,
    year: year,
  });

  if (existingSalaryRecord) {
    existingSalaryRecord.baseSalary = employee.baseSalary;
    existingSalaryRecord.commission = commission;
    existingSalaryRecord.totalSalary = totalSalary;
    existingSalaryRecord.bookings = bookingDetails;
    await existingSalaryRecord.save();
  } else {
    const salaryRecord = new Salary({
      employee: employeeId,
      month: month,
      year: year,
      baseSalary: employee.baseSalary,
      commission: commission,
      totalSalary: totalSalary,
      bookings: bookingDetails,
    });
    await salaryRecord.save();
  }

  return res.json({
    success: true,
    data: {
      totalSalary: totalSalary,
      commission: commission,
      bookingDetails: bookingDetails,
    },
  });
});

const getAllSalaries = asyncHandler(async (req, res) => {
  const { _id } = req.user; // Get supervisor's ID from the authenticated user
  const supervisor = await Supervisor.findById(_id);

  if (!supervisor) {
    return res.status(404).json({
      success: false,
      mes: "Supervisor not found",
    });
  }

  // Find employees in the same district as the supervisor
  const staff = await Employee.find({ district: supervisor.district });

  // Get the salaries for employees in the same district
  const salaries = await Salary.find({
    employee: { $in: staff.map(employee => employee._id) }, // Match employees in the district
  }).populate("employee", "name district");

  return res.status(200).json({
    success: true,
    data: salaries,
  });
});




module.exports = {
  calculateSalary,
  getAllSalaries,
};
