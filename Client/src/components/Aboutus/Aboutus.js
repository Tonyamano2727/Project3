import React, { useState, useEffect } from "react";
import aboutus from "../../assets/aboutus.png";
import starblueicon from "../../assets/starblueicon.png";
import countericon from "../../assets/countericon.png";
import icons from "../../ultils/icons";
import { Link } from "react-router-dom";

const { FaCheckCircle, FaArrowRightLong } = icons;

const Aboutus = () => {
  const [count, setCount] = useState(1);

  useEffect(() => {
    if (count < 12) {
      const timer = setTimeout(() => setCount(count + 1), 100);
      return () => clearTimeout(timer);
    }
  }, [count]);

  return (
    <div className="flex flex-col lg:flex-row justify-center items-center relative px-5">
      <div className="absolute right-10 top-0 animatie-roll hidden lg:block">
        <img src={starblueicon} />
      </div>
      <div className="w-full lg:w-[45%] mb-10 lg:mb-0">
        <img
          className="w-full h-auto lg:h-[550px] object-cover"
          src={aboutus}
        />
      </div>
      <div className="w-full lg:w-[50%] lg:pl-10">
        <div className="mb-5">
          <h5 className="text-[14px] lg:text-[16px] text-[#2f6eff] font-medium">
            ABOUT US
          </h5>
          <h3 className="text-[30px] lg:text-[44px] text-[#00197e] font-bold">
            Making Your House Clean
          </h3>
          <h3 className="text-[28px] lg:text-[40px] text-[#00197e] font-bold mt-[-5px]">
            For Looks As a New
          </h3>
          <p className="text-[14px] lg:text-[16px] text-[#3a4268] mt-4">
            Competently repurpose go forward benefits without goal-oriented ROI
            conveniently target e-business opportunities whereas parallel task
            multimedia-based web services.
          </p>
        </div>
        <div className="flex flex-col lg:flex-row lg:items-start gap-5">
          <div className="flex-1">
            <div className="text-blue-500 leading-5 font-medium text-[14px] lg:text-[16px]">
              <p className="flex gap-4 items-center">
                <FaCheckCircle />
                <span className="text-[#00197E]">Clean Your Home or Office</span>
              </p>
              <p className="flex gap-4 items-center mt-4">
                <FaCheckCircle />
                <span className="text-[#00197E]">
                  24/7 Emergency Quality Services
                </span>
              </p>
              <p className="flex gap-4 items-center mt-4">
                <FaCheckCircle />
                <span className="text-[#00197E]">
                  Online Booking System Available
                </span>
              </p>
            </div>
            <Link className="flex mt-5 gap-2 items-center p-3 lg:p-4 bg-[#2F6EFF] text-white rounded-full text-[14px] lg:text-[15px] justify-center font-normal w-[60%] lg:w-[55%] transition-all duration-400 hover:bg-[#FFC704] hover:text-black">
              More About Us <FaArrowRightLong />
            </Link>
          </div>
          <div className="flex justify-center items-center lg:justify-start">
            <div className="w-[150px] lg:w-[182px] h-[150px] lg:h-[180px] p-6 lg:p-8 rounded-2xl bg-[#FFC704] flex flex-col justify-center text-center">
              <img
                className="h-[40px] lg:h-[50px] object-contain mt-2"
                src={countericon}
              />
              <span className="text-[#00197e] text-[28px] lg:text-[36px] font-semibold mt-2">
                {count} +
              </span>
              <h6 className="font-light text-[14px] lg:text-[15px] text-[#3a4268] mt-2">
                Years Experience
              </h6>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Aboutus;
