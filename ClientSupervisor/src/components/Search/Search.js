import React, { useEffect, useState } from "react";
import icons from "../../ultils/icons";
import { colors } from "../../ultils/contants";
import { createSearchParams, useNavigate, useParams } from "react-router-dom";
import { apiGetProducts } from "../../apis";
import useDebounce from "../../hooks/useDebounce";

const { FaAngleDown } = icons;

const Search = ({
  name,
  activedclick,
  ChangeActiveFilter,
  type = "checkbox",
}) => {
  const { category } = useParams();
  const navigate = useNavigate();
  const [selected, setselected] = useState([]);
  const [price, setprice] = useState({
    from: '',
    to: ''
  });
  const [bestprice, setbestprice] = useState(null);

  const handleSelect = (e) => {
    const alreadyEl = selected.find((el) => el === e.target.value);
    if (alreadyEl)
      setselected((prev) => prev.filter((el) => el !== e.target.value));
    else setselected((prev) => [...prev, e.target.value]);
    ChangeActiveFilter(null);
  };

  useEffect(() => {
    if (selected.length > 0) {
      navigate({
        pathname: `/${category}`,
        search: createSearchParams({
          color: selected.join(","),
        }).toString(),
      });
    } else {
      navigate(`/${category}`);
    }
  }, [selected]);

  const fetchBestPricesProduct = async () => {
    const response = await apiGetProducts({ sort: "-price", limit: 1 });
    if (response.success) setbestprice(response.products[0]?.price);
  };
  useEffect(() => {
    if (type === "input") fetchBestPricesProduct();
  }, [type]);


  const deboupricefrom = useDebounce(price.from, 500)
  const deboupriceto = useDebounce(price.to, 500)
  useEffect(() => {
    // console.log(price);
    const data = {}

    if(Number(price.from) > 0) data.from = price.from
    if(Number(price.to) > 0) data.to = price.to
    navigate({
      pathname: `/${category}`,
      search: createSearchParams(data).toString(),
    });
  }, [deboupricefrom,deboupriceto]);
  return (
    <div
      className="p-2 w-full cursor-pointer rounded-full bg-gradient-to-r from-[#0f1c92] to-[#0e28d1]  gap-6 text-xs relative border border-gray-400 flex justify-between items-center"
      onClick={() => ChangeActiveFilter(name)}>
      <span className="capitalize text-white">{name}</span>
      <span className="text-white"><FaAngleDown /></span>
      {activedclick === name && (
        <div className="absolute top-full left-0 w-fit p-4 border z-20 bg-white flex">
          {type === "checkbox" && (
            <div className="p-2">
              <div className="p-4 items-center  flex justify-center gap-8 ">
                <span className="whitespace-nowrap">
                  {`${selected.length} selected`}
                </span>
                <span
                  onClick={(e) => {
                    e.stopPropagation();
                    setselected([]);
                  }}
                  className="underline cursor-pointer text-black hover:text-main">
                  Reset
                </span>
              </div>
              <div className="flex flex-col justify-center">
                {colors.map((el, index) => (
                  <div className="flex gap-2 mt-2" key={index}>
                    <input
                      className="w-4 h-4   text-white rounded-full bg-[#2b3ac1] border-gray-300 focus:ring-blue-500"
                      onChange={handleSelect}
                      id={el}
                      value={el}
                      type="checkbox"
                      checked={selected.some(
                        (selectedItem) => selectedItem === el
                      )}
                    />
                    <label className="capitalize text-gray-700" htmlFor={el}>
                      {el}
                    </label>
                  </div>
                ))}
              </div>
            </div>
          )}
          {type === "input" && (
            <div onClick={(e) => e.stopPropagation()}>
              <div className="p-4 md:items-center flex items-start justify-center md:gap-4 w-full">
                <span className="whitespace-nowrap text-black">
                  {`The highest price is ${Number(
                    bestprice
                  ).toLocaleString()} VND`}
                </span>
                <span
                  onClick={(e) => {
                    e.stopPropagation();
                    setprice({from: '', to: ''});
                    ChangeActiveFilter(null)
                  }}
                  className="underline cursor-pointer hover:text-main">Reset</span>
              </div>
              <div className="flex items-center gap-2 p-2">
                <div className="flex items-center gap-2">
                  <label htmlFor="from">From</label>
                  <input
                    className="p-2  text-white rounded-full bg-[#2b3ac1]  focus:ring-blue-500"
                    type="number"
                    id="from"
                    value={price.from}
                    onChange={(e) =>
                      setprice((prev) => ({ ...prev, from: e.target.value }))
                    }
                  />
                </div>
                <div className="flex items-center gap-2">
                  <label htmlFor="to">To</label>
                  <input
                    className="p-2  text-white rounded-full bg-[#2b3ac1] border-red-600 focus:ring-blue-500"
                    type="number"
                    id="to"
                    value={price.to}
                    onChange={(e) =>
                      setprice((prev) => ({ ...prev, to: e.target.value }))
                    }
                  />
                </div>
              </div>
            </div>
          )}
          
        </div>
      )}
    </div>
  );
};

export default Search;
