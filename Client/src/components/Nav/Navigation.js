import React, { useState } from "react";
import { navigation } from "../../ultils/contants";
import { Link, NavLink } from "react-router-dom";
import { createSlug } from "../../ultils/helper";
import { useDispatch, useSelector } from "react-redux";
import icons from "../../ultils/icons";
import logo from "../../assets/logo.png";
import path from "../../ultils/path";
import { Showcart } from "../../store/app/appslice";


const { FaUserCircle, HiOutlineShoppingBag, GoHeartFill , FaAngleDown} = icons;

const Navigation = () => {
  const dispatch = useDispatch();
  const { current } = useSelector((state) => state.user);
  const [showMenu, setShowMenu] = useState(false);
  const { categories } = useSelector((state) => state.app);
  const [isshowoptions, setisshowoptions] = useState(false);
  const toggleMenu = () => {
    setShowMenu(!showMenu);
  };

  const isActive = ({ match }) => {
    return match
      ? "lg:pr-10 hover:text-main text-main"
      : "lg:pr-10 hover:text-main";
  };
  return (
    <div className="w-full">
      <div className="w-full h-auto flex justify-center items-center flex-col bg-gray-500">
        

        <div
          className={`md:flex ${
            showMenu ? "flex" : "hidden"
          } justify-center w-[full] flex flex-wrap p-2 md:p-0 md:bg-white text-white sm:text-black text-[18px]`}>
          
          
          

          
        </div>
      </div>
    </div>
  );
};

export default Navigation;
