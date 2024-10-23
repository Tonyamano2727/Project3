import React, { useEffect, useState, Fragment } from "react";
import { Link, useNavigate } from "react-router-dom";
import path from "../../ultils/path";
import { getCurrent } from "../../store/user/asyncAction";
import { useDispatch, useSelector } from "react-redux";
import icons from "../../ultils/icons";
import { logout } from "../../store/user/userSlice";
import { Showcart } from "../../store/app/appslice";

const {
  HiOutlineShoppingBag,
  GoHeartFill,
  FaAngleDown,
  IoMdMail,
  CiMap,
  MdPhone,
  FaUserCircle,
  FaFacebook,
  FaTelegram,
  FaInstagram,
} = icons;

const { IoLogOut } = icons;
const TopHeader = () => {
  const navigate = useNavigate();
  const [isshowoptions, setisshowoptions] = useState(false);
  const dispatch = useDispatch();
  const { isLoggedIn, current } = useSelector((state) => state.user);
  useEffect(() => {
    if (isLoggedIn) dispatch(getCurrent());
  }, [dispatch, isLoggedIn]);
  const handleLogout = () => {
    dispatch(logout());
    navigate("/");
  };

  return (
    <div className="h-auto w-full bg-gradient-to-t from-[#151835] to-[#1a2046] flex justify-center items-center">
      <div className="w-full md:w-main flex flex-col md:flex-row lg:items-center lg:justify-between items-center md:h-[48px] justify-between  text-xs text-white text-start lg:text-center">
        <div className="items-center flex justify-center text-[12px] gap-2">
          <span className="flex gap-1 text-center items-center">
            <div className="text-[16px]">
              <IoMdMail />
            </div>
            toanb3074@gmail.com
          </span>
          <span className="flex gap-1 text-center items-center ml-2">
            <div className="text-[16px]">
              <CiMap />
            </div>
            18 / 3, Long Thoi commune, Nha Be district, Ho Chi Minh City
          </span>
          <span className="flex gap-1 text-center items-center ml-2">
            <div className="text-[16px]">
              <MdPhone />
            </div>
            +84 038 (6950) 752
          </span>
        </div>
        <div className="flex text-[18px] h-full">
          <div className=" items-center flex p-4">
            <FaFacebook />
          </div>
          <div className=" items-center flex p-4">
            <FaTelegram />
          </div>
          <div className=" items-center flex p-4">
            <FaInstagram />
          </div>
          {current && (
            <Fragment>
              <div
                onClick={() => dispatch(Showcart())}
                className="cursor-pointer flex items-center justify-center -r z-40 w-auto p-4 relative">
                <HiOutlineShoppingBag color="white" />
                <span className="absolute top-6 left-10 text-[15px]">{`${
                  current?.cart?.length || 0
                }`}</span>
              </div>
              <Link
                to={`/${[path.WISHLIST]}`}
                className="cursor-pointer flex items-center justify-center -r z-40 p-4 relative">
                <GoHeartFill color="white" />
                <span className="absolute top-6 left-8 text-[15px]">{`${
                  current?.wishlist?.length || 0
                } `}</span>
              </Link>
            </Fragment>
          )}
          <div className=" items-center flex p-4">
            {isLoggedIn ? (
              <div
                onClick={() => setisshowoptions((prev) => !prev)}
                className="cursor-pointer items-center justify-center text-[15px] gap-2 relative hidden sm:block md:flex">
                {current && current.avatar ? (
                  <img
                    className="h-10 w-10 rounded-full"
                    src={current.avatar}
                    alt="Avatar"
                  />
                ) : (
                  <FaUserCircle />
                )}
                <span className="flex items-center justify-center text-[14px]">
                  Profile{" "}
                  <span className="ml-1">
                    <FaAngleDown />
                  </span>
                </span>
                {isshowoptions && (
                  <div className="absolute flex-col rounded-md top-6 left-[-30px] p-2 ml-10 flex bg-blue-300 min-w-[160px] py-2 z-50">
                    {current && +current.role !== 1945 && (
                      <Link to={`/${[path.PERSONAL]}`}>Personal</Link>
                    )}
                    {+current.role === 1945 && (
                      <Link
                        className="mt-2"
                        to={`/${path.ADMIN}/${[path.OVER_VIEW]}`}>
                        Admin workspace
                      </Link>
                    )}
                    <Link className="mt-2" to={`/${[path.HISTORY]}`}>
                      Order history
                    </Link>
                    <span
                      className="cursor-pointer flex mt-2 w-full text-center justify-center items-center gap-2"
                      onClick={handleLogout}>
                      Logout <IoLogOut />
                    </span>
                  </div>
                )}
              </div>
            ) : (
              <Link
                className="mt-2 md:mt-0 hover:text-white mb-2 md:mb-0 md:w-[30%] w-full text-center"
                to={`/${path.LOGIN}`}>
                <FaUserCircle />
              </Link>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default TopHeader;
