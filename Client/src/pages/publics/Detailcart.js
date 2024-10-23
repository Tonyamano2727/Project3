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
      <div className="flex justify-center w-full ">
        <div className="w-full">
          <img
            className="relative"
            src={backgroundservice}
            alt="backgroundservice"
          />
        </div>
        <div className="flex absolute flex-col text-white left-20 top-[200px] p-4">
          <h2 className="text-[45px] mb-[8px] font-bold tracking-wide">
            Details Cart
          </h2>
          <Breadcrumb category={category} />
        </div>
      </div>
      <div className="flex flex-col border my-2">
        <div className="font-bold w-main bg-[#00197e] text-white flex border py-3">
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
      <div className="w-main mx-auto justify-end flex flex-col items-end gap-3 my-8">
        <span className="flex items-center gap-8 text-[20px] font-bold">
          <span>Subtotal:</span>
          <span className="">
            {formatMoney(
              currentCart?.reduce(
                (sum, el) => sum + Number(el.product?.price * el.quantity),
                0
              )
            ) + " VND"}
          </span>
        </span>
        <span>
          Shipping, taxes, and discounts calculated at checkout
        </span>
        <div>
            <Button
              handleOnclick={() => {
                navigate(`/${path.CHECK_OUT}`);
              }}
            >
              Check out
            </Button>
        </div>
      </div>
    </div>
  );
};

export default Detailcart;
