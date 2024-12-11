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
  const [districts, setDistricts] = useState([]);
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
      <div className="w-full relative flex justify-center items-center flex-col bg-[#E7E7E7]">
        <img
          className="w-full object-cover h-[200px] md:h-[350px]"
          src={backgroundservice}
          alt="backgroundservice"
        />
        <div className="absolute text-white flex flex-col items-center md:items-start md:left-20 p-4">
          <h2 className="text-[24px] md:text-[45px] font-bold tracking-wide">
            Ourteam
          </h2>
          <Breadcrumb title={title} />
        </div>
      </div>
      <div className="flex flex-wrap w-[85%] justify-center items-center mt-10 md:mt-20 gap-5 mb-10 md:mb-20">
        {staff.map((employee) => (
          <div
            className="w-full sm:w-[48%] md:w-[45%] lg:w-[30%] p-6 bg-white text-center shadow-md rounded-lg"
            key={employee._id}>
            <img
              className="w-full h-[180px] md:h-[240px] object-cover rounded-md"
              src={employee.avatar}
              alt={employee.name}
            />
            <h2 className="text-[#00197e] text-[18px] sm:text-[20px] md:text-[22px] font-semibold">
              {employee.name}
            </h2>
            <p className="text-[14px] md:text-[16px] text-[#3a4268] font-light leading-6">
              {employee.job}
            </p>
            <p className="text-[14px] md:text-[16px] text-[#3a4268] font-light leading-6">
              {employee.district}
            </p>
          </div>
        ))}
      </div>
      <div className="w-full flex justify-end mt-5 p-5">
        <Pagination totalCount={counts} />
      </div>
    </div>
  );
};

export default Ourteam;
