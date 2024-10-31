const Job = require("../models/job");

// Tạo mới một công việc
const createJob = async (req, res) => {
  try {
    const newJob = new Job(req.body);
    await newJob.save();
    res.status(201).json(newJob);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Lấy tất cả các công việc
const getAllJobs = async (req, res) => {
  try {
    const jobs = await Job.find();
    res.status(200).json(jobs);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Lấy một công việc theo ID
const getJob = async (req, res) => {
  try {
    const job = await Job.findById(req.params.jid);
    if (!job)
      return res.status(404).json({ message: "Công việc không tồn tại" });
    res.status(200).json(job);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Cập nhật một công việc
const updateJob = async (req, res) => {
  try {
    const updatedJob = await Job.findByIdAndUpdate(req.params.jid, req.body, {
      new: true,
    });
    if (!updatedJob)
      return res.status(404).json({ message: "Công việc không tồn tại" });
    res.status(200).json(updatedJob);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Xóa một công việc
const deleteJob = async (req, res) => {
  try {
    const deletedJob = await Job.findByIdAndDelete(req.params.jid);
    if (!deletedJob)
      return res.status(404).json({ message: "Công việc không tồn tại" });
    res.status(200).json({ message: "Xóa công việc thành công" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = { createJob, getAllJobs, getJob, updateJob, deleteJob };
