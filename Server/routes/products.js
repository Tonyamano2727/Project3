const router = require("express").Router();
const ctrls = require("../controllers/products");
const { verifyToken, isAdmin } = require("../middlewares/verifyToken");
const uploader = require("../config/cloudinary.cofig");

router.post(
  "/",
  [verifyToken, isAdmin],
  uploader.fields([
    { name: "images", maxCount: 10 },
    { name: "thumb", maxCount: 1 },
  ]),
  ctrls.createproducts
);
router.post(
  "/createdmanyproducts",
  [verifyToken, isAdmin],
  uploader.fields([
    { name: 'thumb0', maxCount: 1 }, // Thumb cho sản phẩm thứ nhất
    { name: 'images0[]', maxCount: 10 }, // Hình ảnh cho sản phẩm thứ nhất
    { name: 'thumb1', maxCount: 1 }, // Thumb cho sản phẩm thứ hai
    { name: 'images1[]', maxCount: 10 }, // Hình ảnh cho sản phẩm thứ hai
    // Bạn có thể thêm nhiều sản phẩm hơn nếu cần
  ]),
  ctrls.createmanyproducts
);
router.get("/", ctrls.getallproducts);
router.put("/ratings", [verifyToken], ctrls.ratings);

router.put(
  "/uploadimage/:pid",
  [verifyToken, isAdmin],
  uploader.array("images", 10),
  ctrls.uploadImagesProduct
);
router.delete("/:pid", [verifyToken, isAdmin], ctrls.deleteProduct);
router.get("/:pid", ctrls.getproduct);
router.put(
  "/:pid",
  [verifyToken, isAdmin],
  uploader.fields([
    { name: "images", maxCount: 10 },
    { name: "thumb", maxCount: 1 },
  ]),
  ctrls.updateProduct
);
module.exports = router;
