import React from "react";

const Button = ({children, handleOnclick, style, fw ,name , type = 'button'}) => {
  return (
    <div className="w-full justify-center flex">
      <button
        type={type}
        className={
          style
            ? style
            : `px-4 py-2  text-white bg-gradient-to-r from-[#0f1c92] to-[#0e28d1]  rounded-full ${
                fw ? "w-full" : "w-fit"
              }`
        }
        onClick={() => {
          handleOnclick && handleOnclick();
        }}>
       {children}
       {name}
      </button>
    </div>
  );
};

export default Button;
