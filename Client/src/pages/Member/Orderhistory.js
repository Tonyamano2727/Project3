import React, { useEffect, useState } from "react";
import { apigetorder, apigetorderyuser } from "../../apis";
import { Breadcrumb, InputForm, Pagination } from "../../components";
import { useForm } from "react-hook-form";
import { formatMoney } from "../../ultils/helper";
import moment from "moment";
import backgroundservice from "../../assets/backgroundservice.png";
import useDebounce from "../../hooks/useDebounce";
import { useSearchParams } from "react-router-dom";

const Orderhistory = ({ title }) => {
  const [Order, setorder] = useState(null);
  const [counts, setcounts] = useState(0);
  const [params] = useSearchParams();
  const [Update, setUpdate] = useState(false);

  const [totalAmount, setTotalAmount] = useState(0);
  const {
    register,
    formState: { errors },
    watch,
  } = useForm();
  const q = watch("q");

  const fetchOrder = async (params) => {
    const response = await apigetorderyuser({
      ...params,
      limit: process.env.REACT_APP_PRODUCT_LIMIT,
    });
    if (response.success) {
      setorder(response.Order);
      setcounts(response.counts);
    }
  };

  const querydeBounce = useDebounce(watch("q"), 800);

  useEffect(() => {
    const searchParams = Object.fromEntries([...params]);
    if (querydeBounce) searchParams.q = querydeBounce;
    fetchOrder(searchParams);
  }, [params, querydeBounce]);

  useEffect(() => {
    if (Order) {
      let total = 0;
      Order.forEach((el) => {
        total += el.total * 23500;
      });
      setTotalAmount(total);
    }
  }, [Order]);
  return (
    <div className=" flex justify-center items-center flex-col bg-[white]">
      <div className="w-full relative flex justify-center items-center flex-col bg-[#E7E7E7]">
        <img
          className="w-full object-cover h-[200px] md:h-[350px]"
          src={backgroundservice}
          alt="backgroundservice"
        />
        <div className="absolute text-white flex flex-col items-center md:items-start md:left-20 p-4">
          <h2 className="text-[24px] md:text-[45px] font-bold tracking-wide">
            History
          </h2>
          <Breadcrumb title={title} />
        </div>
      </div>
      <div className="flex justify-center items-center w-[100%]">
        <form className="w-[91%] mt-4">
          <InputForm
            style={"w500"}
            id="q"
            register={register}
            errors={errors}
            fullwith
            placeholder="Search order by status"
          />
        </form>
      </div>
      <div className="border rounded-2xl mt-4 bg-[#f3f3f7] p-5 w-[90%]">
        <table className="w-[100%] mt-2 text-center">
          <thead className="">
            <tr className="text-[15px]">
              <th>#</th>
              <th>Products</th>
              <th>Total</th>
              <th>Status</th>
              <th>Created At</th>
            </tr>
          </thead>
          <tbody className="text-[12px]">
            {Order?.map((el, idx) => (
              <tr className=" border-b" key={el._id}>
                <td className="text-center">{idx + 1}</td>
                <td className="">
                  <span className="flex flex-col items-center justify-center p-5">
                    {el.products?.map((item) => (
                      <span>
                        {`${item.title} - ${item.color} - ${formatMoney(
                          item.price
                        )} VND`}
                        {/* <img src={item.thumb}></img> */}
                      </span>
                    ))}
                  </span>
                </td>
                <td className="text-center">{`${formatMoney(
                  el.total * 23500
                )} VND`}</td>
                <td className="text-center">{el.status}</td>
                <td className="text-center">
                  {moment(el.createdAt).format("DD/MM/YYYY")}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <div className="w-[90%] flex justify-end items-center mt-2">
        <p>Total Amount: {formatMoney(totalAmount)} VND</p>{" "}
      </div>
      <div className="w-[90%] flex justify-end my-8">
        <Pagination totalCount={counts}></Pagination>
      </div>
    </div>
  );
};

export default Orderhistory;
