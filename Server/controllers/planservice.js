const asyncHandler = require("express-async-handler");
const Serviceplan = require("../models/planservice");

const createserviceplan = asyncHandler(async (req, res) => {
  try {
    const { title, description, price, category } = req.body;

    const thumb = req?.files?.thumb?.[0]?.path;
    const images = req?.files?.images?.map((el) => el.path);

    if (!title || !description || !price || !category) {
      return res.status(400).json({
        success: false,
        mes: "Missing input",
      });
    }

    if (thumb) req.body.thumb = thumb;
    if (images) req.body.images = images;

    const newServiceplanData = {
      title,
      description,
      thumb,
      price,
      category,
      images,
    };

    const newServicePlan = await Serviceplan.create(newServiceplanData);

    return res.status(200).json({
      success: true,
      mes: "Serviceplan added successfully",
      service: newServicePlan,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      mes: error.message,
    });
  }
});

const deleteServiceplan = asyncHandler(async (req, res) => {
  try {
    const { sid } = req.params;

    const service = await Serviceplan.findByIdAndDelete(sid);

    if (!service) {
      return res.status(404).json({
        success: false,
        mes: "Serviceplan not found",
      });
    }

    return res.status(200).json({
      success: true,
      mes: "Serviceplan deleted successfully",
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      mes: error.message,
    });
  }
});

const updateServiceplan = asyncHandler(async (req, res) => {
  try {
    const { sid } = req.params;
    const { title, description, price, category } = req.body;
    const thumb = req.files?.thumb ? req.files.thumb[0]?.path : null;
    const images = req.files?.images
      ? req.files.images.map((el) => el.path)
      : [];

    const service = await Serviceplan.findById(sid);

    if (!service) {
      return res.status(404).json({
        success: false,
        mes: "Serviceplan not found",
      });
    }

    service.title = title || service.title;
    service.description = description || service.description;
    service.price = price || service.price;
    service.category = category || service.category;
    if (thumb) service.thumb = thumb;
    if (images.length > 0) service.images = images;

    const updatedServiceplan = await service.save();

    return res.status(200).json({
      success: true,
      mes: "Serviceplan updated successfully",
      service: updatedServiceplan,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      mes: error.message,
    });
  }
});

const getAllServiceplans = asyncHandler(async (req, res) => {
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
  // Filtering
  if (queries?.name)
    formatedQueries.name = { $regex: queries.name, $options: "i" };

  if (req.query.q) {
    delete formatedQueries.q;
    formatedQueries["$or"] = [
      { title: { $regex: req.query.q, $options: "i" } },
      { category: { $regex: req.query.q, $options: "i" } },
    ];
  }
  let queryConmmand = Serviceplan.find(formatedQueries);

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
    const counts = await Serviceplan.find(formatedQueries).countDocuments();
    return res.status(200).json({
      success: response ? true : false,
      counts,
      service: response ? response : "Cant not get product",
    });
  });
});

const getOneServiceplan = asyncHandler(async (req, res) => {
  try {
    const { sid } = req.params;
    const service = await Serviceplan.findById(sid);

    if (!service) {
      return res.status(404).json({
        success: false,
        mes: "Serviceplan not found",
      });
    }
    return res.status(200).json({
      success: true,
      service,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      mes: error.message,
    });
  }
});

module.exports = {
  getAllServiceplans,
  createserviceplan,
  deleteServiceplan,
  updateServiceplan,
  getOneServiceplan,
};
