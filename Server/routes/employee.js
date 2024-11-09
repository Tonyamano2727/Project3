const router = require("express").Router();
const ctrls = require("../controllers/employee");
const {
  verifyToken,
  isAdmin,
  isSupervisor,
} = require("../middlewares/verifyToken");
const uploader = require("../config/cloudinary.cofig");

router.post(
  "/registeremployee",
  [verifyToken, isSupervisor],
  uploader.single("avatar"),
  ctrls.Registeremployee
);
router.put(
  "/updateemployee/:eid",
  [verifyToken, isSupervisor],
  uploader.single("avatar"),
  ctrls.updateEmployee
);
router.delete(
  "/deletedemployee/:eid",
  [verifyToken, isSupervisor],
  ctrls.DeleteEmployee
);
router.get("/getone/:eid", [verifyToken, isSupervisor], ctrls.getEmployee);
router.get(
  "/getallwithrole",
  [verifyToken, isSupervisor],
  ctrls.getAllEmployees
);
router.get("/getall", ctrls.getAllEmployee);

module.exports = router;
