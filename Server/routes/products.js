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


// Create many products 
const maxProducts = 6; // Có thể thay đổi số này tùy nhu cầu

const fields = [];

for (let i = 0; i < maxProducts; i++) {
  fields.push({ name: `thumb${i}`, maxCount: 1 });
  fields.push({ name: `images${i}[]`, maxCount: 10 });
}
router.post(
  "/createdmanyproducts",
  uploader.fields(fields),
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
