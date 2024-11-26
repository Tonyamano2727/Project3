import React, { useEffect, useState } from "react";
import { Fromupdateprofile, Fromchangepassword } from "../../components";
import { useDispatch, useSelector } from "react-redux";
import iconprofile from "../../assets/iconprofile.png";
import { logout } from "../../store/user/userSlice";
import { getCurrent } from "../../store/user/asyncAction";
import { useNavigate } from "react-router-dom";
import icons from "../../ultils/icons";
const { HiOutlineLogout } = icons;
const Personal = () => {
  const { isLoggedIn, current } = useSelector((state) => state.user);
  const dispath = useDispatch();
  const navigate = useNavigate();
  const [showFormUpdate, setShowFormUpdate] = useState(false);
  const [showFormChangePassword, setShowFormChangePassword] = useState(false);

  const toggleFormUpdate = () => {
    setShowFormUpdate((prevState) => !prevState);
  };
  const toggleFormChangePassword = () => {
    setShowFormChangePassword((prevState) => !prevState);
  };
  useEffect(() => {
    if (isLoggedIn) dispath(getCurrent());
  }, [dispath, isLoggedIn]);
  const handleLogout = () => {
    dispath(logout());
    navigate("/");
  };
  return (
    <div className="flex justify-center items-center bg-[#F3F3F7] pb-16">
      <div className="w-[85%] bg-white rounded-3xl mt-16">
      <div class=" rounded p-4 px-4 md:p-8 mb-6">
        <div className="flex justify-between items-center">
          <div className="flex justify-start items-center gap-3 ">
            <div className="h-[70px] rounded-full bg-gradient-to-r from-[#e0a96a] to-[#e07c93] w-[70px] flex items-center justify-center">
              <h1 className="text-[24px] text-white font-medium tracking-tight">
                {current?.firstname[0]}
              </h1>
            </div>
            <div className="flex flex-col">
              <div className="flex font-medium text-[23px] textnameadmin">
                <h3>{current?.firstname}</h3>
                <h3 className="px-2">{current?.lastname}</h3>
              </div>
              <div>
                <p className="text-[12px] text-gray-600 mt-1 font-semibold ">
                  {current?.email}
                </p>
              </div>
            </div>
          </div>
          <div className="flex items-center justify-end gap-8">
            <span
              className="cursor-pointer text-[13px] text-black font-semibold tracking-wide bg-[#eef0f3] px-6 py-2 rounded-3xl flex items-center gap-2"
              onClick={toggleFormUpdate}>
              Update information
            </span>
            {showFormUpdate && (
              <div className="absolute min-h-screen bg-box inset-0 bg-overplay z-50 flex ">
                <Fromupdateprofile onClose={toggleFormUpdate} />
              </div>
            )}
            <span
              className="cursor-pointer text-[13px] px-6 text-black font-semibold tracking-wide bg-[#eef0f3]  py-2 rounded-3xl flex justify-center items-center gap-2"
              onClick={handleLogout}>
              Log Out
              <HiOutlineLogout />
            </span>
          </div>
        </div>
        <div className="bg-gradient-to-r from-[#faf5ee] to-[#f4f1ee] p-5 rounded-xl border mt-5 w-[60%] flex justify-between">
          <div className="flex justify-center flex-col w-[70%]">
            <div className="flex  gap-[100px] ">
              <div className="flex flex-col">
                <p className="text-left  text-[#000] dark:text-gray2 text-opacity-40 text-[13px] font-medium">
                  Current Status
                </p>
                <p className="text-[17px] font-semibold">
                  {current.isBlocked ? "Blocked" : "Active"}
                </p>
              </div>
              <div className="flex flex-col w-[40%]">
                <p className="text-left text-[#000] dark:text-gray2 text-opacity-40 text-[13px] font-medium">
                  Current address
                </p>
                <p className="text-[17px] font-semibold truncate text-ellipsis whitespace-nowrap overflow-hidden">
                  {current?.address}
                </p>
              </div>
            </div>
            <div className="flex gap-[90px] mt-7">
              <div className="flex flex-col">
                <p className="text-left  text-[#000] dark:text-gray2 text-opacity-40 text-[13px] font-medium">
                  Current mobile
                </p>
                <p className="text-[17px] font-semibold">{current.mobile}</p>
              </div>
              <div className="flex flex-col">
                <p className="text-left  text-[#000] dark:text-gray2 text-opacity-40 text-[13px] font-medium">
                  Current role
                </p>
                <p className="text-[17px] font-semibold">
                  {"User"}
                </p>
              </div>
            </div>
          </div>
          <div className="w-[25%]">
            <img className="h-[100px] object-contain" src={iconprofile} />
          </div>
        </div>
        
      </div>
    </div>
    </div>
  );
};

export default Personal;
