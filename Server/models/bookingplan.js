const mongoose = require("mongoose");

const BookingPlanSchema = new mongoose.Schema(
  {
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
    startDate: {
      type: Date,
      required: true,
    },
    endDate: {
      type: Date,
      required: true,
    },
    frequency: {
      type: String,
      enum: ["Daily", "Weekly", "Monthly"],
      required: true,
    },
    planPrice: {
      type: Number,
      required: true,
    },
    employeeDetails: [{ 
      employeeId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Employee',
      },
      name: String,
    }],
    hotDistrict: { 
      type: mongoose.Schema.Types.ObjectId,
      ref: 'HotDistrict',
    },
    status: {
      type: String,
      enum: ["Active", "Completed", "Canceled"],
      default: "Active",
    },
    notes: {
      type: String,
    },
    totalPrice: {
      type: Number,
    },
  },
  {
    timestamps: true,
  }
);
