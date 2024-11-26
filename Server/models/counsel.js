const mongoose = require("mongoose");

const CounselSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  status: {
    type: String,
    enum: ["Not consulted", "Consulted"], 
    default: "Not consulted", 
  },
  mobile: {
    type: String,
    required: true,
  },
  service: {
    type: String,
    required: true,
  },
});

module.exports = mongoose.model("Counsel", CounselSchema);
