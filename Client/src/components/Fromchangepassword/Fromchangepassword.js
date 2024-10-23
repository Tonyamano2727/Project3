import React from "react";

const Fromchangepassword = ({ onClose }) => {
  return (
    <div className="flex w-full fixed top-[30px] z-99 justify-center fromanimationchangepass">
      <div className="mt-10 p-7 bg-white rounded-2xl w-[30%] flex flex-col">
        <div className="text-left flex justify-between w-full">
          <span className="font-medium fromchangepasword">Change Password</span>
          <button onClick={onClose}>X</button>
        </div>
        <div className="flex flex-col">
          <div className="flex flex-col mt-10">
            <label className="text-[12px] text-gray-600 font-medium ">Current Password</label>
            <input className='placeholder:text-[12px] placeholder:font-semibold placeholder:px-2 p-1 rounded-3xl bg-[#f5f5f5] mt-3 focus:outline-none focus:border-transparent focus:ring-0' placeholder="Enter Current Password"></input>
          </div>
          <div className="flex flex-col mt-10">
            <label className="text-[12px] text-gray-600 font-medium ">New Password</label>
            <input className='placeholder:text-[12px] placeholder:font-semibold placeholder:px-2 p-1 rounded-3xl bg-[#f5f5f5] mt-3 focus:outline-none focus:border-transparent focus:ring-0' placeholder="Enter New Password"></input>
          </div>
          <div className="flex flex-col mt-10">
            <label className="text-[12px] text-gray-600 font-medium ">Confirm Password</label>
            <input className='placeholder:text-[12px] placeholder:font-semibold placeholder:px-2 p-1 rounded-3xl bg-[#f5f5f5] mt-3 focus:outline-none focus:border-transparent focus:ring-0' placeholder="Enter Confirm Password"></input>
          </div>
          <div className="mt-10">
            <button className="w-full bg-black text-center text-white rounded-full py-1 text-[13px] font-semibold">Save</button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Fromchangepassword;
