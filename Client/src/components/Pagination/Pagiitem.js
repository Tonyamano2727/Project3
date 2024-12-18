import React from "react";
import clsx from "clsx";

const Pagiitem = ({ children, onClick, page }) => {
  return (
    <button
      className={clsx(
        "p-4 w-10 h-10 flex cursor-pointer items-center justify-center",
        !Number(children) && "items-end",
        Number(children) && "hover:rounded-full hover:bg-gray-300",
        children === page && "rounded-full bg-gray-300"
      )}
      onClick={onClick} // Khi người dùng click vào, gọi hàm onClick
      type="button">
      {children}
    </button>
  );
};

export default Pagiitem;
