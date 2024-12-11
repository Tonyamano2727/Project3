import React, { useState } from "react";
import logo from "../../assets/logo.png";
import { navigation } from "../../ultils/contants";
import { Link, NavLink } from "react-router-dom";
import path from "../../ultils/path";

const Header = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const isActive = ({ match }) => {
    return match
      ? "lg:pr-10 hover:text-main text-main"
      : "lg:pr-10 hover:text-main";
  };

  return (
    <div className="w-[90%] md:flex xl:justify-between xl:w-main items-center py-[18px]">
      <div className="w-full flex justify-between md:w-[20%]">
        <Link className="flex justify-center w-[20%] md:w-[auto]" to={`/${path.HOME}`}>
          <img
            src={logo}
            alt="Logo"
            className="w-[174px] object-contain z-50"
          />
        </Link>
        <button
          onClick={() => setIsMenuOpen(!isMenuOpen)}
          className="md:hidden text-[24px] text-[#00197e]">
          {isMenuOpen ? "X" : "☰"}
        </button>
      </div>

      <div
        className={`md:flex text-[14px] justify-center items-center xl:w-[70%] md:w-[80%] ${
          isMenuOpen ? "flex" : "hidden md:flex"
        }`}>
        <div className="flex-wrap flex items-center justify-center w-full rounded-2xl bg-[#151835]  md:bg-white mt-4 md:mt-0">
          {navigation.map((el) => (
            <NavLink
              className=" md:pr-10 md:text-[#00197e] text-[16px] flex md:w-auto w-[100%] font-medium  p-3  text-white"
              to={el.path}
              key={el.id}
              isActive={isActive}>
              {el.value}
            </NavLink>
          ))}
        </div>
        <div className="bg-[#FFC703] p-3 w-[28%] hidden lg:block text-center rounded-full transition-all duration-300 hover:bg-blue-500">
          <Link className="text-[16px] w-full font-medium">Get Free Quote</Link>
        </div>
      </div>
    </div>
  );
};

export default Header;
