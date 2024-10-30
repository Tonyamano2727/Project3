import React from "react";
import { Breadcrumb, Product } from "../../components";
import { useSelector } from "react-redux";
import backgroundservice from "../../assets/backgroundservice.png";

const Mywhistlist = ({ title }) => {
  const { current } = useSelector((state) => state.user);
  const renderEmptyWishlistMessage = () => {
    if (current?.wishlist?.length === 0) {
      return <p>There are no favorite products.</p>;
    }
  };

  return (
    <div className="w-full flex items-center justify-center">
      <div className="flex flex-col w-full">
        <div className="flex justify-center w-full ">
          <div className="w-full  ">
            <img
              className="relative"
              src={backgroundservice}
              alt="backgroundservice"
            />
          </div>
          <div className="flex absolute flex-col text-white left-20 top-[200px] p-4">
            <h2 className="text-[45px] mb-[8px] font-bold font tracking-wide">
              Wishlist
            </h2>
            <Breadcrumb title={title} />
          </div>
        </div>
        <div className="w-full flex flex-wrap gap-4">
          {current?.wishlist?.map((el) => (
            <div className="flex w-[45%] md:w-[30%] lg:w-[22%] xl:w-[24%]">
              <Product key={el.id} pid={el._id} productData={el} />
            </div>
          ))}
          <div className="w-full text-center text-blue-300 uppercase mt-20">
            {renderEmptyWishlistMessage()}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Mywhistlist;
