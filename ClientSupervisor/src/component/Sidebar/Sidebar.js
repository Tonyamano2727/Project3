import React, { Fragment, useState } from "react";

import { SuperSidebar } from "../../ultils/contant"; // Đổi sang SuperSidebar
import { NavLink, Link } from "react-router-dom";
import clsx from "clsx";

const activedStyle =
  "flex items-center gap-2 bg-[#ebebeb] rounded-2xl text-black px-4 mt-3 transition duration-200 ease-in text-[15px] text-gray-600 font-semibold";
const notactivedStyle =
  "flex items-center gap-2 hover:bg-[#ebebeb] rounded-2xl text-gray-500 px-4 mt-3 transition duration-200 ease-in text-[15px] text-gray-600 font-medium";

const Adminsidebar = () => {
  const [actived, setActived] = useState([]);

  const handleShowTab = (tabID) => {
    if (actived.some((el) => el === tabID))
      setActived((prev) => prev.filter((el) => el !== tabID));
    else setActived((prev) => [...prev, tabID]);
  };

  return (
    <div className=" py-4 border-r overflow-y-auto">
      <div className="p-3 leading-[40px]">
        <h1 className="text-gray-500 text-[15px] px-4">MENU</h1>
        {SuperSidebar.map((el) => (
          <Fragment key={el.id}>
            {el.type === "SINGLE" && (
              <NavLink to={el.path} className="px-4 mt-3">
                <span className="text-[15px] text-gray-600 font-semibold">
                  {el.text}
                </span>
              </NavLink>
            )}
            {el.type === "PARENT" && (
              <div
                onClick={() => handleShowTab(el.id)}
                className="flex flex-col mt-3">
                <div className="hover:bg-[#ebebeb] transition duration-200 ease-in cursor-pointer flex items-center justify-between rounded-2xl px-4 text-[15px] text-gray-600 font-medium">
                  <div className="flex items-center gap-2">
                    <span>{el.text}</span>
                  </div>
                </div>
                {actived.some((id) => id === el.id) && (
                  <div className="flex flex-col pl-4 text-[15px] text-gray-600 font-semibold">
                    {el.submenu.map((item) => (
                      <NavLink
                        key={item.path}
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
