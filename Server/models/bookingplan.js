const mongoose = require("mongoose");
const Serviceplan = require("../models/planservice");  // Đảm bảo bạn import đúng mô hình Serviceplan
const Employee = require("../models/employee");
const HotDistrict = require("../models/hotdistric");

const BookingPlanSchema = new mongoose.Schema(
  {
    service: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Serviceplan",  
      required: true,
    },
    supervisor: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Supervisor",
    },
    employeeDetails: [
      {
        employeeId: {
          type: mongoose.Schema.Types.ObjectId,
          ref: "Employee",
        },
        name: String,
      },
    ],
    hotDistrict: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "HotDistrict",
    },
    category: {
      type: String,
    },
    customerName: {
      type: String,
      required: true,
    },
    email: {
      type: String,
      required: true,
    },
    phoneNumber: {
      type: String,
      required: true,
    },
    address: {
      type: String,
      required: true,
    },
    district: {
      type: String,
      required: true,
    },
    ward: {
      type: String,
      required: true,
    },
    date: {
      type: Date,
      required: true,
    },
    timeSlot: {
      type: String,
      required: true,
    },
    quantity: {
      type: Number,
      required: true,
      default: 1,
    },
    price: {
      type: Number,
    },
    totalPrice: {
      type: Number,
    },
    status: {
      type: String,
      enum: ["Pending", "Confirmed", "In-progress", "Completed", "Canceled"],
      default: "Pending",
    },
    notes: {
      type: String,
    },
    isRecurring: {
      type: Boolean,
      default: false,
    },
    repeatType: {
      type: String,
      enum: ["Monthly"],
      default: "Monthly",
    },
    repeatEndDate: {
      type: Date,
    },
    nextOccurrences: [
      {
        date: Date,
        status: {
          type: String,
          enum: ["Scheduled", "Completed", "Skipped"],
          default: "Scheduled",
        },
      },
    ],

    autoRenew: {
      type: Boolean,
      default: true,
    },
  },
  {
    timestamps: true,
  }
);

// Middleware xử lý trước khi lưu
BookingPlanSchema.pre("save", async function (next) {
  try {
    const serviceplan = await Serviceplan.findById(this.service);  // Sử dụng Serviceplan thay vì Service
    if (!serviceplan) {
      return next(new Error("Dịch vụ không tồn tại"));
    }

    this.category = serviceplan.category;
    this.price = serviceplan.price;

    if (this.hotDistrict) {
      const hotDistrict = await HotDistrict.findById(this.hotDistrict);
      if (hotDistrict) {
        this.totalPrice = this.price * this.quantity * 1.1;
      } else {
        this.totalPrice = this.price * this.quantity;
      }
    } else {
      this.totalPrice = this.price * this.quantity;
    }

    // Tạo lịch 4 lần/tháng
    if (this.isRecurring && this.repeatType === "Monthly") {
      const startDate = new Date(this.date);
      const nextOccurrences = [];
      for (let i = 0; i < 4; i++) {
        const occurrenceDate = new Date(startDate);
        occurrenceDate.setDate(startDate.getDate() + i * 7); // Mỗi tuần một lần
        nextOccurrences.push({ date: occurrenceDate });
      }
      this.nextOccurrences = nextOccurrences;
    }

    next();
  } catch (error) {
    next(error);
  }
});

// Method tự động gia hạn booking sau 1 tháng
BookingPlanSchema.methods.autoRenewBooking = async function () {
  if (this.autoRenew) {
    const nextMonthDate = new Date(this.date);
    nextMonthDate.setMonth(nextMonthDate.getMonth() + 1);

    // Cập nhật ngày bắt đầu mới và tạo lịch mới
    this.date = nextMonthDate;
    this.nextOccurrences = [];
    for (let i = 0; i < 4; i++) {
      const occurrenceDate = new Date(nextMonthDate);
      occurrenceDate.setDate(nextMonthDate.getDate() + i * 7);
      this.nextOccurrences.push({ date: occurrenceDate });
    }

    await this.save();
  }
};

module.exports = mongoose.model("BookingPlan", BookingPlanSchema);
