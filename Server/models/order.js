const mongoose = require("mongoose"); // Erase if already required

// Declare the Schema of the Mongo model
var OrderSchema = new mongoose.Schema(
  {
    products: [
      {
        product: { type: mongoose.Types.ObjectId, ref: "Products" },
        quantity: Number,
        color: String,
        price: Number,
        title: String,
        thumb: String,
      },
    ],
    status: {
      type: String,
      default: "Pending", 
      enum: ["Pending", "Processing", "Shipped", "Successed", "Cancelled"], 
    },
    total: Number,
    orderBy: {
      type: mongoose.Types.ObjectId,
      ref: "User",
    },
    address: {
      type: String,
      ref: "User",
    },
  },
  {
    timestamps: true,
  }
);

//Export the model
module.exports = mongoose.model("Order", OrderSchema);
