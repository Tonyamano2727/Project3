import React from "react";
import { useSelector } from "react-redux";
import { Breadcrumb, Button, Orderitem } from "../../components";
import { formatMoney } from "../../ultils/helper";
import { useNavigate } from "react-router-dom";
import backgroundservice from "../../assets/backgroundservice.png";
import path from "../../ultils/path";

const Detailcart = ({ category }) => {
  const navigate = useNavigate();
  const { currentCart } = useSelector((state) => state.user);

  return (
    <div className="w-full justify-center items-center flex flex-col">
      <div className="w-full relative flex justify-center items-center flex-col bg-[#E7E7E7]">
        <img
          className="w-full object-cover h-[200px] md:h-[350px]"
          src={backgroundservice}
          alt="backgroundservice"
        />
        <div className="absolute text-white flex flex-col items-center md:items-start md:left-20 p-4">
          <h2 className="text-[24px] md:text-[45px] font-bold tracking-wide">
            Detailcart
          </h2>
          <Breadcrumb category={category} />
        </div>
      </div>
      <div className="flex flex-col border my-2 w-full md:w-[90%]">
        <div className="font-bold bg-[#00197e] text-white flex border py-3 w-full">
          <span className="w-[50%] text-center">Product</span>
          <span className="w-[30%] text-center">Quantity</span>
          <span className="w-[20%] text-center">Price</span>
        </div>
        {currentCart?.map((el) => {
          const availableQuantity = el.product.quantity;

          return (
            <Orderitem
              el={el}
              key={el._id}
              defaultQuantity={el.quantity}
              availableQuantity={availableQuantity}
            />
          );
        })}
      </div>
      <div className="w-full sm:w-main mx-auto md:justify-end justify-start flex flex-col items-start md:items-end gap-3 my-8 px-4 sm:px-0">
        <span className="flex md:items-center items-start gap-8 text-[20px] font-bold">
          <span>Subtotal:</span>
          <span>
            {formatMoney(
              currentCart?.reduce(
                (sum, el) => sum + Number(el.product?.price * el.quantity),
                0
              )
            ) + " VND"}
          </span>
        </span>
        <span>Shipping, taxes, and discounts calculated at checkout</span>
        <div>
          <Button
            handleOnclick={() => {
              navigate(`/${path.CHECK_OUT}`);
            }}>
            Check out
          </Button>
        </div>
      </div>
    </div>
  );
};

export default Detailcart;
