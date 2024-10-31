const mongoose = require("mongoose");

const jobSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
    trim: true,
  },
  description: {
    type: String,
    required: true,
  },
  requirements: {
    type: [String], // danh sách yêu cầu (ví dụ: thời gian rảnh, đam mê với công việc, có kinh nghiệm trong công việc hay chưa,...)
    required: true,
  },
  benefits: {
    type: [String], // danh sách phúc lợi (ví dụ nếu làm lễ tết sẽ được x3, x4 lương hay hoa hồng, có lương tháng 13, đóng bảo hiểm,...)
    default: [],
  },
  salary: {
    //mức lương
    min: {
      //thấp nhất
      type: Number,
      required: true,
    },
    max: {
      //cao nhất
      type: Number,
      required: true,
    },
    currency: {
      type: String,
      default: "VND",
    },
  },
  location: {
    //vị trí nơi làm việc (quận 1, 2,...)
    type: String,
    required: true,
  },
  workingHours: {
    //khoảng giờ làm việc
    type: String,
    default: "8 giờ/ngày",
  },
  experienceRequired: {
    //kinh nghiệm trong công việc
    type: String,
    default: "Không yêu cầu",
  },
  startDate: {
    //ngày bắt đầu
    type: Date,
    required: true,
  },
  endDate: {
    type: Date,
    required: true,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

const Job = mongoose.model("Job", jobSchema);

module.exports = Job;
