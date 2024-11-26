const { response } = require("express");
const Product = require("../models/products");
const asyncHandler = require("express-async-handler");
const slugify = require("slugify");
const User = require("../models/user");
const redisClient = require("../config/redis");
const fs = require("fs");
const path = require("path");
const XLSX = require("xlsx");

const createproducts = asyncHandler(async (req, res) => {
  const { title, price, description, brand, category, color } = req.body;
  const thumb = req?.files?.thumb?.[0]?.path;
  const images = req?.files?.images?.map((el) => el.path);

  if (!(title && price && description && brand && category && color))
    throw new Error("Missing input");

  req.body.slug = slugify(title);
  if (thumb) req.body.thumb = thumb;
  if (images) req.body.images = images;

  const newproducts = await Product.create(req.body);

  if (newproducts) {
    const cacheKey = `product:${newproducts._id}`;
    await redisClient.set(cacheKey, JSON.stringify(newproducts), {
      EX: 3600,
    });
  }

  return res.status(200).json({
    success: !!newproducts,
    mes: newproducts ? "Product has been created" : "Failed to create product",
  });
});

const createmanyproducts = asyncHandler(async (req, res) => {
  const productsData = req.body.products; // Nhận mảng sản phẩm từ form data

  if (!Array.isArray(productsData) || productsData.length === 0) {
    return res.status(400).json({
      success: false,
      mes: "Thiếu dữ liệu: Không có sản phẩm nào được gửi",
    });
  }

  const newProducts = [];

  for (let i = 0; i < productsData.length; i++) {
    const productData = productsData[i];
    const { title, price, description, brand, category, color } = productData;

    if (!(title && price && description && brand && category && color)) {
      return res.status(400).json({
        success: false,
        mes: "Thiếu thông tin ở một hoặc nhiều sản phẩm",
      });
    }

    // Xử lý các tệp thumb và images cho từng sản phẩm
    const thumb = req.files[`thumb${i}`]?.[0]?.path; // thumb của sản phẩm i
    const images = req.files[`images${i}[]`]?.map((el) => el.path); // images của sản phẩm i

    productData.slug = slugify(title);
    if (thumb) productData.thumb = thumb;
    if (images) productData.images = images;

    // Tạo sản phẩm
    const newProduct = await Product.create(productData);
    if (newProduct) {
      newProducts.push(newProduct);
    }
  }

  return res.status(200).json({
    success: newProducts.length > 0,
    mes:
      newProducts.length > 0
        ? "Đã tạo các sản phẩm thành công"
        : "Không thể tạo sản phẩm",
    products: newProducts,
  });
});

const createproductswithexcel = async (req, res) => {
  try {
    const filePath = path.join(
      __dirname,
      "..",
      "uploads",
      req.files.excel[0].filename
    );

    if (fs.existsSync(filePath)) {
      const workbook = XLSX.readFile(filePath);
      const sheet_name_list = workbook.SheetNames;
      const xlData = XLSX.utils.sheet_to_json(
        workbook.Sheets[sheet_name_list[0]]
      );

      console.log("Data file Excel:", xlData);

      const productsToInsert = xlData.map((item) => ({
        title: item.Title,
        brand: item.Brand,
        category: item.Category,
        price: item.Price,
        slug: item.Title.toLowerCase().split(" ").join("-"),
        color: item.Color,
        quantity: item.Quantity || 0,
        sold: item.Sold || 0,
        thumb: item.Thumb || "",
        images: item.Images || [],
      }));

      const savedProducts = await Product.insertMany(productsToInsert);

      res.status(200).json({
        success: true,
        message: "File uploaded and processed successfully!",
        data: savedProducts,
      });
    } else {
      res.status(400).json({ message: "File not found" });
    }
  } catch (error) {
    console.error("Error processing file:", error);
    res.status(500).json({
      message: "Error processing the file.",
      error: error.message,
    });
  }
};

const getproduct = asyncHandler(async (req, res) => {
  const { pid } = req.params;
  const product = await Product.findById(pid);
  return res.status(200).json({
    success: product ? true : false,
    productData: product ? product : "Cant not get product",
  });
});

const getallproducts = asyncHandler(async (req, res) => {
  const queries = { ...req.query };
  // Tách các trường dặt biệt
  const excludeFields = ["limit", "sort", "page", "fields"];
  excludeFields.forEach((el) => delete queries[el]);

  // Format lại các operator cho đúng cú pháp mongoose      //gt is > // lt is <
  let queryString = JSON.stringify(queries);
  queryString = queryString.replace(
    /\b(gte|gt|lt|lte)\b/g,
    (macthedEl) => `$${macthedEl}`
  );
  const formatedQueries = JSON.parse(queryString);
  let colorQueryObject = {};
  // Filtering
  if (queries?.title)
    formatedQueries.title = { $regex: queries.title, $options: "i" };
  if (queries?.category)
    formatedQueries.category = { $regex: queries.category, $options: "i" };
  if (queries?.color) {
    delete formatedQueries.color;
    const colorArr = queries.color?.split(",");
    const colorQuery = colorArr.map((el) => ({
      color: { $regex: el, $options: "i" },
    }));
    colorQueryObject = { $or: colorQuery };
  }
  let queryObject = {};
  if (queries?.q) {
    delete formatedQueries.q;
    queryObject = {
      $or: [
        { color: { $regex: queries.q, $options: "i" } },
        { title: { $regex: queries.q, $options: "i" } },
        { category: { $regex: queries.q, $options: "i" } },
        { brand: { $regex: queries.q, $options: "i" } },
      ],
    };
  }
  const qr = { ...colorQueryObject, ...formatedQueries, ...queryObject };
  let queryConmmand = Product.find(qr);

  // Sorting
  //abc,efg => [abc,efg] => abc efg
  if (req.query.sort) {
    const sortBy = req.query.sort.split(",").join(" ");
    queryConmmand = queryConmmand.sort(sortBy);
  }

  // fields limiting    // Lấy trường
  if (req.query.fields) {
    const fields = req.query.fields.split(",").join(" ");
    queryConmmand = queryConmmand.select(fields);
  }
  // Pagination
  // limit: số object lấy về goin API
  // skip: 2
  // 1 2 3 ... 10

  // + conver kieu du lieu
  const page = +req.query.page || 1;
  const limit = +req.query.limit || process.env.LIMIT_PRODUCTS;
  const skip = (page - 1) * limit;
  queryConmmand.skip(skip).limit(limit);
  // Execute query
  // Số Lượng sản phẩm thõa mản điều kiện !== số lượng sp trả về 1 lần gọi API
  queryConmmand.exec(async (err, response) => {
    if (err) throw new Error(err.message);
    const counts = await Product.find(qr).countDocuments();
    return res.status(200).json({
      success: response ? true : false,
      counts,
      products: response ? response : "Cant not get product",
    });
  });
});

const updateProduct = asyncHandler(async (req, res) => {
  const { pid } = req.params;
  const files = req?.files;
  if (files?.thumb) req.body.thumb = files?.thumb[0]?.path;
  if (files?.images) req.body.images = files?.images?.map((el) => el.path);
  if (req.body && req.body.title) req.body.slug = slugify(req.body.title);
  const updateProduct = await Product.findByIdAndUpdate(pid, req.body, {
    new: true,
  });
  return res.status(200).json({
    success: updateProduct ? true : false,
    mes: updateProduct ? "Updated" : "Cant not update product",
  });
});

const deleteProduct = asyncHandler(async (req, res) => {
  const { pid } = req.params;

  const usersWithProductInCart = await User.find({ "cart.product": pid });

  if (usersWithProductInCart.length > 0) {
    return res.status(400).json({
      success: false,
      mes: "Cannot delete product because it is in the cart of a customer.",
    });
  }

  const deletedProduct = await Product.findByIdAndDelete(pid);

  return res.status(200).json({
    success: deletedProduct ? true : false,
    mes: deletedProduct ? "Deleted" : "Cannot delete product",
  });
});

const ratings = asyncHandler(async (req, res) => {
  const { _id } = req.user;
  const { star, comment, pid } = req.body;
  if (!star && !pid) throw new Error("Missing inputs");
  const ratingsProduct = await Product.findById(pid);
  const alreadyRatings = ratingsProduct?.ratings?.find(
    (el) => el.postedBy.toString() === _id
  );
  // console.log({alreadyRatings})
  if (alreadyRatings) {
    // update star and comment
    await Product.updateOne(
      {
        ratings: { $elemMatch: alreadyRatings },
      },
      {
        $set: { "ratings.$.star": star, "ratings.$.comment": comment },
      },
      { new: true }
    );
  } else {
    // add star and comment
    const response = await Product.findByIdAndUpdate(
      pid,
      {
        $push: { ratings: { star, comment, postedBy: _id } },
      },
      { new: true }
    );
    console.log(response);
  }

  // Sum ratings
  const updateProduct = await Product.findById(pid);
  const ratingCount = updateProduct.ratings.length;
  const Sumratings = updateProduct.ratings.reduce(
    (sum, el) => sum + +el.star,
    0
  );
  updateProduct.totalRatings = Math.round((Sumratings * 10) / ratingCount) / 10;

  await updateProduct.save();

  return res.status(200).json({
    status: true,
    updateProduct,
  });
});

const uploadImagesProduct = asyncHandler(async (req, res) => {
  const { pid } = req.params;
  if (!req.files) throw new Error("Missing input");
  const response = await Product.findByIdAndUpdate(
    pid,
    { $push: { images: { $each: req.files.map((el) => el.path) } } },
    { new: true }
  );
  return res.status(200).json({
    status: response ? true : false,
    updateProduct: response ? response : "Cannot upload Images Products",
  });
});

module.exports = {
  createproducts,
  getproduct,
  getallproducts,
  updateProduct,
  deleteProduct,
  ratings,
  uploadImagesProduct,
  createmanyproducts,
  createproductswithexcel,
};
