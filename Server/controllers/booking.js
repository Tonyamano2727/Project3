const Booking = require("../models/booking");
const Service = require("../models/service");
const Supervisor = require("../models/supervisor");
const Employee = require("../models/employee");
const sendmail = require("../ultils/sendemail");
const Salary = require("../models/salary");
const HotDistrict = require("../models/hotdistric");

const createBooking = async (req, res) => {
  try {
    const {
      service,
      customerName,
      email,
      quantity,
      district,
      ward,
      date,
      timeSlot,
      notes,
      ...rest
    } = req.body;

    if (!email) {
      return res.status(400).json({
        success: false,
        message: "Email của khách hàng không được xác định",
      });
    }

    const foundService = await Service.findById(service);
    if (!foundService) {
      return res
        .status(404)
        .json({ success: false, message: "Dịch vụ không tồn tại" });
    }

    const foundSupervisor = await Supervisor.findOne({ district });
    if (!foundSupervisor) {
      console.warn("Không tìm thấy Supervisor cho quận này");
    }

    const hotDistrict = await HotDistrict.findOne({ name: district });
    const isHotDistrict = hotDistrict !== null;

    const totalPrice = isHotDistrict
      ? foundService.price * quantity * 1.1
      : foundService.price * quantity;

    const booking = new Booking({
      ...req.body,
      hotDistrict: isHotDistrict ? hotDistrict._id : null,
      totalPrice,
    });

    await booking.save();

    const adminEmail = "toanb3074@gmail.com";
    const recipients = [email, adminEmail];

    if (foundSupervisor && foundSupervisor.email) {
      recipients.push(foundSupervisor.email);
    }

    // Nội dung email đã cập nhật
    const emailContent = `
      <h1>Xác nhận Đặt Dịch Vụ</h1>
      <p>Chào ${customerName},</p>
      <p>Cảm ơn bạn đã đặt dịch vụ với chúng tôi. Dưới đây là thông tin chi tiết về booking của bạn:</p>
      <ul>
        <li><strong>Dịch vụ:</strong> ${foundService.title}</li>
        <li><strong>Số lượng:</strong> ${quantity}</li>
        <li><strong>Quận:</strong> ${district}</li>
        <li><strong>Phường:</strong> ${ward}</li>
        <li><strong>Ngày:</strong> ${date}</li>
        <li><strong>Thời gian:</strong> ${timeSlot}</li>
        <li><strong>Ghi chú:</strong> ${notes || "Không có"}</li>
        <li><strong>Giá mỗi dịch vụ:</strong> ${foundService.price.toLocaleString(
          "vi-VN",
          {
            style: "currency",
            currency: "VND",
          }
        )}</li>
        <li><strong>Tổng giá:</strong> ${totalPrice.toLocaleString("vi-VN", {
          style: "currency",
          currency: "VND",
        })}</li>
      </ul>
      <p>Chúng tôi sẽ liên hệ với bạn sớm nhất để xác nhận thêm.</p>
      <p>Trân trọng,</p>
      <p>Đội ngũ của chúng tôi</p>
    `;

    const mailOptions = {
      to: recipients,
      subject: "Xác nhận Đặt Dịch Vụ",
      html: emailContent,
    };

    const info = await sendmail(mailOptions);
    console.log("Email đã được gửi thành công:", info.response);

    res.status(201).json({ success: true, data: booking });
  } catch (error) {
    console.error("Gửi email thất bại:", error);
    res.status(400).json({ success: false, error: error.message });
  }
};

const updateBooking = async (req, res) => {
  try {
    const { bkid } = req.params;
    const updatedData = req.body;

    const updatedBooking = await Booking.findById(bkid);

    if (!updatedBooking) {
      return res
        .status(404)
        .json({ success: false, message: "Booking không tồn tại." });
    }

    if (updatedData.employeeId) {
      const employees = await Employee.find({
        _id: { $in: updatedData.employeeId },
      });

      if (employees.length === 0) {
        return res
          .status(404)
          .json({ success: false, message: "Không có nhân viên nào tồn tại." });
      }

      updatedBooking.employeeDetails = employees.map((employee) => ({
        employeeId: employee._id.toString(),
        name: employee.name,
      }));
    }

    Object.assign(updatedBooking, updatedData);

    if (updatedData.quantity || updatedData.service) {
      if (updatedData.service) {
        const service = await Service.findById(updatedData.service);
        if (service) {
          updatedBooking.category = service.category;
          updatedBooking.totalPrice =
            service.price * (updatedData.quantity || updatedBooking.quantity);
        }
      } else {
        updatedBooking.totalPrice =
          updatedBooking.totalPrice ||
          (updatedBooking.quantity * updatedBooking.totalPrice) /
            updatedBooking.quantity;
      }
    }

    await updatedBooking.save();

    // Nếu trạng thái booking được cập nhật thành "Completed", tính lương cho nhân viên
    if (updatedBooking.status === "Completed") {
      const employeeIds = updatedBooking.employeeDetails.map(
        (detail) => detail.employeeId
      );
      const month = new Date().getMonth() + 1;
      const year = new Date().getFullYear();

      if (employeeIds.length > 0) {
        const employeeId = employeeIds[0];

        const employee = await Employee.findById(employeeId);
        const completedBookings = await Booking.find({
          employeeDetails: { $elemMatch: { employeeId: employeeId } },
          status: "Completed",
          createdAt: {
            $gte: new Date(year, month - 1, 1),
            $lt: new Date(year, month, 1),
          },
        });

        if (completedBookings.length > 0) {
          const totalBookingValue = completedBookings.reduce(
            (sum, booking) => sum + booking.totalPrice,
            0
          );
          const commission = totalBookingValue * 0.3;
          const totalSalary = employee.baseSalary + commission;

          const bookingDetails = completedBookings.map((booking) => ({
            bookingId: booking._id,
            totalPrice: booking.totalPrice,
            createdAt: booking.createdAt,
          }));

          // Kiểm tra xem bản ghi lương đã tồn tại chưa
          const existingSalaryRecord = await Salary.findOne({
            employee: employeeId,
            month: month,
            year: year,
          });

          if (existingSalaryRecord) {
            // Nếu tồn tại, cập nhật lại tổng lương và chi tiết booking
            existingSalaryRecord.baseSalary = employee.baseSalary;
            existingSalaryRecord.commission = commission;
            existingSalaryRecord.totalSalary = totalSalary;
            existingSalaryRecord.bookings = bookingDetails;
            await existingSalaryRecord.save();
          } else {
            // Nếu chưa tồn tại, tạo bản ghi mới
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
        }
      }
    }

    return res.status(200).json({
      success: true,
      data: {
        ...updatedBooking.toObject(),
      },
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

  const excludeFields = ["limit", "sort", "page", "fields"];
  excludeFields.forEach((el) => delete queries[el]);

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

  let queryCommand = Booking.find(formatedQueries).populate("service", "title");

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
    const booking = await Booking.findById(bkid).populate(
      "service",
      "title employeeDetails"
    ); // Giả sử bạn muốn lấy thông tin dịch vụ và chi tiết nhân viên

    // Kiểm tra xem booking có tồn tại không
    if (!booking) {
      return res
        .status(404)
        .json({ success: false, message: "Booking không tồn tại." });
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
  getAllBookings,
  getBookingDetail,
};
