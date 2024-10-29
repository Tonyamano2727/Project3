const HotDistrict = require("../models/hotdistric"); 

const createHotDistrict = async (req, res) => {
  try {
    const { name, percentage } = req.body; 

    if (!(name && percentage))
      throw new Error("Missing input");


    if (percentage !== undefined && (percentage < 0 || percentage > 100)) {
      return res.status(400).json({ success: false, message: "Phần trăm phải nằm trong khoảng từ 0 đến 100" });
    }

    const hotDistrict = new HotDistrict({ name, percentage }); 
    await hotDistrict.save();

    res.status(201).json({ success: true, data: hotDistrict });
  } catch (error) {
    res.status(400).json({ success: false, error: error.message });
  }
};

const updateHotDistrict = async (req, res) => {
  try {
    const { did } = req.params; // Get the district ID from the URL parameters
    const { percentage } = req.body; // Get the percentage from the request body

    // Check if the percentage is provided; if not, throw an error
    if (percentage === undefined) {
      return res.status(400).json({ success: false, message: "No fields to update" });
    }

    // Validate the percentage value
    if (percentage < 0 || percentage > 100) {
      return res.status(400).json({ success: false, message: "Phần trăm phải nằm trong khoảng từ 0 đến 100" });
    }

    // Update the district with the new percentage
    const hotDistrict = await HotDistrict.findByIdAndUpdate(
      did,
      { percentage }, // Pass the percentage to update
      { new: true, runValidators: true } // Options: return the updated document and run validation
    );

    // If the district is not found, return a 404 error
    if (!hotDistrict) {
      return res.status(404).json({ success: false, message: "Quận không được tìm thấy" });
    }

    // Return the updated district information
    res.status(200).json({ success: true, data: hotDistrict });
  } catch (error) {
    res.status(400).json({ success: false, error: error.message });
  }
};

const deleteHotDistrict = async (req, res) => {

  try {
    const { did } = req.params;

  
    if (!did) {
      return res
        .status(400)
        .json({ success: false, message: "ID không được cung cấp" });
    }

    const hotDistrict = await HotDistrict.findByIdAndDelete(did);
    if (!hotDistrict) {
      return res
        .status(404)
        .json({ success: false, message: "Quận hot không tồn tại" });
    }

    res.status(200).json({ success: true, message: "Quận hot đã được xóa" });
  } catch (error) {
    res.status(400).json({ success: false, error: error.message });
  }
};
const getAllHotDistricts = async (req, res) => {
  try {
    const hotDistricts = await HotDistrict.find();
    res.status(200).json({ success: true, data: hotDistricts });
  } catch (error) {
    res.status(400).json({ success: false, error: error.message });
  }
};


module.exports = { createHotDistrict, deleteHotDistrict, getAllHotDistricts , updateHotDistrict};
