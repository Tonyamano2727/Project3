import React from "react";
import Sidebar from "../../component/Sidebar/Sidebar";
import { Outlet } from "react-router-dom";

import Header from "./Header";

const SupervisorLayout = () => {
  return (
    <div className="flex min-h-screen">
      <div className="w-[15%]">
        <Sidebar />
      </div>
      <div className="w-[85%] bg-[#f3f4f6] items-center flex flex-col p-6">
        <Header />
        <Outlet />
      </div>
    </div>
  );
};

export default SupervisorLayout;
