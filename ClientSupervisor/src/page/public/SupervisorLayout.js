import React from "react";
import Sidebar from "../../component/Sidebar/Sidebar";
import { Outlet } from "react-router-dom";
const SupervisorLayout = () => {
  return (
    <div className="flex">
      <div className="w-[20%]">
        <Sidebar />
      </div>
      <Outlet />
    </div>
  );
};

export default SupervisorLayout;
