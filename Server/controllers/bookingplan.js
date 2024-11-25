const BookingPlan = require("../models/bookingplan");
const ServicePlan = require("../models/planservice");
const Supervisor = require("../models/supervisor");
const Employee = require("../models/employee");
const HotDistrict = require("../models/hotdistric");
const sendMail = require("../ultils/sendemail");
const asyncHandler = require("express-async-handler");
const Salary = require("../models/salary");

const createBookingPlan = asyncHandler(async (req, res) => {
  try {
    const { service, customerName, email, quantity, district, ...rest } = req.body;

    if (!email) {
      return res.status(400).json({ success: false, message: "Email của khách hàng không được xác định" });
    }

    const foundServicePlan = await ServicePlan.findById(service);
    if (!foundServicePlan) {
      return res.status(404).json({ success: false, message: "Dịch vụ không tồn tại" });
    }

    const foundSupervisor = await Supervisor.findOne({ district });
    if (!foundSupervisor) {
      console.warn("Không tìm thấy Supervisor cho quận này");
    }

    const hotDistrict = await HotDistrict.findOne({ name: district });
    const isHotDistrict = hotDistrict !== null;

    const totalPrice = isHotDistrict ? foundServicePlan.price * quantity * 1.1 : foundServicePlan.price * quantity;

    const bookingPlan = new BookingPlan({
      ...req.body,
      service: foundServicePlan._id,
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

    // Tìm booking plan theo ID
    const bookingPlan = await BookingPlan.findById(id);
    if (!bookingPlan) {
      return res.status(404).json({ success: false, message: "Không tìm thấy booking plan" });
    }

    // Cập nhật thông tin nhân viên nếu có
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

    // Cập nhật các trường thông tin khác
    Object.assign(bookingPlan, updatedData);

    // Cập nhật tổng giá trị booking plan nếu có thay đổi về dịch vụ hoặc số lượng
    if (updatedData.quantity || updatedData.service) {
      const servicePlan = await ServicePlan.findById(updatedData.service || bookingPlan.service);
      if (servicePlan) {
        bookingPlan.totalPrice = servicePlan.price * (updatedData.quantity || bookingPlan.quantity);
        bookingPlan.service = servicePlan._id;
      }
    }

    // Lưu booking plan đã cập nhật
    await bookingPlan.save();

    // Nếu trạng thái booking plan được cập nhật thành "Completed", tính lương cho nhân viên
    if (bookingPlan.status === "Completed") {
      const employeeIds = bookingPlan.employeeDetails.map(detail => detail.employeeId);
      const month = new Date().getMonth() + 1;
      const year = new Date().getFullYear();

      if (employeeIds.length > 0) {
        const employeeId = employeeIds[0];

        // Tìm thông tin nhân viên
        const employee = await Employee.findById(employeeId);
        if (employee) {
          // Tính tổng giá trị các booking plan "Completed" của nhân viên trong tháng
          const completedBookings = await BookingPlan.find({
            employeeDetails: { $elemMatch: { employeeId } },
            status: "Completed",
            createdAt: { $gte: new Date(year, month - 1, 1), $lt: new Date(year, month, 1) }
          });

          // Nếu có booking plan "Completed" trong tháng
          if (completedBookings.length > 0) {
            const totalBookingValue = completedBookings.reduce((sum, booking) => sum + booking.totalPrice, 0);
            const commission = totalBookingValue * 0.30;
            const totalSalary = employee.baseSalary + commission;

            // Lưu chi tiết các booking plan "Completed"
            const bookingDetails = completedBookings.map(booking => ({
              bookingId: booking._id,
              totalPrice: booking.totalPrice,
              createdAt: booking.createdAt
            }));

            // Kiểm tra xem bản ghi lương đã tồn tại chưa
            const existingSalaryRecord = await Salary.findOne({
              employee: employeeId,
              month: month,
              year: year
            });

            if (existingSalaryRecord) {
              // Nếu tồn tại, cập nhật lại tổng lương và chi tiết booking plan
              existingSalaryRecord.baseSalary = employee.baseSalary;
              existingSalaryRecord.commission = commission;
              existingSalaryRecord.totalSalary = totalSalary;
              existingSalaryRecord.bookings = bookingDetails;
              await existingSalaryRecord.save();
            } else {
              // Nếu chưa tồn tại, tạo bản ghi lương mới
              const salaryRecord = new Salary({
                employee: employeeId,
                month: month,
                year: year,
                baseSalary: employee.baseSalary,
                commission: commission,
                totalSalary: totalSalary,
                bookings: bookingDetails
              });
              await salaryRecord.save();
            }
          }
        }
      }
    }

    // Trả về dữ liệu booking plan đã được cập nhật
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
const getBookingPlansBySupervisor = asyncHandler(async (req, res) => {
  try {
    const { supervisorId } = req.query; // ID của Supervisor

    if (!supervisorId) {
      return res.status(400).json({ success: false, message: "Supervisor ID is required" });
    }

    // Tìm Supervisor dựa trên supervisorId
    const supervisor = await Supervisor.findById(supervisorId);
    if (!supervisor) {
      return res.status(404).json({ success: false, message: "Supervisor not found" });
    }

    // Lọc các Booking Plan theo quận phụ trách của Supervisor
    const bookingPlans = await BookingPlan.find({ district: supervisor.district })
      .populate("service", "title price") // Lấy thông tin dịch vụ
      .populate("hotDistrict", "name") // Lấy thông tin quận hot
      .sort({ createdAt: -1 }); // Sắp xếp theo ngày tạo, mới nhất trước

    res.status(200).json({
      success: true,
      data: bookingPlans,
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});





module.exports = {
  createBookingPlan,
  updateBookingPlan,
  getBookingPlanDetail,
  getBookingPlansBySupervisor,
};
