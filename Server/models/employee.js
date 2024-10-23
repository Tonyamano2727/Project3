const mongoose = require("mongoose"); // Erase if already required

// Declare the Schema of the Mongo model
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
  baseSalary: { type: Number,
    default : 4000000
  },
  
});

module.exports = mongoose.model("Employee", EmployeeSchema);
