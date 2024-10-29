const router = require("express").Router();
const ctrls = require("../controllers/servicecategory");
const { verifyToken, isAdmin } = require("../middlewares/verifyToken");

router.post("/createcategoryservice", ctrls.createCategory);
router.delete("/deletecategoryservices/:id", ctrls.deleteCategory);
router.get("/", ctrls.getCategories);
module.exports = router;
