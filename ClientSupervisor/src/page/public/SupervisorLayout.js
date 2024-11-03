import React from "react";
import Sidebar from "../../component/Sidebar/Sidebar";
import { Outlet, useNavigate } from "react-router-dom";
import { FiLogOut } from "react-icons/fi";

const SupervisorLayout = () => {
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem("accessToken");
    navigate("/");
  };

  return (
    <div className="flex">
      <div className="w-[20%]">
        <Sidebar />
      </div>
      <div className="w-[80%] p-4">
        <header className="flex justify-end mb-4">
          <button
            className="flex items-center gap-2 text-gray-700 hover:text-red-600"
            onClick={handleLogout}
          >
            <FiLogOut size={20} /> Logout
          </button>
        </header>
        <Outlet />
      </div>
    </div>
  );
};

export default SupervisorLayout;
