const asyncHandler = require("express-async-handler");
const Employee = require("../models/employee");
const Booking = require("../models/booking");
const Salary = require("../models/salary");
const mongoose = require("mongoose");


const calculateSalary = asyncHandler(async (req, res) => {
    const { month, year } = req.body; // Lấy month và year từ body
    const employeeId = req.params.employeeId; // Lấy employeeId từ params
    console.log(employeeId);
    // Kiểm tra nếu employeeId không tồn tại hoặc không hợp lệ
    if (!employeeId || !mongoose.Types.ObjectId.isValid(employeeId)) {
        return res.status(400).json({
            success: false,
            mes: "ID nhân viên không hợp lệ.",
        });
    }

    // Tìm nhân viên theo ID
    const employee = await Employee.findById(employeeId);
    if (!employee) {
        return res.status(404).json({
            success: false,
            mes: "Nhân viên không tồn tại.",
        });
    }
    console.log(employee);
    // Kiểm tra tháng và năm nhập vào
    console.log("Tháng nhập vào:", month);
    console.log("Năm nhập vào:", year);

    // Lấy tất cả các booking đã hoàn thành của nhân viên trong tháng và năm đã cho
    const completedBookings = await Booking.find({
        employeeDetails: {
            $elemMatch: {
                employeeId: employeeId // Kiểm tra employeeId trong mảng employeeDetails
            }
        },
        status: "Completed",
        createdAt: {
            $gte: new Date(year, month - 1, 1), // Bắt đầu từ ngày 1 của tháng
            $lt: new Date(year, month, 1) // Trước ngày 1 của tháng sau
        }
    });
    console.log('Dữ liệu booking:', completedBookings); // Thêm log để kiểm tra dữ liệu trả về

    // Kiểm tra nếu không có booking nào
    if (completedBookings.length === 0) {
        return res.status(404).json({
            success: true,
            mes: "Không có booking nào đã hoàn thành cho nhân viên này trong tháng và năm đã cho.",
            data: [] // Trả về mảng rỗng
        });
    }

    // Tính lương theo % từ giá trị booking
    const totalBookingValue = completedBookings.reduce((sum, booking) => sum + booking.totalPrice, 0);
    const commission = totalBookingValue * 0.30; // 30% từ giá trị booking

    // Tính tổng lương
    const totalSalary = employee.baseSalary + commission;

    // Kiểm tra xem giá trị lương có hợp lệ hay không
    if (isNaN(totalSalary) || !employee.baseSalary) {
        return res.status(400).json({
            success: false,
            mes: "Có lỗi xảy ra khi tính toán lương.",
        });
    }

    // Lưu thông tin chi tiết về các booking đã hoàn thành
    const bookingDetails = completedBookings.map(booking => ({
        bookingId: booking._id,
        totalPrice: booking.totalPrice,
        createdAt: booking.createdAt // Thêm trường createdAt để ghi lại thời gian thực hiện booking
    }));

    // Lưu kết quả vào model Salary
    const salaryRecord = new Salary({
        employee: employeeId,
        month: month,
        year: year,
        baseSalary: employee.baseSalary,
        commission: commission,
        totalSalary: totalSalary,
        bookings: bookingDetails 
    });

    // Lưu thông tin lương
    await salaryRecord.save();

    return res.json({
        success: true,
        data: {
            totalSalary: totalSalary,
            commission: commission,
            bookingDetails: bookingDetails 
        },
    });
});

const getAllSalaries = asyncHandler(async (req, res) => {
    try {
        // Lấy tất cả các bản ghi từ model Salary
        const salaries = await Salary.find().populate("employee", "name"); // Populating tên nhân viên

        return res.json({
            success: true,
            data: salaries,
        });
    } catch (error) {
        return res.status(500).json({
            success: false,
            mes: "Có lỗi xảy ra khi lấy dữ liệu bảng lương.",
            error: error.message,
        });
    }
});

module.exports = {
  calculateSalary,
  getAllSalaries,
};
