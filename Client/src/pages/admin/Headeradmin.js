import React from "react";
import { useSelector } from "react-redux";
import { Link } from "react-router-dom";
import hand from "../../assets/hand.png";
import moment from "moment";

const Headeradmin = () => {
  const { current } = useSelector((state) => state.user);
  const formattedDate = current?.createdAt
    ? moment(current.createdAt).format("DD/MM/YYYY")
    : "N/A";
  return (
    <div className="flex justify-between items-center  mt-4 mb-4 w-[85%]">
      <div className="flex items-center w-[30%]">
        <h1 className="text-[24px] font-semibold tracking-tight textnameadmin">
          {current?.firstname} {current?.lastname} !
        </h1>
        <img className="bg-transparent h-7 w-7 object-cover ml-4" src={hand} />
      </div>
      <div className="text-sm gap-4 flex items-center w-[70%] justify-end">
        <div className="bg-white rounded-3xl p-1 w-[38%] flex justify-center items-center text-[12px]">
          <span className="px-2 w-[50%] font-semibold">Account Status:</span>
          {current?.isBlocked ? (
            <>
              <span className="h-[3px] w-[30%] bg-red-500 rounded-3xl"></span>
              <span className="text-red-500 px-4 ">Blocked</span>
            </>
          ) : (
            <>
              <span className="h-[3px] w-[30%] bg-green-500 rounded-3xl "></span>
              <span className="text-green-500 px-4">Active</span>
            </>
          )}
        </div>
        <div className="bg-white rounded-3xl p-1 w-[38%] flex justify-center items-center text-[12px]">
          <span className="px-2  font-semibold">Creation Date:</span>
          <span className="h-[3px] w-[27%] bg-red-500 rounded-3xl"></span>
          <span className="px-2">{formattedDate}</span>
        </div>
        <div className="h-[35px] flex items-center justify-center w-[35px] rounded-full bg-gradient-to-r from-[#979db6] to-gray-300">
          <Link className="text-black font-semibold">{current?.firstname[0]}</Link>
        </div>
      </div>
    </div>
  );
};

export default Headeradmin;
