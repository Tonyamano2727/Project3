import React, { useState, useEffect, useCallback } from "react";
import { formatMoney } from "../../ultils/helper";
import Selectquantity from "../Detail/Selectquantity";
import { updateCart } from "../../store/user/userSlice";
import { useDispatch } from "react-redux";
import { useSnackbar } from "notistack"; // Import useSnackbar

const Orderitem = ({ el, defaultQuantity = 1, availableQuantity }) => {
  const dispatch = useDispatch();
  const { enqueueSnackbar } = useSnackbar();
  const [quantity, setQuantity] = useState(defaultQuantity);

  const handlechangequantity = useCallback(
    (operation) => {
      setQuantity((prevQuantity) => {
        let newQuantity = prevQuantity;

        if (operation === "minus" && prevQuantity > 1) {
          newQuantity = prevQuantity - 1;
        } else if (operation === "Plus" && prevQuantity < availableQuantity) {
          newQuantity = prevQuantity + 1;
        }
        if (newQuantity >= availableQuantity) {
          enqueueSnackbar(`You can only order up to ${availableQuantity} items.`, {
            variant: "error",
          });
        }
        return newQuantity;
      });
    },
    [availableQuantity, enqueueSnackbar] 
  );

  const handleQuantity = useCallback(
    (number) => {
      const parsedNumber = Number(number);
      if (!parsedNumber || parsedNumber < 1) {
        return setQuantity(1);
      } else if (parsedNumber > availableQuantity) {
        enqueueSnackbar(`You can only order up to ${availableQuantity} items.`, {
          variant: "error", 
        });
        return setQuantity(availableQuantity);
      } else {
        setQuantity(parsedNumber);
      }
    },
    [availableQuantity, enqueueSnackbar] 
  );

  useEffect(() => {
    if (quantity !== defaultQuantity) {
      dispatch(
        updateCart({
          pid: el.product._id,
          quantity,
          color: el.color,
          title: el.title,
        })
      );
    }
  }, [quantity, dispatch, el, defaultQuantity]);

  return (
    <div className="w-main flex border py-3">
      <span className="w-[50%] flex justify-center">
        <div className="flex w-full items-center justify-center gap-10">
          <img
            src={el.product.thumb}
            alt="thumb"
            className="w-28 h-28 object-cover"
          />
          <div className="flex flex-col text-center">
            <div className="flex justify-between items-center w-full">
              <span className="font-bold">{el.product.title}</span>
            </div>
          </div>
        </div>
      </span>
      <span className="w-[30%] text-center flex justify-center items-center">
        <Selectquantity
          quantity={quantity}
          handleQuantity={handleQuantity}
          handlechangequantity={handlechangequantity}
        />
      </span>
      <span className="text-center flex justify-center items-center w-[20%] font-medium">
        Price: {formatMoney(el.product.price * quantity)} VND
      </span>
    </div>
  );
};

export default Orderitem;
