import { useSnackbar } from 'notistack'; // Import useSnackbar
import React from "react";
import { IoIosCloseCircle } from "react-icons/io";
import { useDispatch, useSelector } from "react-redux";
import { Showcart } from "../../store/app/appslice";
import { formatMoney } from "../../ultils/helper";
import icons from "../../ultils/icons";
import { Button } from "../../components";
import { apiremovecart } from "../../apis";
import { getCurrent } from "../../store/user/asyncAction";
import { useNavigate } from "react-router-dom";
import path from "../../ultils/path";

const { MdOutlineDeleteOutline } = icons;

const Cart = () => {
  const { enqueueSnackbar } = useSnackbar(); 
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { currentCart, current } = useSelector((state) => state.user);

  const remoproductfromCart = async (pid) => {
    const response = await apiremovecart(pid);
    if (response.success) {
      dispatch(getCurrent());
      enqueueSnackbar('Product removed from cart', { 
        variant: 'success',
        anchorOrigin: {
          vertical: 'top',
          horizontal: 'right',
        }, 
      });
    } else {
      enqueueSnackbar(response.mes, { variant: 'error' }); 
    }
  };

  const renderinfornotitemcart = () => {
    if (current?.cart?.length === 0) {
      return <p>No item in cart.</p>;
    }
  };
  return (
    <div
      onClick={(e) => e.stopPropagation()}
      className="w-full lg:w-[60%] xl:w-[30%] z-50 h-auto overflow-y-auto bg-stone-200 text-black p-6 z-99">
      <header className="py-4 border-b font-bold flex justify-between items-center text-2xl ">
        <span>Your Cart</span>
        <span
          onClick={() => dispatch(Showcart())}
          className="cursor-pointer p-2">
          <IoIosCloseCircle size={50} />
        </span>
      </header>
      <section className="h-auto flex flex-col gap-3 mt-9 ">
        {!currentCart && (
          <span className="text-xs italic">Your cart is empty</span>
        )}
        {currentCart &&
          currentCart.map((el) => (
            <div
              key={el._id}
              className="flex gap-2 items-center border-b border-black">
              <img
                src={el.product?.thumb}
                alt="thumb"
                className="w-16 h-16 object-cover"></img>
              <div className="flex flex-col w-full">
                <div className="flex justify-between items-center w-full">
                  <span className="font-bold">{el.product?.title}</span>
                  <span
                    onClick={() => remoproductfromCart(el.product?._id)}
                    className="p-2 rounded-full hover:bg-gray-500 cursor-pointer">
                    <MdOutlineDeleteOutline size={20} />
                  </span>
                </div>
                <span>Color: {el.color}</span>
                <span>Quantity: {el.quantity}</span>
                <span>Price: {formatMoney(el.product?.price) + "VND"}</span>
              </div>
            </div>
          ))}
      </section>
      <div className="w-full text-center text-main uppercase">
        {renderinfornotitemcart()}
      </div>
      <section className="h-auto flex flex-col justify-center">
        <div className="flex items-center mt-4 justify-between pt-4 border-t border-black">
          <span>Subtotal: </span>
          <span>
            {formatMoney(
              currentCart?.reduce(
                (sum, el) => sum + Number(el.product?.price) * el.quantity,
                0
              )
            ) + "VND"}
          </span>
        </div>
        <span className="text-center text-red-500 italic text-xs mt-2 mb-2">
          Shipping, taxes, and discounts calculated at checkout
        </span>
        <Button
          fw
          handleOnclick={() => {
            dispatch(Showcart());
            navigate(`/${path.DETAIL_CART}`);
          }}>
          Shopping cart
        </Button>
      </section>
    </div>
  );
};

export default Cart;
