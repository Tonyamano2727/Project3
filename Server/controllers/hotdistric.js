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

const deleteHotDistrict = async (req, res) => {

  try {
    const { did } = req.params;

  
    if (!id) {
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


module.exports = { createHotDistrict, deleteHotDistrict, getAllHotDistricts };
