const mongoose = require("mongoose");
const slug = require('slugify')

var ServiceplanSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
      trim: true,
    },
    description: {
      type: Array,
      required: true,
    },
    thumb: {
      type: String,
      require: true
    },
    price: {
      type: Number,
      required: true,
    },
    category: {
      type: String,
      required: true,
    },
    images: {
      type: Array,
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model("Serviceplan", ServiceplanSchema);
