const mongoose = require("mongoose");

var EmployeeSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true,
  },
  job: {
    type: String,
    required: true,
  },
  mobile: {
    type: String,
    required: true,
    unique: true,
  },
  avatar: {
    type: String,
  },
  district: {
    type: String,
    require: true,
  },
  baseSalary: { type: Number },
});

module.exports = mongoose.model("Employee", EmployeeSchema);
