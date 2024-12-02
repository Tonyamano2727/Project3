import React, { useEffect, useState } from "react";
import payment from "../../assets/payment.svg";
import { useForm } from "react-hook-form";
import { useSelector } from "react-redux";
import backgroundservice from "../../assets/backgroundservice.png";
import { formatMoney } from "../../ultils/helper";
import { Conguration, InputForm, Paypal, Breadcrumb } from "../../components";
import { useDispatch } from "react-redux";
import { getCurrent } from "../../store/user/asyncAction";
import {
  fetchDistricts,
  fetchWards,
  fetchAddressSuggestions,
} from "../../apis/mapApi";

const Checkout = ({ category }) => {
  const { currentCart, current } = useSelector((state) => state.user);
  const [addressSuggestions, setAddressSuggestions] = useState([]);
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

  useEffect(() => {
    const loadSuggestions = async () => {
      if (address && address.length > 1) {
        try {
          const suggestions = await fetchAddressSuggestions(address);
          setAddressSuggestions(suggestions || []);
        } catch (error) {
          console.error("Error fetching address suggestions:", error);
        }
      } else {
        setAddressSuggestions([]);
      }
    };
    loadSuggestions();
  }, [address]);

  return (
    <div className="flex justify-center flex-col items-center">
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
            Check out
          </h2>
          <Breadcrumb category={category} />
        </div>
      </div>
      <div className="max-auto p-8 w-main gap-6 flex justify-center bg-white mt-8 rounded-3xl">
        {isSuccess && <Conguration />}
        <div className="w-[40%] flex  justify-center items-center">
          <img
            src={payment}
            alt="payment"
            className="h-[70%] object-contain"></img>
        </div>
        <div className="w-[80%] flex flex-col">
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
              label="Your address :"
              register={register}
              errors={errors}
              id="address"
              validate={{
                required: "Need fill this field",
              }}
              placeholder="Please fill the address first"
              fullwith={true}
              setValue={setValue}
            />
            {addressSuggestions.length > 0 && (
             <ul  className="absolute z-10 bg-white border border-gray-300 rounded w-[52%] mt-1">
                {addressSuggestions.map((suggestion, index) => (
                  <li
                    key={index}
                    className="p-2 hover:bg-gray-100 cursor-pointer"
                    onClick={() => {
                      setValue("address", suggestion.description);
                      setAddressSuggestions([]);
                    }}>
                    {suggestion.description}{" "}
                  </li>
                ))}
              </ul>
            )}
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
