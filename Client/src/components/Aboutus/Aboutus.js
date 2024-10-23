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
    <div className="flex justify-center items-center relative ">
      <div className="absolute right-10 top-0 animatie-roll">
        <img src={starblueicon} />
      </div>
      <div className="w-[90%] flex justify-center gap-20">
        <div className="w-[50%]">
          <img className="w-full h-[550px] object-fill" src={aboutus} />
        </div>
        <div className="w-[50%] mt-10">
          <div>
            <h5 class="text-[16px] text-[#2f6eff] font-medium">ABOUT US</h5>

            <h3 class="text-[44px] text-[#00197e] font-bold">
              Making Your House Clean
            </h3>

            <div class="">
              <h3 class="text-[40px] text-[#00197e] font-bold mt-[-10px]">
                For Looks As a New <span class=""></span>
              </h3>
            </div>

            <p class="text-[16px] text-[#3a4268]">
              Competently repurpose go forward benefits without goal-oriented
              ROI conveniently target e-business opportunities whereas parallel
              task multimedia based web services
            </p>
          </div>
          <div className="w-full flex">
            <div className="w-[60%] mt-5 flex flex-col">
              <div className="text-blue-500 leading-5 font-medium text-[16px]">
                <p className="flex gap-4 items-center ">
                  <FaCheckCircle />
                  <span className="text-[#00197E]">
                    Cleeny Your Home or Office
                  </span>
                </p>
                <p className="flex gap-4 items-center mt-4">
                  <FaCheckCircle />
                  <span className="text-[#00197E]">
                    24/7 Emmergency Quality Services
                  </span>
                </p>
                <p className="flex gap-4 items-center mt-4">
                  <FaCheckCircle />
                  <span className="text-[#00197E]">
                    Online Booking System available
                  </span>
                </p>
              </div>
              <Link className="flex mt-5 gap-2 items-center p-4 bg-[#2F6EFF] text-white rounded-full text-[15px]  justify-center font-normal w-[55%] transition-all  duration-400 hover:bg-[#FFC704] hover:text-black">
                More About Us <FaArrowRightLong />
              </Link>
            </div>
            <div className="w-[35%] mt-2">
              <div className="w-[182px] h-[180px] p-8 rounded-2xl bg-[#FFC704] flex flex-col justify-center text-center">
                <img
                  className="h-[50px] object-contain mt-2"
                  src={countericon}
                />
                <span className="text-[#00197e] text-[36px] font-semibold mt-2">
                  {count} +
                </span>
                <h6 className="font-light text-[15px] text-[#3a4268] mt-2">
                  Years Experience
                </h6>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Aboutus;
