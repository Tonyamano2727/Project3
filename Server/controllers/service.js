const asyncHandler = require("express-async-handler");
const Service = require("../models/service");

const createservice = asyncHandler(async (req, res) => {
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

    const newServiceData = {
      title,
      description,
      thumb,
      price,
      category,
      images,
    };

    const newService = await Service.create(newServiceData);

    return res.status(200).json({
      success: true,
      mes: "Service added successfully",
      service: newService,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      mes: error.message,
    });
  }
});

const deleteService = asyncHandler(async (req, res) => {
  try {
    const { sid } = req.params;

    const service = await Service.findByIdAndDelete(sid);

    if (!service) {
      return res.status(404).json({
        success: false,
        mes: "Service not found",
      });
    }

    return res.status(200).json({
      success: true,
      mes: "Service deleted successfully",
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      mes: error.message,
    });
  }
});

const updateService = asyncHandler(async (req, res) => {
  try {
    const { sid } = req.params;
    const { title, description, price, category } = req.body;
    const thumb = req.files?.thumb ? req.files.thumb[0]?.path : null;
    const images = req.files?.images
      ? req.files.images.map((el) => el.path)
      : [];

    const service = await Service.findById(sid);

    if (!service) {
      return res.status(404).json({
        success: false,
        mes: "Service not found",
      });
    }

    service.title = title || service.title;
    service.description = description || service.description;
    service.price = price || service.price;
    service.category = category || service.category;
    if (thumb) service.thumb = thumb;
    if (images.length > 0) service.images = images;

    const updatedService = await service.save();

    return res.status(200).json({
      success: true,
      mes: "Service updated successfully",
      service: updatedService,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      mes: error.message,
    });
  }
});

const getAllServices = asyncHandler(async (req, res) => {
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
  let queryConmmand = Service.find(formatedQueries);

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
    const counts = await Service.find(formatedQueries).countDocuments();
    return res.status(200).json({
      success: response ? true : false,
      counts,
      service: response ? response : "Cant not get product",
    });
  });
});

const getOneService = asyncHandler(async (req, res) => {
  try {
    const { sid } = req.params;
    const service = await Service.findById(sid);

    if (!service) {
      return res.status(404).json({
        success: false,
        mes: "Service not found",
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
  getAllServices,
  createservice,
  deleteService,
  updateService,
  getOneService,
};
