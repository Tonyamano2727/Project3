import React, { useState, useEffect } from "react";
import { apiGetEmployee } from "../../apis";
import { Breadcrumb } from "../../components";
import backgroundservice from "../../assets/backgroundservice.png";

const Ourteam = ({title}) => {
  const [staff, setStaff] = useState([]);

  const fetchEmployees = async () => {
    try {
      const response = await apiGetEmployee(); 
      if (response.success && response.staff) {
        setStaff(response.staff);
        console.log(response.staff);
      } else {
        console.log("No staff found in response.");
      }
    } catch (error) {
      console.log(error.message);
    }
  };

  useEffect(() => {
    fetchEmployees();
  }, []);

  return (
    <div className="w-full flex justify-center items-center flex-col bg-[#E7E7E7]">
        <div className="flex justify-center w-full ">
        <div className="w-full">
          <img
            className="relative"
            src={backgroundservice}
            alt="backgroundservice"
          />
        </div>
        <div className="flex absolute flex-col text-white left-20 top-[200px] p-4">
          <h2 className="text-[45px] mb-[8px] font-bold font tracking-wide">
            Services
          </h2>
          <Breadcrumb title={title} />
        </div>
      </div>
      <div className="flex flex-wrap w-[85%] justify-center items-center mt-20 gap-5 mb-20">
        {staff.map((employee) => (
          <div className="w-[30%] p-6 bg-white text-center leading-[50px]" key={employee._id} >
            <img className="flex w-full h-[240px] object-cover" src={employee.avatar} alt={employee.name} />
            <h2 className="text-[#00197e] text-[22px] font-semibold">{employee.name}</h2>
            <p className="text-[16px] font-light leading-[26px] text-[#3a4268]">{employee.job}</p>
          
          </div>
        ))}
      </div>
    </div>
  );
};

export default Ourteam;
