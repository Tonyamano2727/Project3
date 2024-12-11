import React from "react";
import { FiLogOut } from "react-icons/fi";
import { useNavigate } from "react-router-dom";

const Header = () => {
  const navigate = useNavigate();
  const handleLogout = () => {
    localStorage.removeItem("accessToken");
    navigate("/");
  };
  return (
    <div className="w-full justify-end flex">
      <header className="flex justify-end w-full">
        <button
          className="flex justify-end gap-2 text-gray-700 hover:text-red-600"
          onClick={handleLogout}>
          <FiLogOut size={20} />
        </button>
      </header>
    </div>
  );
};

export default Header;
