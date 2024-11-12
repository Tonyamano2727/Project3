const mongoose = require("mongoose");
const Service = require('../models/service');
const Employee = require("../models/employee");
const HotDistrict = require("../models/hotdistric");

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
    hotDistrict: { 
      type: mongoose.Schema.Types.ObjectId,
      ref: 'HotDistrict',
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

BookingSchema.pre("save", async function (next) {
  try {
    const service = await Service.findById(this.service);
    
    if (!service) {
      return next(new Error('Dịch vụ không tồn tại'));
    }

    this.category = service.category; 
    this.price = service.price; 

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

   
    console.log('Service Price:', this.price);
    console.log('Quantity:', this.quantity);
    console.log('Is Hot District:', !!this.hotDistrict);
    console.log('Total Price before save:', this.totalPrice);

    next();
  } catch (error) {
    next(error);
  }
});

module.exports = mongoose.model("Booking", BookingSchema);
