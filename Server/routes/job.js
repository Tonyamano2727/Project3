const router = require("express").Router();
const jobController = require("../controllers/jobController");
const { verifyToken, isAdmin } = require("../middlewares/verifyToken");

// Lấy tất cả công việc
router.get("/", jobController.getAllJobs);

// Lấy một công việc theo ID
router.get("/getjob/:jid", jobController.getJob);

// Tạo một công việc mới (chỉ Admin)
router.post("/createjob", [verifyToken, isAdmin], jobController.createJob);

// Cập nhật công việc (chỉ Admin)
router.put("/updatejob/:jid", [verifyToken, isAdmin], jobController.updateJob);

// Xóa công việc (chỉ Admin)
router.delete(
  "/deletejob/:jid",
  [verifyToken, isAdmin],
  jobController.deleteJob
);

module.exports = router;
