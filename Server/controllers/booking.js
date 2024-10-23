const Booking = require("../models/booking");
const Service = require("../models/service");
const Supervisor = require('../models/supervisor');
const Employee = require("../models/employee");
const sendmail = require("../ultils/sendemail");
const Salary = require("../models/salary");

const createBooking = async (req, res) => {
  try {
    const { service, customerName, email, quantity, district, ...rest } = req.body;

    // Kiểm tra email khách hàng
    if (!email) {
      return res.status(400).json({ success: false, message: "Email của khách hàng không được xác định" });
    }

    // Kiểm tra xem dịch vụ có tồn tại hay không
    const foundService = await Service.findById(service);
    if (!foundService) {
      return res.status(404).json({ success: false, message: "Dịch vụ không tồn tại" });
    }

    // Tìm Supervisor cho quận tương ứng
    const foundSupervisor = await Supervisor.findOne({ district });
    if (!foundSupervisor) {
      console.warn("Không tìm thấy Supervisor cho quận này");
    }

    const totalPrice = foundService.price * quantity;

    // Lưu thông tin booking
    const booking = new Booking(req.body);
    await booking.save();

    const adminEmail = "toanb3074@gmail.com"; 
    const recipients = [email, adminEmail];
    
    if (foundSupervisor && foundSupervisor.email) {
      recipients.push(foundSupervisor.email);
    }

    const mailOptions = {
      to: recipients, // Chuyển danh sách người nhận vào đây
      subject: "Booking Confirmation",
      html: `
        <h1>Booking a successful service</h1>
        <p>Hello ${customerName},</p>
        <p>We have received a booking request: <strong>${foundService.title}</strong>.</p>
        <p>Order Information</p>
        <ul>
            <li>Customer Name: ${customerName}</li>
            <li>Service: ${foundService.title}</li>
            <li>Day: ${rest.date}</li>
            <li>Hour: ${rest.timeSlot}</li>
            <li>Amount: ${quantity}</li>
            <li>Notes: ${rest.notes}</li>
            <li>Total Price of Service: ${totalPrice.toLocaleString('vi-VN', { style: 'currency', currency: 'VND' })}</li>
            <li>District: ${district}</li>
        </ul>
        <p>Thank you for using our service!</p>
      `,
    };

    const info = await sendmail(mailOptions); // Gọi hàm sendmail với mailOptions
    console.log("Email đã được gửi thành công:", info.response);

    res.status(201).json({ success: true, data: booking });
  } catch (error) {
    console.error("Gửi email thất bại:", error);
    res.status(400).json({ success: false, error: error.message });
  }
};

const updateBooking = async (req, res) => {
  try {
    const { bkid } = req.params; // Lấy booking ID từ tham số yêu cầu
    const updatedData = req.body; // Lấy dữ liệu cập nhật từ body yêu cầu

    // Tìm booking theo ID
    const updatedBooking = await Booking.findById(bkid);

    // Kiểm tra nếu booking tồn tại
    if (!updatedBooking) {
      return res.status(404).json({ success: false, message: "Booking không tồn tại." });
    }

    // Cập nhật nhân viên phụ trách nếu có
    if (updatedData.employeeId) {
      // Tìm tất cả nhân viên tương ứng dựa trên ID được cung cấp
      const employees = await Employee.find({ _id: { $in: updatedData.employeeId } });

      // Kiểm tra nếu có nhân viên nào được tìm thấy
      if (employees.length === 0) {
        return res.status(404).json({ success: false, message: "Không có nhân viên nào tồn tại." });
      }

      // Tạo mảng để giữ ID và tên nhân viên
      updatedBooking.employeeDetails = employees.map(employee => ({
        employeeId: employee._id.toString(), // Giữ ID nhân viên
        name: employee.name, // Giữ tên nhân viên
      }));
    }

    // Cập nhật thông tin booking từ body yêu cầu
    Object.assign(updatedBooking, updatedData);

    // Tính toán tổng giá nếu số lượng hoặc dịch vụ thay đổi
    if (updatedData.quantity || updatedData.service) {
      if (updatedData.service) {
        const service = await Service.findById(updatedData.service);
        if (service) {
          updatedBooking.category = service.category; // Cập nhật loại dịch vụ dựa trên dịch vụ
          updatedBooking.totalPrice =
            service.price * (updatedData.quantity || updatedBooking.quantity); // Tính toán lại tổng giá
        }
      } else {
        updatedBooking.totalPrice =
          updatedBooking.totalPrice ||
          (updatedBooking.quantity * updatedBooking.totalPrice) / updatedBooking.quantity;
      }
    }

    // Lưu thông tin booking đã cập nhật vào cơ sở dữ liệu
    await updatedBooking.save();

    // Nếu trạng thái booking được cập nhật thành "Completed", tính lương cho nhân viên
    if (updatedBooking.status === "Completed") {
      const employeeIds = updatedBooking.employeeDetails.map(detail => detail.employeeId);
      const month = new Date().getMonth() + 1; // Tháng hiện tại
      const year = new Date().getFullYear(); // Năm hiện tại

      // Kiểm tra nếu employeeId là hợp lệ
      if (employeeIds.length > 0) {
        const employeeId = employeeIds[0]; // Lấy ID của nhân viên đầu tiên (hoặc bạn có thể thay đổi theo logic của mình)

        // Tính toán lương cho nhân viên
        const employee = await Employee.findById(employeeId);
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

       
        if (completedBookings.length > 0) {
      
          const totalBookingValue = completedBookings.reduce((sum, booking) => sum + booking.totalPrice, 0);
          const commission = totalBookingValue * 0.30; 

     
          const totalSalary = employee.baseSalary + commission;

          
          const bookingDetails = completedBookings.map(booking => ({
            bookingId: booking._id,
            totalPrice: booking.totalPrice,
            createdAt: booking.createdAt
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
        }
      }
    }

    // Bao gồm thông tin nhân viên trong phản hồi
    return res.status(200).json({ 
      success: true, 
      data: { 
        ...updatedBooking.toObject(), 
      } 
    });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};


const getBookings = async (req, res) => {
  const { _id } = req.user; 
  const supervisor = await Supervisor.findById(_id); 

  if (!supervisor) {
    return res.status(404).json({
      success: false,
      mes: "Supervisor not found",
    });
  }

  const bookings = await Booking.find({ district: supervisor.district }); 

  return res.status(200).json({
    success: true,
    bookings,
  });
};

const getAllBookings = async (req, res) => {
  const queries = { ...req.query };
  // Tách các trường dặt biệt
  const excludeFields = ["limit", "sort", "page", "fields"];
  excludeFields.forEach((el) => delete queries[el]);

  // Format lại các operator cho đúng cú pháp mongoose
  let queryString = JSON.stringify(queries);
  queryString = queryString.replace(
    /\b(gte|gt|lt|lte)\b/g,
    (matchedEl) => `$${matchedEl}`
  );
  const formatedQueries = JSON.parse(queryString);

  // Filtering
  if (queries?.name)
    formatedQueries.name = { $regex: queries.name, $options: "i" };

  if (req.query.q) {
    delete formatedQueries.q;
    formatedQueries["$or"] = [
      { customerName: { $regex: req.query.q, $options: "i" } },
      { email: { $regex: req.query.q, $options: "i" } },
      { phone: { $regex: req.query.q, $options: "i" } },
      { status: { $regex: req.query.q, $options: "i" } },
      { category: { $regex: req.query.q, $options: "i" } },
      { "service.title": { $regex: req.query.q, $options: "i" } }, 
    ];
  }
  
  let queryCommand = Booking.find(formatedQueries).populate('service', 'title');

  // Sorting
  if (req.query.sort) {
    const sortBy = req.query.sort.split(",").join(" ");
    queryCommand = queryCommand.sort(sortBy);
  }

  // Fields limiting
  if (req.query.fields) {
    const fields = req.query.fields.split(",").join(" ");
    queryCommand = queryCommand.select(fields);
  }

  // Pagination
  const page = +req.query.page || 1;
  const limit = +req.query.limit || process.env.LIMIT_PRODUCTS;
  const skip = (page - 1) * limit;
  queryCommand.skip(skip).limit(limit);

  // Execute query
  queryCommand.exec(async (err, response) => {
    if (err) throw new Error(err.message);
    const counts = await Booking.find(formatedQueries).countDocuments();
    return res.status(200).json({
      success: response ? true : false,
      counts,
      bookings: response ? response : "Cannot get bookings",
    });
  });
};

const getBookingDetail = async (req, res) => {
  try {
    const { bkid } = req.params; // Lấy ID booking từ request parameters

    // Tìm kiếm booking theo ID
    const booking = await Booking.findById(bkid).populate('service', 'title employeeDetails'); // Giả sử bạn muốn lấy thông tin dịch vụ và chi tiết nhân viên

    // Kiểm tra xem booking có tồn tại không
    if (!booking) {
      return res.status(404).json({ success: false, message: "Booking không tồn tại." });
    }

    return res.status(200).json({ success: true, data: booking }); // Trả về thông tin booking
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};


module.exports = {
  createBooking,
  updateBooking,
  getBookings,
  getAllBookings,getBookingDetail
};
