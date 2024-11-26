const router = require("express").Router();
const ctrls = require("../controllers/supervisor");
const {
  verifyToken,
  isAdmin,
  isSupervisor,
} = require("../middlewares/verifyToken");
const uploader = require("../config/cloudinary.cofig");

router.post("/registersup", ctrls.registerSupervisor);
router.post("/login", ctrls.loginSupervisor);
router.get("/getallsupervisor", ctrls.getSupervisors);
router.delete("/deletedsupervisor/:spid", ctrls.deleteSupervisor);
router.get("/districts", verifyToken, ctrls.getDistricts);

module.exports = router;
