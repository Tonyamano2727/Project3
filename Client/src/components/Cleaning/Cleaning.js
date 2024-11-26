import React from "react";
import { cleaningData } from "../../ultils/contants";
import { NavLink } from "react-router-dom";

const Cleaning = () => {
  return (
    <div className="flex justify-center items-center mt-[-15px] z-50">
    <div className="w-[90%] flex gap-5">
      {cleaningData.map(({ id, imgSrc, title, description, path }) => (
        <NavLink
          key={id}
          to={path}
          className={({ isActive }) =>
            `group flex p-7 h-[150px] bg-[#f3f4f8] justify-center gap-2 rounded-xl transition-all duration-300 hover:mt-[-15px] relative ${
              isActive ? "border-[2px] border-[#2F6EFF]" : ""
            }`
          }
        >
          <div className="mt-2">
            <img src={imgSrc} alt={title} />
          </div>
          <div className="ml-4">
            <h1 className="text-[#00197e] text-[22px] font-semibold font-family">
              {title}
            </h1>
            <p className="text=[14px] text-[#3a4268] font-normal mt-2">
              {description}
            </p>
          </div>
          <div className="absolute bottom-0 left-0 right-0 h-[3px] bg-[#2F6EFF] scale-x-0 transition-transform duration-500 group-hover:scale-x-100"></div>
        </NavLink>
      ))}
    </div>
  </div>
  );
};

export default Cleaning;
