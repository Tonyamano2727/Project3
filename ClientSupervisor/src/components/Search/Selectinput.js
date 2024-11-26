import React from "react";

const Selectinput = ({ value, changeValue, options, className }) => {
  return (
    <select
      className={`p-2 rounded-2xl  w-full text-[14px]  px-4 ${className}`}
      value={value}
      onChange={(e) => changeValue(e.target.value)}
    >
      <option className="text-black" value="">
        Choose option
      </option>
      {options &&
        Array.isArray(options) &&
        options.map((el) => (
          <option className="text-black" key={el.id} value={el.value}>
            {el.text}
          </option>
        ))}
    </select>
  );
};

export default Selectinput;
