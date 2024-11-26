import React from "react";
import clsx from "clsx";

const Select = ({
  label,
  options = [],
  register,
  errors,
  id,
  validate,
  style,
  fullWidth,
  defaultValue
}) => {
  return (
  
    <div className="flex w-full flex-col gap-2">
      {label && <label htmlFor={id} className="text-[13px]">{label}</label>}
      <select defaultValue={defaultValue} className={clsx('p-2 border rounded-3xl mt-1 px-4 w-full text-gray-500 bg-gray-50', fullWidth && 'w-full', style)} id={id} {...register(id, validate)}>
        <option className="text-gray-500" value="">---Choose---</option>
        {options?.map(el => (
          <option key={el.code} value={el.code}>{el.value}</option>
        ))}
      </select>
      {errors && errors[id] && (
        <small className="text-xs text-red-500">{errors[id]?.message}</small>
      )}
    </div>
  );
};

export default Select;
