import React, { Fragment, useState } from "react";
import logo from "../../assets/logo.png";
import { AdminSidebar } from "../../ultils/contants";
import { NavLink, Link } from "react-router-dom";
import clsx from "clsx";
import { FaAngleDown } from "react-icons/fa";

const activedStyle = "flex items-center gap-2  bg-[#ebebeb] rounded-2xl text-black px-4 mt-3 transition duration-200 ease-in text-[15px] text-gray-600 font-semibold ";
const notactivedStyle = "flex items-center gap-2  hover:bg-[#ebebeb] rounded-2xl text-gray-500 px-4 mt-3 transition duration-200 ease-in text-[15px] text-gray-600 font-medium";

const Adminsidebar = () => {
 
  const [actived, setactived] = useState([]);
  const handleShowtab = (tabID) => {
    if (actived.some((el) => el === tabID))
      setactived((prev) => prev.filter((el) => el !== tabID));
    else setactived((prev) => [...prev, tabID]);
  };

  return (
    <div className=" full py-4 border-r overflow-y-auto">
      <Link
        to={"/"}
        className="flex flex-col justify-center gap-2 p-4 items-center ">
        <img src={logo} alt="logo" className="w-[150px] object-contain"></img>
      </Link>
      <div className="p-3 leading-[40px]">
        <h1 className="text-gray-500 text-[15px] px-4 ">MENU</h1>
        {AdminSidebar.map((el) => (
          <Fragment key={el.id}>
            {el.type === "SINGLE" && (
              <NavLink
                to={el.path}
                className={({ isActive }) =>
                  clsx(isActive && activedStyle, !isActive && notactivedStyle)
                }>
                <span> {el.icon} </span>
                <span> {el.text} </span>
              </NavLink>
            )}
            {el.type === "PARENT" && (
              <div
                onClick={() => handleShowtab(+el.id)}
                className="flex flex-col mt-3">
                <div className="hover:bg-[#ebebeb] transition duration-200 ease-in cursor-pointer flex items-center justify-between rounded-2xl px-4 text-[15px] text-gray-600 font-medium ">
                  <div className="flex items-center gap-2">
                    <span> {el.icon} </span>
                    <span> {el.text} </span>
                  </div>
                  <FaAngleDown />
                </div>
                {actived.some((id) => +id === +el.id) && (
                  <div className="flex flex-col pl-4 text-[15px] text-gray-600 font-semibold ">
                    {el.submenu.map((item) => (
                      <NavLink
                        key={el.text}
                        to={item.path}
                        onClick={(e) => e.stopPropagation()}
                        className={({ isActive }) =>
                          clsx(
                            isActive && activedStyle,
                            !isActive && notactivedStyle
                          )
                        }>
                        {item.text}
                      </NavLink>
                    ))}
                  </div>
                )}
              </div>
            )}
          </Fragment>
        ))}
      </div>
    </div>
  );
};

export default Adminsidebar;
