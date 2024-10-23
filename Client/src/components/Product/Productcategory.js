import React, { useState } from "react";
import { formatMoney } from "../../ultils/helper";
import { renderStarFromNumber } from "../../ultils/helper";
import { Selectoption } from "..";
import icons from "../../ultils/icons";
import { Link } from "react-router-dom";

const { FaEye, IoMenu, FaHeart } = icons;
const Productcategory = ({ productData, isNew }) => {
  const [isShowOption, setIsShowOption] = useState(false);
  return (
    <div className="w-full px-[10px] text-base">
      <Link
        className="w-full flex flex-col items-center"
        to={`/${productData?.category.toLowerCase()}/${productData?._id}/${productData?.title}`}
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
              <Selectoption icon={<FaEye />} />
              <Selectoption icon={<IoMenu />} />
              <Selectoption icon={<FaHeart />} />
            </div>
          )}
          <img
            src={productData?.thumb || ""}
            alt=""
            className="h-[303px] object-contain "></img>
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
      </Link>
    </div>
  );
};

// line-clamp la dau 3 cham khi qua dai
export default Productcategory;
