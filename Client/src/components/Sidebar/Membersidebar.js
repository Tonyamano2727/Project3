import React, { Fragment, useState } from "react";
import logo from "../../assets/logo.png";
import { AdminSidebar, membersidebar } from "../../ultils/contants";
import { NavLink, Link } from "react-router-dom";
import clsx from "clsx";
import { FaAngleDown } from "react-icons/fa";
import { useSelector } from "react-redux";
import path from "../../ultils/path";

const activedStyle = "px-4 py-2 flex items-center gap-2  bg-blue-500";
const notactivedStyle = "px-4 py-2 flex items-center gap-2  hover:bg-blue-100";

const Membersidebar = () => {
  const { current } = useSelector((state) => state.user);
  const [actived, setactived] = useState([]);
  const handleShowtab = (tabID) => {
    if (actived.some((el) => el === tabID))
      setactived((prev) => prev.filter((el) => el !== tabID));
    else setactived((prev) => [...prev, tabID]);
  };
  console.log(current);
  return (
    <div className="bg-white h-full py-4">
      <Link to={'/'} className="flex flex-col justify-center gap-2 p-4 items-center">
        <img
          src={current?.avatar || logo}
          alt="logo"
          className="w-[80px] object-contain rounded-[50%]"></img>
      </Link>
      <div>
        <div className="flex w-full text-center justify-center items-center">
          <small>{`${current?.firstname} ${current?.lastname}`}</small>
        </div>
        {membersidebar.map((el) => (
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
                className="flex flex-col">
                <div className="flex items-center justify-between px-4 py-2  hover:bg-blue-100 cursor-pointer">
                  <div className="flex items-center gap-2">
                    <span> {el.icon} </span>
                    <span> {el.text} </span>
                  </div>
                  <FaAngleDown />
                </div>
                {actived.some((id) => +id === +el.id) && (
                  <div className="flex flex-col pl-4">
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

export default Membersidebar;
