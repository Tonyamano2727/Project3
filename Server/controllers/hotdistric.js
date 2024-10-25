const HotDistrict = require("../models/hotdistric"); 

const createHotDistrict = async (req, res) => {
  try {
    const { name } = req.body;

    if (!name) {
      return res
        .status(400)
        .json({ success: false, message: "Tên quận không được cung cấp" });
    }

    const hotDistrict = new HotDistrict({ name });
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

module.exports = { createHotDistrict, deleteHotDistrict };
