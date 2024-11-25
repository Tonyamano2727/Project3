const asyncHandler = require("express-async-handler");
const Counsel = require("../models/counsel");
const sendmail = require("../ultils/sendemail");

const createCounsel = asyncHandler(async (req, res) => {
  try {
    const { name, mobile, service } = req.body;

    
    if (!name || !mobile || !service) {
      return res.status(400).json({
        success: false,
        mes: "Missing input fields",
      });
    }

    
    const newCounsel = await Counsel.create({
      name,
      mobile,
      service,
    });

    
    const email = "toanp3074@gmail.com"; // email using admin
    const subject = "You have 1 order that needs advice from a customer";
    const html = `
        <h1>New Counsel Created</h1>
        <p><strong>Name:</strong> ${name}</p>
        <p><strong>Mobile:</strong> ${mobile}</p>
        <p><strong>Service:</strong> ${service}</p>
      `;

    // Send an email
    await sendmail({ email, html });

    return res.status(201).json({
      success: true,
      mes: "Counsel created successfully and email sent",
      counsel: newCounsel,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      mes: error.message,
    });
  }
});
const updateCounsel = asyncHandler(async (req, res) => {
  try {
    const { cid } = req.params; 
    const updates = req.body; 

   
    const updatedCounsel = await Counsel.findByIdAndUpdate(cid, updates, {
      new: true, 
      runValidators: true, 
    });

    if (!updatedCounsel) {
      return res.status(404).json({
        success: false,
        mes: "Counsel not found",
      });
    }

    res.status(200).json({
      success: true,
      mes: "Counsel updated successfully",
      counsel: updatedCounsel,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      mes: error.message,
    });
  }
});
const getAllCounsels = asyncHandler(async (req, res) => {
  try {
    const { status } = req.query; // Lọc theo trạng thái (nếu có)
    const filter = status ? { status } : {}; // Nếu có trạng thái, lọc theo trạng thái

    const counsels = await Counsel.find(filter);

    res.status(200).json({
      success: true,
      mes: "Counsels fetched successfully",
      counsels,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      mes: error.message,
    });
  }
});



module.exports = { createCounsel , updateCounsel, getAllCounsels };
