const mongoose = require("mongoose");

const HotDistrictSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      unique: true,
    },
    percentage: {
      type: Number,
      required: false,
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model("HotDistrict", HotDistrictSchema);
