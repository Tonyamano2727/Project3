const asyncHandler = require("express-async-handler");
const User = require("../models/user");
const Product = require("../models/products");
const {
  generrateAccessToken,
  generrateRefreshToken,
} = require("../middlewares/jwt");
const jwt = require("jsonwebtoken");
const Sendemail = require("../ultils/sendemail");
const Sendemailone = require("../ultils/sendemailone");
const crypto = require("crypto");
const { response } = require("express");

const register = asyncHandler(async (req, res) => {
  try {
    const { email, password, firstname, lastname, mobile } = req.body;
    if (!email || !password || !lastname || !firstname || !mobile)
      return res.status(400).json({
        success: false,
        mes: "Missing input",
      });

    const user = await User.findOne({ email: email });
    if (user) throw new Error("User already exists");
    else {
      const newUser = await User.create(req.body);
      return res.status(200).json({
        success: newUser ? true : false,
        mes: newUser
          ? "Registration successful. Go to login"
          : "Something went wrong",
      });
    }
  } catch (error) {
    return res.status(500).json({
      success: false,
      mes: error.message,
    });
  }
});

// Refresh  token => Cấp mới access token
// Access token => Xác thực người dùng, phân quyền người dùng
const login = asyncHandler(async (req, res) => {
  const { email, password } = req.body;
  if (!email || !password)
    return res.status(400).json({
      success: false,
      mes: "Missing input",
    });
  const response = await User.findOne({ email: email });
  if (response && (await response.isConrectPassword(password))) {
    const { password, role, refreshToken, ...userData } = response.toObject();

    const Accesstoken = generrateAccessToken(response._id, role);

    const newrefreshToken = generrateRefreshToken(response._id);

    await User.findByIdAndUpdate(
      response._id,
      { refreshToken: newrefreshToken },
      { new: true }
    );
    // Lưu refresh token vào cookie
    res.cookie("refreshToken", newrefreshToken, {
      httpOnly: true,
      maxAge: 7 * 24 * 60 * 60 * 1000,
    });
    return res.status(200).json({
      success: true,
      Accesstoken,
      userData,
    });
  } else {
    throw new Error("Invalid credentials");
  }
});

const getCurrent = asyncHandler(async (req, res) => {
  const { _id } = req.user;
  const user = await User.findById({ _id: _id })
    .select("-refreshToken -password ")
    .populate({
      path: "cart",
      populate: {
        path: "product",
        select: "title thumb price quantity sold",
      },
    })
    .populate("wishlist", " title thumb price color totalRatings");
  return res.status(200).json({
    success: user ? true : false,
    rs: user ? user : "User not found",
  });
});

const refreshAcessToken = asyncHandler(async (req, res) => {
  // Lấy token từ cookies
  const cookie = req.cookies;
  // Check xem có token hay không
  if (!cookie && !cookie.refreshToken)
    throw new Error("No refresh token in cookies");
  // Check token có hợp lệ hay không
  const rs = await jwt.verify(cookie.refreshToken, process.env.JWT_SECRET);
  const response = await User.findOne({
    _id: rs._id,
    refreshToken: cookie.refreshToken,
  });
  return res.status(200).json({
    success: response ? true : false,
    newAccessToken: response
      ? generrateAccessToken(response._id, response.role)
      : "Refresh token not matcheed",
  });
});

const logout = asyncHandler(async (req, res) => {
  const cookie = req.cookies;
  if (!cookie && !cookie.refreshToken)
    throw new Error("No refresh token in cookies");

  await User.findOneAndUpdate(
    { refreshToken: cookie.refreshToken },
    { refreshToken: "" },
    { new: true }
  );
  res.clearCookie("refreshToken", {
    httpOnly: true,
    secure: true,
  });
  return res.status(200).json({
    success: true,
    mes: "Logout is done",
  });
});

// Client gửi email đã đăng kí
// Sever kiểm tra email có hợp lệ hay không => Nếu hợp lệ thì gửi mail + kèm theo link  (password change token)
// Client check email => click link
// Client gửi api kèm token
// Check token có giống token mà server gửi mail  hay không
// Nếu giống thì cho thay đổi và ngược lại

const forgotPassword = asyncHandler(async (req, res) => {
  const { email } = req.body;
  if (!email) throw new Error("Missing email");
  const user = await User.findOne({ email });
  if (!user) throw new Error("User not found");
  const resetToken = user.createPasswordchangedToken();
  await user.save();

  const html = `Xin vui lòng click vào link dưới đây để thay đổi mật khẩu của bạn.Link này sẽ hết hạn sau 15 phút kể từ bây giờ. <a href="${process.env.CLIENT_URL}/reset-password/${resetToken}"> Click here</a>`;

  const data = {
    email,
    html,
  };
  const rs = await Sendemailone(data);
  return res.status(200).json({
    success: true,
    mes: rs.response?.includes("OK")
      ? "Check your email"
      : "Email wrong try last",
  });
});

const resetPassword = asyncHandler(async (req, res) => {
  const { token, password } = req.body;
  if (!password || !token) throw new Error("Missing inputs");
  const passwordResetToken = crypto
    .createHash("sha256")
    .update(token)
    .digest("hex");
  const user = await User.findOne({
    passwordResetToken,
    passwordResetExpires: { $gt: Date.now() },
  });
  if (!user) throw new Error("Invalid reset token");
  user.password = password;
  user.passwordResetToken = undefined;
  user.passwordChangArt = Date.now();
  user.passwordResetExpires = undefined;
  await user.save();
  return res.status(200).json({
    success: user ? true : false,
    mes: user ? "Update password" : "Something went wrong",
  });
});

const getUser = asyncHandler(async (req, res) => {
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
      { firstname: { $regex: req.query.q, $options: "i" } },
      { lastname: { $regex: req.query.q, $options: "i" } },
      { email: { $regex: req.query.q, $options: "i" } },
      { mobile: { $regex: req.query.q, $options: "i" } },
    ];
  }
  let queryConmmand = User.find(formatedQueries);

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
    const counts = await User.find(formatedQueries).countDocuments();
    return res.status(200).json({
      success: response ? true : false,
      counts,
      users: response ? response : "Cant not get product",
    });
  });
});

const deleteUser = asyncHandler(async (req, res) => {
  const { uid } = req.params;
  const response = await User.findByIdAndDelete(uid);
  return res.status(200).json({
    success: response ? true : false,
    mes: response
      ? `User with email ${response.email} deleted`
      : "No user delete",
  });
});

// client
const updateuser = asyncHandler(async (req, res) => {
  const { _id } = req.user;
  const { firstname, lastname, email, mobile, address } = req.body;
  const data = { firstname, lastname, email, mobile, address };
  if (req.file) data.avatar = req.file.path;
  if (!_id || Object.keys(req.body).length === 0)
    throw new Error("Missing input");
  const response = await User.findByIdAndUpdate(_id, data, {
    new: true,
  }).select("-password,-role");
  return res.status(200).json({
    success: response ? true : false,
    mes: response ? "Updated" : "Something went wrong",
  });
});

const updateuserbyadmin = asyncHandler(async (req, res) => {
  const { uid } = req.params;
  if (Object.keys(req.body).length === 0) throw new Error("Missing input");
  const response = await User.findByIdAndUpdate(uid, req.body, {
    new: true,
  }).select("-password -role ");
  return res.status(200).json({
    success: response ? true : false,
    mes: response ? "Updated" : "Something went wrong",
  });
});

const updateuserAddress = asyncHandler(async (req, res) => {
  const { _id } = req.user;
  if (!req.body.address) throw new Error("Missing input");
  const response = await User.findByIdAndUpdate(
    _id,
    { $push: { address: req.body.address } },
    { new: true }
  ).select("-password -role");
  return res.status(200).json({
    success: response ? true : false,
    updateuseraddress: response ? response : "Something went wrong",
  });
});

const updateCart = asyncHandler(async (req, res) => {
  const { _id } = req.user;
  const { pid, quantity = 1, color, price, title, thumb } = req.body;

  if (!pid || !color) throw new Error("Missing input");

  const product = await Product.findById(pid);
  if (!product) {
    return res.status(404).json({
      success: false,
      mes: "Product not found",
    });
  }

  if (product.quantity <= 0) {
    return res.status(400).json({
      success: false,
      mes: "Product is out of stock or unavailable",
    });
  }

  if (quantity < 0) {
    return res.status(400).json({
      success: false,
      mes: "Quantity must be greater than or equal to 0",
    });
  }

  const user = await User.findById(_id).select("cart");
  const alreadyProduct = user?.cart?.find(
    (el) => el.product && el.product.toString() === pid
  );

  if (alreadyProduct && alreadyProduct.color === color) {
    const response = await User.updateOne(
      { cart: { $elemMatch: alreadyProduct } },
      {
        $set: {
          "cart.$.quantity": quantity,
          "cart.$.price": price,
          "cart.$.title": title,
          "cart.$.thumb": thumb,
        },
      },
      { new: true }
    );
    return res.status(200).json({
      success: response ? true : false,
      mes: response ? "Updated your cart" : "Something went wrong",
    });
  } else {
    if (quantity <= 0) {
      return res.status(400).json({
        success: false,
        mes: "Quantity must be greater than 0 to add a new product",
      });
    }

    const response = await User.findByIdAndUpdate(
      _id,
      {
        $push: { cart: { product: pid, quantity, color, price, title, thumb } },
      },
      { new: true }
    );
    return res.status(200).json({
      success: response ? true : false,
      mes: response ? response : "Something went wrong",
    });
  }
});

const removeProductInCart = asyncHandler(async (req, res) => {
  const { _id } = req.user;
  const { pid } = req.params;
  const user = await User.findById(_id).select("cart");
  const alreadyProduct = user?.cart?.find(
    (el) => el.product && el.product.toString() === pid
  );
  if (!alreadyProduct)
    return res.status(200).json({
      success: true,
      mes: "Updated your cart",
    });
  const response = await User.findByIdAndUpdate(
    _id,
    { $pull: { cart: { product: pid } } },
    { new: true }
  );
  return res.status(200).json({
    success: response ? true : false,
    mes: response ? "Updated your cart" : "Something went wrong",
  });
});

const UpdateWhistlist = asyncHandler(async (req, res) => {
  const { pid } = req.params;
  const { _id } = req.user;
  console.log(pid);
  const user = await User.findById(_id);
  const alreadywhistlist = user.wishlist?.find((el) => el.toString() === pid);
  if (alreadywhistlist) {
    const response = await User.findByIdAndUpdate(
      _id,
      { $pull: { wishlist: pid } },
      { new: true }
    );
    return res.json({
      success: response ? true : false,
      mes: response ? "Updated your whistlist" : "Failed to update wthlist!",
    });
  } else {
    const response = await User.findByIdAndUpdate(
      _id,
      { $push: { wishlist: pid } },
      { new: true }
    );
    return res.json({
      success: response ? true : false,
      mes: response ? "Updated your wishlist" : "Failed to update wishlist!",
    });
  }
});

module.exports = {
  register,
  login,
  getCurrent,
  refreshAcessToken,
  logout,
  forgotPassword,
  resetPassword,
  getUser,
  deleteUser,
  updateuser,
  updateuserbyadmin,
  updateuserAddress,
  updateCart,
  removeProductInCart,
  UpdateWhistlist,
};
