const BookingPlan = require("../models/bookingplan");
const Service = require("../models/service");
const Supervisor = require("../models/supervisor");
const Employee = require("../models/employee");
const HotDistrict = require("../models/hotdistric");
const sendMail = require("../utils/sendemail");
const asyncHandler = require("express-async-handler");
const Salary = require("../models/salary");

const createBookingPlan = asyncHandler(async (req, res) => {
  try {
    const { service, customerName, email, quantity, district, ...rest } = req.body;

    if (!email) {
      return res.status(400).json({ success: false, message: "Email của khách hàng không được xác định" });
    }

    const foundService = await Service.findById(service);
    if (!foundService) {
      return res.status(404).json({ success: false, message: "Dịch vụ không tồn tại" });
    }

    const foundSupervisor = await Supervisor.findOne({ district });
    if (!foundSupervisor) {
      console.warn("Không tìm thấy Supervisor cho quận này");
    }

    const hotDistrict = await HotDistrict.findOne({ name: district });
    const isHotDistrict = hotDistrict !== null;

    const totalPrice = isHotDistrict ? foundService.price * quantity * 1.1 : foundService.price * quantity;

    const bookingPlan = new BookingPlan({
      ...req.body,
      service: foundService._id,
      hotDistrict: isHotDistrict ? hotDistrict._id : null,
      totalPrice
    });

    await bookingPlan.save();

    const adminEmail = "toanb3074@gmail.com"; 
    const recipients = [email, adminEmail];
    
    if (foundSupervisor && foundSupervisor.email) {
      recipients.push(foundSupervisor.email);
    }

    await sendMail({
      to: recipients,
      subject: "Booking Plan Confirmation",
      text: `Cảm ơn ${customerName} đã đặt lịch với chúng tôi!`
    });

    res.status(201).json({ success: true, data: bookingPlan });
  } catch (error) {
    console.error("Gửi email thất bại:", error);
    res.status(400).json({ success: false, error: error.message });
  }
});

const updateBookingPlan = asyncHandler(async (req, res) => {
  try {
    const { id } = req.params;
    const updatedData = req.body;

    const bookingPlan = await BookingPlan.findById(id);
    if (!bookingPlan) {
      return res.status(404).json({ success: false, message: "Không tìm thấy booking plan" });
    }

    if (updatedData.employeeId) {
      const employees = await Employee.find({ _id: { $in: updatedData.employeeId } });
      if (employees.length === 0) {
        return res.status(404).json({ success: false, message: "Không có nhân viên nào tồn tại." });
      }
      bookingPlan.employeeDetails = employees.map(employee => ({
        employeeId: employee._id.toString(),
        name: employee.name,
      }));
    }

    Object.assign(bookingPlan, updatedData);

    if (updatedData.quantity || updatedData.service) {
      const service = await Service.findById(updatedData.service || bookingPlan.service);
      if (service) {
        bookingPlan.totalPrice = service.price * (updatedData.quantity || bookingPlan.quantity);
        bookingPlan.service = service._id;
      }
    }

    await bookingPlan.save();

    res.status(200).json({ success: true, data: bookingPlan });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

const getBookingPlanDetail = asyncHandler(async (req, res) => {
  try {
    const { id } = req.params;

    const bookingPlan = await BookingPlan.findById(id).populate('service', 'title');
    if (!bookingPlan) {
      return res.status(404).json({ success: false, message: "Booking Plan không tồn tại." });
    }

    res.status(200).json({ success: true, data: bookingPlan });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

const calculateMonthlySalary = asyncHandler(async () => {
  const month = new Date().getMonth() + 1;
  const year = new Date().getFullYear();

  const completedBookings = await BookingPlan.find({
    status: "Completed",
    createdAt: { $gte: new Date(year, month - 1, 1), $lt: new Date(year, month, 1) }
  });

  const employeeSalaryData = {};

  for (const booking of completedBookings) {
    const { employeeDetails, totalPrice } = booking;

    employeeDetails.forEach(({ employeeId }) => {
      if (!employeeSalaryData[employeeId]) {
        employeeSalaryData[employeeId] = { bookings: [], baseSalary: 0, commission: 0, totalSalary: 0 };
      }
      employeeSalaryData[employeeId].bookings.push({ bookingId: booking._id, totalPrice, createdAt: booking.createdAt });
      employeeSalaryData[employeeId].commission += totalPrice * 0.30;
    });
  }

  for (const [employeeId, salaryData] of Object.entries(employeeSalaryData)) {
    const employee = await Employee.findById(employeeId);
    if (employee) {
      const totalSalary = employee.baseSalary + salaryData.commission;
      const existingSalaryRecord = await Salary.findOne({
        employee: employeeId,
        month,
        year
      });

      if (existingSalaryRecord) {
        existingSalaryRecord.baseSalary = employee.baseSalary;
        existingSalaryRecord.commission = salaryData.commission;
        existingSalaryRecord.totalSalary = totalSalary;
        existingSalaryRecord.bookings = salaryData.bookings;
        await existingSalaryRecord.save();
      } else {
        const salaryRecord = new Salary({
          employee: employeeId,
          month,
          year,
          baseSalary: employee.baseSalary,
          commission: salaryData.commission,
          totalSalary,
          bookings: salaryData.bookings
        });
        await salaryRecord.save();
      }
    }
  }
});

module.exports = {
  createBookingPlan,
  updateBookingPlan,
  getBookingPlanDetail,
  calculateMonthlySalary
};
