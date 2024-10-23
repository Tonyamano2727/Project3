import React, { useEffect, useState } from "react";
import payment from "../../assets/payment.svg";
import { useForm } from "react-hook-form";
import { useSelector } from "react-redux";
import { formatMoney } from "../../ultils/helper";
import { Conguration, InputForm, Paypal } from "../../components";
import { useDispatch } from "react-redux";
import { getCurrent } from "../../store/user/asyncAction";

const Checkout = () => {
  const { currentCart, current } = useSelector((state) => state.user);
  const dispatch = useDispatch();
  const [isSuccess, setIsSuccess] = useState(false);
  const {
    register,
    formState: { errors },
    watch,
    setValue,
  } = useForm();
  useEffect(() => {
    setValue("address", current?.address);
    setValue("mobile", current?.mobile);
  }, [current]);
  const address = watch("address");
  useEffect(() => {
    if (isSuccess) dispatch(getCurrent());
  }, [isSuccess]);

  return (
    <div className="flex justify-center">
      <div className="max-auto p-8 w-full gap-6 flex ">
        {isSuccess && <Conguration />}
        <div className="w-[40%] flex  justify-center">
          <img
            src={payment}
            alt="payment"
            className="h-[70%] object-contain"></img>
        </div>
        <div className="w-[60%] flex flex-col">
          <h2 className="text-2xl font-bold text-center mb-10">
            Checkout your order
          </h2>
          <table className="table-auto w-full mb-10">
            <thead>
              <tr className="border bg-gray-200">
                <th className="text-left p-2">Products</th>
                <th className="text-center p-2">Quantity</th>
                <th className="text-right p-2">Prices</th>
              </tr>
            </thead>
            <tbody>
              {currentCart?.map((el) => (
                <tr key={el._id} className="border">
                  <td className="text-left p-2">{el.product?.title}</td>
                  <td className=" text-center p-2">{el.quantity}</td>
                  <td className=" text-right p-2">
                    {formatMoney(el.product?.price) + "  VND"}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          <div className="flex items-center mt-4 justify-between pt-4 border-t border-black">
            <span>Subtotal : </span>
            <span className="text-red-500 font-bold">
              {formatMoney(
                currentCart?.reduce(
                  (sum, el) => sum + Number(el.product?.price) * el.quantity,
                  0
                )
              ) + "VND"}
            </span>
          </div>
          <div className="mt-9 mb-3">
            <InputForm
              label="Your address : "
              register={register}
              errors={errors}
              id="address"
              validate={{
                required: "Need fill this field",
              }}
              style="flex-auto"
              placeholder="Please fill the address first"
              fullwith={true}
            />
          </div>
          <div className="mb-9">
            <InputForm
              label="Phone"
              register={register}
              errors={errors}
              id="mobile"
              validate={{
                required: "Need fill this field",
                pattern: {
                  value: /^[0-9 +\-()]+$/,
                  message: "Mobile number must be at least 10 digits long.",
                },
              }}
            />
          </div>
          {address && address?.length > 10 && (
            <div className="w-full flex justify-center">
              <Paypal
                payload={{
                  products: currentCart,
                  total: Math.round(
                    +currentCart?.reduce(
                      (sum, el) =>
                        sum + Number(el.product?.price) * el.quantity,
                      0
                    ) / 23500
                  ),
                  address,
                 
                }}
                setIsSuccess={setIsSuccess}
                amount={Math.round(
                  +currentCart?.reduce(
                    (sum, el) => sum + Number(el.product?.price) * el.quantity,
                    0
                  ) / 23500
                )}
              />
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Checkout;
