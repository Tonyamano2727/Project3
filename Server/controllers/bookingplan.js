const BookingPlan = require("../models/bookingplan");
const sendMail = require("../utils/sendemail");
const asyncHandler = require("express-async-handler");


const createBookingPlan = asyncHandler(async (req, res) => {
  const bookingPlan = new BookingPlan(req.body);
  await bookingPlan.save();
  await sendMail({
    to: bookingPlan.email,
    subject: "Booking Plan Confirmation",
    text: `Cảm ơn ${bookingPlan.customerName} đã đặt lịch với chúng tôi!`
  });

  res.status(201).json(bookingPlan);
});


const getAllBookingPlans = asyncHandler(async (req, res) => {
  const bookingPlans = await BookingPlan.find();
  res.json(bookingPlans);
});


const getBookingPlanById = asyncHandler(async (req, res) => {
  const bookingPlan = await BookingPlan.findById(req.params.id);
  if (!bookingPlan) {
    res.status(404).json({ message: "Không tìm thấy booking plan" });
    return;
  }
  res.json(bookingPlan);
});


const updateBookingPlan = asyncHandler(async (req, res) => {
  const updatedBookingPlan = await BookingPlan.findByIdAndUpdate(
    req.params.id,
    req.body,
    { new: true, runValidators: true }
  );

  if (!updatedBookingPlan) {
    res.status(404).json({ message: "Không tìm thấy booking plan" });
    return;
  }
  res.json(updatedBookingPlan);
});


const deleteBookingPlan = asyncHandler(async (req, res) => {
  const bookingPlan = await BookingPlan.findByIdAndDelete(req.params.id);
  if (!bookingPlan) {
    res.status(404).json({ message: "Không tìm thấy booking plan" });
    return;
  }
  res.json({ message: "Booking plan đã được xóa thành công" });
});

module.exports = {
  createBookingPlan,
  getAllBookingPlans,
  getBookingPlanById,
  updateBookingPlan,
  deleteBookingPlan,
};
