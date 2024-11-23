const multer = require("multer");
const path = require("path");
const fs = require("fs");


const uploadDir = path.join(__dirname, "../uploads");
if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir);
}

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    // Lưu file vào thư mục uploads
    cb(null, uploadDir); 
  },
  filename: function (req, file, cb) {
    // Đặt tên file là timestamp + tên file gốc
    cb(null, `${Date.now()}-${file.originalname}`);
  },
});

const upload = multer({
  storage,
  fileFilter: (req, file, cb) => {
    const fileTypes = /xlsx|xls/; 
    const extname = fileTypes.test(path.extname(file.originalname).toLowerCase());
    const mimeType = file.mimetype === 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' ||
                     file.mimetype === 'application/vnd.ms-excel'; 
  
    if (extname && mimeType) {
      return cb(null, true);
    } else {
      cb(new Error("Chỉ chấp nhận file Excel!"));
    }
  },
  
  limits: { fileSize: 10 * 1024 * 1024 }, 
});

module.exports = upload;
