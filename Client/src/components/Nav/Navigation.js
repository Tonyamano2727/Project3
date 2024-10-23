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
          
          
          <div className="flex justify-between w-full">
            {/* <div className="flex-wrap flex items-center justify-center w-full">
              {navigation.map((el) => (
                <NavLink
                  className="md:pr-10 sm:hover:text-main flex  md:w-auto w-[100%] font-semibold hover:text-black sm:text-black"
                  to={el.path}
                  key={el.id}
                  isActive={isActive}>
                  {el.value}
                </NavLink>
              ))}
            </div> */}
            {/* <div className="md:hidden">
              <div
                onClick={() => dispatch(Showcart())}
                className="cursor-pointer flex items-center justify-center gap-2  border-r z-40 text-[15px] w-full">
                <HiOutlineShoppingBag color="red" />
                <span>{`${current?.cart?.length || 0} item(s)`}</span>
              </div>
              <Link
                to={`/${[path.WISHLIST]}`}
                className="cursor-pointer flex items-center justify-center gap-2 mt-2 border-r z-40 text-[15px]">
                <GoHeartFill color="red" />
                <span>{`${current?.wishlist?.length || 0} item(s)`}</span>
              </Link>
              <div
                onClick={() => setisshowoptions((prev) => !prev)}
                className="cursor-pointer items-center text-white flex px-6 justify-end w-full text-[16px] gap-2 relative md:hidden sm:block m-2">
                {current && current.avatar ? (
                  <img
                    className="h-8 w-8 rounded-full"
                    src={current.avatar}
                    alt="Avatar"
                  />
                ) : (
                  <FaUserCircle />
                )}
                <span className="flex items-center justify-center">Profile <FaAngleDown/></span>
                {isshowoptions && (
                  <div className="absolute flex-col text-[14px] p-2 ml-10 flex top-full bg-gray-100 min-w-[160px] py-2 text-black md:hidden">
                    <Link to={`/${[path.PERSONAL]}`}>PERSONAL</Link>
                    <Link className="mt-2" to={`/${[path.HISTORY]}`}>ORDER HISTORY</Link>
                    {+current.role === 1945 && (
                      <Link
                        className="mt-2"
                        to={`/${path.ADMIN}/${[path.CREATE_PRODUCTS]}`}>
                        Admin workspace
                      </Link>
                    )}
                  </div>
                )}
              </div>
            </div> */}
          </div>

          {/* <div className="flex justify-center text-[13px] lg:text-[15px] xl:text-[17px] w-[100%] flex-auto md:bg-gray-300    mt-[10px]">
            <div className="flex justify-center w-full ">
              <div className="hidden md:flex">
                {categories?.map((el) => (
                  <NavLink
                    key={createSlug(el.title)}
                    to={createSlug(el.title)}
                    className={({ isActive }) =>
                      isActive
                        ? "bg-main text-white px-5 pt-[15px] pb-[14px] hover:text-gray-500 "
                        : "px-5 pt-[15px] pb-[14px] hover:text-gray-500"
                    }>
                    {el.title}
                  </NavLink>
                ))}
              </div>
              <div className="md:hidden w-full sm:border-none mr-2">
                <select
                  className=" w-full focus:outline-none  bg-red text-[17px] bg-gray-500 font-semibold text-white mr-2"
                  onChange={(e) => (window.location.href = e.target.value)}>
                  <option className="mr-2">SELECT A CATEGOTY</option>
                  {categories?.map((el) => (
                    <option
                      key={createSlug(el.title)}
                      value={createSlug(el.title)}>
                      {el.title}
                    </option>
                  ))}
                </select>
              </div>
            </div>
          </div> */}
        </div>
      </div>
    </div>
  );
};

export default Navigation;
