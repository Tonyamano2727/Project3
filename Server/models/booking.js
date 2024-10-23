const mongoose = require("mongoose");
const Service = require('../models/service');
const Employee = require("../models/employee");

const BookingSchema = new mongoose.Schema(
  {
    service: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Service", 
      required: true,
    },
    supervisor: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Supervisor', 
    },
    employeeDetails: [{ 
      employeeId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Employee',
      },
      name: String,
    }],   
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
      type: String,
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
  },
  {
    timestamps: true,
  }
);

// Pre-save hook to set category, price, and totalPrice
BookingSchema.pre("save", async function (next) {
  try {
    const service = await Service.findById(this.service);
    
    if (service) {
      this.category = service.category; 
      this.price = service.price; 
      this.totalPrice = service.price * this.quantity; 
    } else {
      throw new Error('Dịch vụ không tồn tại');
    }
    
    next();
  } catch (error) {
    next(error);
  }
});

module.exports = mongoose.model("Booking", BookingSchema);
