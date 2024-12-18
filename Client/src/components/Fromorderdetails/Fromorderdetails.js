import React from "react";
import moment from "moment";
import { formatMoney } from "../../ultils/helper";

const Fromorderdetails = ({ order, onClose }) => {
  if (!order) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center ">
      <div className="bg-white rounded-lg p-10  from">
        <div className="flex justify-end w-full items-center">
          <button
            className=" text-black px-4  rounded"
            onClick={onClose}>
            Close
          </button>
        </div>
        <div className="flex gap-5">
          <div className="w-[45%] leading-10">
            <p>
              <strong>Status:</strong> {order.status}
            </p>
            <p>
              <strong>Total:</strong> {formatMoney(order.total * 23500)} VND
            </p>
            <p>
              <strong>Address:</strong> {order.address}
            </p>
            <p>
              <strong>Created At:</strong>{" "}
              {moment(order.createdAt).format("DD/MM/YYYY")}
            </p>
          </div>
          <div className="w-[45%]">
            <p>
              <strong>Products:</strong>
            </p>
            <ul className="list-disc list-inside leading-10">
              {order.products.map((product) => (
                <li key={product._id}>
                  {`${product.title} - ${product.color} - ${formatMoney(
                    product.price
                  )} VND`}
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Fromorderdetails;
