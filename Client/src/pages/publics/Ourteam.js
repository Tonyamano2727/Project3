import React, { useState, useEffect } from "react";
import { apiGetEmployee } from "../../apis";
import {
  Inputfields,
  Pagination,
  Selectinput,
  Breadcrumb,
} from "../../components";
import backgroundservice from "../../assets/backgroundservice.png";
import { useSearchParams } from "react-router-dom";
import useDebounce from "../../hooks/useDebounce";

const Ourteam = ({ title }) => {
  const [invalidFields, setinvalidFields] = useState([]);
  const [staff, setStaff] = useState([]);
  const [counts, setCounts] = useState(0);
  const [queries, setQueries] = useState({
    q: "",
    district: "",
  });
  const [districts, setDistricts] = useState([]); // State to store districts
  const [sort, setSort] = useState("");
  const [params] = useSearchParams();

  const changeValue = (value) => {
    if (value.includes("district")) {
      setQueries((prev) => ({ ...prev, district: value }));
    } else {
      setSort(value);
    }
  };

  const fetchEmployees = async (params) => {
    const response = await apiGetEmployee({
      ...params,
      limit: process.env.REACT_APP_PRODUCT_LIMIT,
      sort,
    });
    if (response.success) {
      setStaff(response.staff);
      setCounts(response.counts);
    }
  };

  const queriesDebounce = useDebounce(queries.q, 800);

  useEffect(() => {
    const searchParams = Object.fromEntries([...params]);
    if (queriesDebounce) searchParams.q = queriesDebounce;

    if (queries.district) {
      searchParams.district = queries.district;
    }

    fetchEmployees(searchParams);
  }, [params, queriesDebounce, queries, sort]);

  return (
    <div className="w-full flex justify-center items-center flex-col bg-[#E7E7E7]">
      <div className="flex justify-center w-full">
        <div className="w-full">
          <img
            className="relative"
            src={backgroundservice}
            alt="backgroundservice"
          />
        </div>
        <div className="flex absolute flex-col text-white left-20 top-[200px] p-4">
          <h2 className="text-[45px] mb-[8px] font-bold tracking-wide">
            Services
          </h2>
          <Breadcrumb title={title} />
        </div>
      </div>
      <div className="flex flex-wrap w-[85%] justify-center items-center mt-20 gap-5 mb-20">
        {staff.map((employee) => (
          <div
            className="w-[30%] p-6 bg-white text-center leading-[50px]"
            key={employee._id}>
            <img
              className="flex w-full h-[240px] object-cover"
              src={employee.avatar}
              alt={employee.name}
            />
            <h2 className="text-[#00197e] text-[22px] font-semibold">
              {employee.name}
            </h2>
            <p className="text-[16px] font-light leading-[26px] text-[#3a4268]">
              {employee.job}
            </p>
            <p className="text-[16px] font-light leading-[26px] text-[#3a4268]">
              {employee.district}
            </p>
          </div>
        ))}
        <div className="w-full flex justify-end mt-5 p-5">
          <Pagination totalCount={counts} />
        </div>
      </div>
    </div>
  );
};

export default Ourteam;
