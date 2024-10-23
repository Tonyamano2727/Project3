import React, { useEffect, useState, useCallback } from "react";
import { apigetorder, apiupdatestatusorder } from "../../apis"; // Import the API function
import { InputForm, Pagination, Selectinput } from "../../components";
import { useForm } from "react-hook-form";
import { formatMoney } from "../../ultils/helper";
import moment from "moment";
import useDebounce from "../../hooks/useDebounce";
import { useSearchParams } from "react-router-dom";
import { statusOptions, sortByDate } from "../../ultils/contants";
import { IoMdCreate } from "react-icons/io";

const ManageOrder = () => {
  const [Order, setOrder] = useState([]);
  const [counts, setCounts] = useState(0);
  const [params] = useSearchParams();
  const [selectedStatus, setSelectedStatus] = useState("");
  const [sort, setSort] = useState("");
  const [totalAmount, setTotalAmount] = useState(0);
  const [isEditing, setIsEditing] = useState(null); // State to track which order is being edited
  const [tempStatus, setTempStatus] = useState(""); // State to hold the temporary status

  const {
    register,
    formState: { errors },
    watch,
  } = useForm();
  const q = watch("q");

  // Fetch orders from the API
  const fetchOrder = async (params) => {
    const response = await apigetorder({
      ...params,
      limit: process.env.REACT_APP_PRODUCT_LIMIT,
      sort,
    });

    if (response.success) {
      let orders = response.Order;

      if (sort === "-createdAt") {
        orders.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
      } else if (sort === "createdAt") {
        orders.sort((a, b) => new Date(a.createdAt) - new Date(b.createdAt));
      }

      setOrder(orders);
      setCounts(response.counts);
    }
  };

  const queryDebounce = useDebounce(q, 800);

  // Effect to fetch orders when parameters change
  useEffect(() => {
    const searchParams = Object.fromEntries([...params]);
    if (queryDebounce) searchParams.q = queryDebounce;
    if (selectedStatus && selectedStatus !== "All") {
      searchParams.status = selectedStatus;
    } else {
      delete searchParams.status;
    }
    fetchOrder(searchParams);
  }, [params, queryDebounce, selectedStatus, sort]);

  // Effect to calculate total amount when orders change
  useEffect(() => {
    if (Order.length > 0) {
      const total = Order.reduce((acc, el) => acc + el.total * 23500, 0);
      setTotalAmount(total);
    }
  }, [Order]);

  // Update order status
  const updateOrderStatus = async (oid, status) => {
    if (!status) {
      console.error("No status provided for update");
      return;
    }

    try {
      const response = await apiupdatestatusorder({ status: status }, oid);
      if (response.success) {
        setOrder((prevOrders) =>
          prevOrders.map((order) =>
            order._id === oid ? { ...order, status } : order
          )
        );
        setIsEditing(null); // Reset editing state
        setTempStatus(""); // Reset temporary status
      } else {
        console.error(response.data.message || "Error updating status");
      }
    } catch (error) {
      console.error("Failed to update order status:", error);
    }
  };

  // Change value function for status and sorting
  const changeValue = useCallback((value, type) => {
    if (type === "status") {
      setSelectedStatus(value); // Update selected status
      setTempStatus(""); // Reset temp status when changing status
    } else if (type === "sortByDate") {
      setSort(value);
    }
  }, []);

  return (
    <div className="flex w-[85%] flex-col">
      <div className="flex w-full justify-end items-center">
        <form className="w-[100%] justify-end">
          <InputForm
            style={"inputsearcadmin"}
            id="q"
            register={register}
            errors={errors}
            fullwith
            placeholder="Search order by status or name"
          />
        </form>
      </div>

      <div className="w-full flex justify-end items-center mb-4 gap-5 mt-3">
        <Selectinput
          options={statusOptions}
          changeValue={(value) => changeValue(value, "status")}
          value={selectedStatus}
        />
        <Selectinput
          options={sortByDate}
          changeValue={(value) => changeValue(value, "sortByDate")}
          value={sort}
        />
      </div>

      <div className="border rounded-2xl mt-4 bg-white p-5">
        <table className="rounded-3xl overflow-hidden w-full leading-10">
          <thead>
            <tr className="text-[13px]">
              <th className="">#</th>
              <th className="">Products</th>
              <th className="">Total</th>
              <th className="">Status</th>
              <th className="">Address</th>
              <th className="">Created At</th>
              <th className="">Actions</th> {/* Thêm cột cho Actions */}
            </tr>
          </thead>
          <tbody className="text-[13px]">
            {Order.map((el, idx) => (
              <tr key={el._id}>
                <td className="text-center">{idx + 1}</td>
                <td>
                  <span className="flex flex-col items-center justify-center">
                    {el.products?.map((item) => (
                      <span key={item._id}>
                        {`${item.title} - ${item.color} - ${formatMoney(
                          item.price
                        )} VND`}
                      </span>
                    ))}
                  </span>
                </td>
                <td className="text-center">{`${formatMoney(
                  el.total * 23500
                )} VND`}</td>
                <td className="text-center">
                  {isEditing === el._id ? (
                    <Selectinput
                      options={statusOptions} 
                      changeValue={(value) => setTempStatus(value)} // Update temporary status
                      value={tempStatus || el.status} // Use tempStatus if editing
                    />
                  ) : (
                    el.status 
                  )}
                </td>
                <td className="text-center">{el.address}</td>
                <td className="text-center">
                  {moment(el.createdAt).format("DD/MM/YYYY")}
                </td>
                <td className="py-2 px-4">
                  <div className="flex justify-center items-center">
                    {isEditing === el._id ? (
                      <button
                        className="bg-blue-500 text-white px-4 py-2 rounded"
                        onClick={() => {
                          updateOrderStatus(el._id, tempStatus); // Use tempStatus for update
                          setIsEditing(null);
                        }}
                      >
                        Save
                      </button>
                    ) : (
                      <span
                        onClick={() => {
                          setIsEditing(el._id);
                          setTempStatus(el.status); // Set temp status when editing starts
                        }}
                        className="px-2 hover:underline cursor-pointer">
                        <IoMdCreate size={20} color="blue" />
                      </span>
                    )}
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className="flex justify-end mt-4 mr-5">
        <p>Total Amount: {formatMoney(totalAmount)} VND</p>
      </div>

      <div className="w-full flex justify-end my-8">
        <Pagination totalCount={counts} />
      </div>
    </div>
  );
};

export default ManageOrder;
