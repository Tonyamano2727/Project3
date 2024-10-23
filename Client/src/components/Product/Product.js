import React, { useState } from "react";
import { formatMoney, renderStarFromNumber } from "../../ultils/helper";
import { Selectoption } from "..";
import icons from "../../ultils/icons";
import {
  Link,
  useLocation,
  useNavigate,
  createSearchParams,
} from "react-router-dom";
import { apiupdatecart, apiupdatewhislist } from "../../apis";
import { useSnackbar } from "notistack"; // Import useSnackbar
import { useDispatch, useSelector } from "react-redux";
import { getCurrent } from "../../store/user/asyncAction";
import Swal from "sweetalert2";
import path from "../../ultils/path";

const { FaEye, FaHeart, BsCartCheckFill, BsCartPlusFill } = icons;

const Product = ({ productData, pid }) => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const location = useLocation();
  const [isShowOption, setIsShowOption] = useState(false);
  const { current } = useSelector((state) => state.user);
  const { enqueueSnackbar } = useSnackbar(); // Initialize notistack

  const handleClickOptions = async (e, flag) => {
    e.stopPropagation();
    if (flag === "CART") {
      if (!current) {
        return Swal.fire({
          title: "Almost",
          text: "Please login first",
          icon: "info",
          cancelButtonText: "Not now!",
          showConfirmButton: true,
          confirmButtonText: "Go to login page",
        }).then(async (rs) => {
          if (rs.isConfirmed) {
            navigate({
              pathname: `/${path.LOGIN}`,
              search: createSearchParams({
                redirect: location.pathname,
              }).toString(),
            });
          }
        });
      }

      const response = await apiupdatecart({
        pid: productData._id,
        color: productData.color,
        price: productData.price,
        title: productData.title,
        thumb: productData.thumb,
      });
      if (response.success) {
        dispatch(getCurrent());
        enqueueSnackbar(response.mes.message || "Added to cart!", {
          variant: "success",
        });
      } else {
        enqueueSnackbar(response.mes.message || "Failed to add to cart!", {
          variant: "error",
        });
      }
    }

    if (flag === "WHISLIST") {
      if (!current) {
        return Swal.fire({
          title: "Almost",
          text: "Please login first",
          icon: "info",
          cancelButtonText: "Not now!",
          showConfirmButton: true,
          confirmButtonText: "Go to login page",
        }).then(async (rs) => {
          if (rs.isConfirmed) {
            navigate({
              pathname: `/${path.LOGIN}`,
              search: createSearchParams({
                redirect: location.pathname,
              }).toString(),
            });
          }
        });
      }

      const response = await apiupdatewhislist(pid);
      if (response.success) {
        dispatch(getCurrent());
        enqueueSnackbar(response.mes, { variant: "success" });
      } else {
        enqueueSnackbar(response.mes, { variant: "error" });
      }
    }
  };

  return (
    <div className="w-full px-[10px] text-base">
      <div
        className="w-full flex flex-col items-center"
        onMouseEnter={(e) => {
          e.stopPropagation();
          setIsShowOption(true);
        }}
        onMouseLeave={(e) => {
          e.stopPropagation();
          setIsShowOption(false);
        }}>
        <div className="w-full relative flex justify-center">
          {isShowOption && (
            <div className="absolute flex bottom-[-20px] left-0 right-0 justify-center gap-2 animate-slide-top">
              <Link
                to={
                  productData
                    ? `/${productData.category?.toLowerCase()}/${
                        productData?._id
                      }/${productData?.title}`
                    : "#"
                }>
                <Selectoption icon={<FaEye />} />
              </Link>

              {current?.cart?.some(
                (el) => el?.product?._id === productData._id.toString()
              ) ? (
                <span title="Added to cart">
                  <Selectoption icon={<BsCartCheckFill color="red" />} />
                </span>
              ) : (
                <span
                  onClick={(e) => handleClickOptions(e, "CART")}
                  title="Add to cart">
                  <Selectoption icon={<BsCartPlusFill color="pink" />} />
                </span>
              )}

              <span
                title="Add to Wishlist"
                onClick={(e) => handleClickOptions(e, "WHISLIST")}>
                <Selectoption
                  icon={
                    <FaHeart
                      color={
                        current?.wishlist?.some((el) => el.toString() === pid)
                          ? "red"
                          : "red"
                      }
                    />
                  }
                />
              </span>
            </div>
          )}
          <img
            src={productData?.thumb || ""}
            alt=""
            className="h-[303px] object-contain"
          />
        </div>
        <div className="flex flex-col items-center gap-1 w-full leading-10">
          <span className="line-clamp-1 font-semibold text-[20px] mt-4">
            {productData?.title}
          </span>
          <span className="flex h-4">
            {renderStarFromNumber(productData?.totalRatings)}
          </span>
          <span>{`${formatMoney(productData?.price)} VNĐ `}</span>
        </div>
      </div>
    </div>
  );
};

export default Product;
