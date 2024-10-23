import React, { Fragment, useState } from "react";
import logo from "../../assets/logo.png";
import { navigation } from "../../ultils/contants";
import { Link, NavLink } from "react-router-dom";
import path from "../../ultils/path";

const Header = () => {
  const isActive = ({ match }) => {
    return match
      ? "lg:pr-10 hover:text-main text-main"
      : "lg:pr-10 hover:text-main";
  };
  return (
    <div className="w-full md:flex justify-center xl:justify-between xl:w-main items-center py-[18px] hidden">
      <Link className="flex justify-center" to={`/${path.HOME}`}>
        <img
          src={logo}
          alt="Logo"
          className="w-[174px] object-contain z-50"></img>
      </Link>
      <div className="flex text-[14px] justify-center items-center w-[64%]">
        <div className="flex-wrap flex items-center justify-center w-full ">
          {navigation.map((el) => (
            <NavLink
              className="md:pr-10 text-[#00197e] text-[16px] flex  md:w-auto w-[100%] font-medium"
              to={el.path}
              key={el.id}
              isActive={isActive}>
              {el.value}
            </NavLink>
          ))}
        </div>
        <div className="bg-[#FFC703] p-3 w-[28%] text-center rounded-full transition-all duration-300 hover:bg-blue-500">
          <Link className="text-[16px] w-full font-medium">Get Free Quote</Link>
        </div>
      </div>
    </div>
  );
};

export default Header;
