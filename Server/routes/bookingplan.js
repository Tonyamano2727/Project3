const router = require("express").Router();
const ctrls = require("../controllers/bookingplan");
const {
  verifyToken,
  isAdmin,
  isSupervisor,
} = require("../middlewares/verifyToken");

router.post("/createbookingplan", ctrls.createBookingPlan);
router.post("/getallbookingplan", ctrls.getBookingPlansBySupervisor);

module.exports = router;
