import React from "react";
import { StepsData } from "../../ultils/contants";
import line from "../../assets/line.png";
import heroclean from "../../assets/heroclean.png";

const Stepwork = () => {
  return (
    <div className="mt-20 flex justify-center items-center flex-col">
      <div className="text-center leading-10 flex justify-center flex-col items-center">
        <h5 className="text-[#2f6eff] text-[16px] font-medium ">
          WORKING PROCESS
        </h5>
        <h3 className="text-[#00197e] text-[44px] font-bold mt-2">
          Easy Steps to Works
        </h3>
        <p className="text-[16px] font-light leading-7 text-[#3a4268] w-[65%] mt-5">
          Competently repurpose go forward benefits without goal-oriented ROI
          conveniently target e-business opportunities whereas
        </p>
      </div>

      <div className="flex justify-center items-center mt-20 relative w-[90%]">
        {StepsData.map((step, index) => (
          <div
            key={index}
            className="w-[33%] flex flex-col justify-center items-center group">
            <div className="flex flex-col justify-center items-center group w-[100%] text-center">
              <div
                className="bg-[#ffffff] h-[95px] w-[95px] rounded-2xl flex items-center justify-center relative group transition-all duration-500 transform hover:scale-100 hover:bg-blue-500"
                style={{ boxShadow: "rgba(0, 123, 255, 0.4) 0px 30px 90px" }}>
                <img
                  className="group-hover:filter group-hover:invert group-hover:brightness-0"
                  src={step.icon}
                  alt={`step ${step.stepNumber} icon`}
                />
                <div className="absolute top-[40%] right-[-10px] h-[25px] w-[25px] rounded-full bg-[#FFC704] flex items-center justify-center">
                  <h1>{step.stepNumber}</h1>
                </div>
              </div>
              <h2 className="text-[24px] text-[#00197e] font-semibold mt-3">
                {step.title}
              </h2>
              <div className="mt-4 h-[10px] w-full border-t-2 border-blue-500 transition-all duration-500 transform scale-x-50 group-hover:scale-x-100"></div>
            </div>
            <p className="text-[16px] text-[#565969] w-[70%] text-center mt-3">
              {step.description}
            </p>
            {step.linePosition && (
              <div className={`absolute w-[26%] ${step.linePosition} top-5`}>
                <img className="w-full" src={line} alt="line image" />
              </div>
            )}
          </div>
        ))}
        <div className="absolute right-[-60px] animate-bounce-up-down">
  <img src={heroclean} />
</div>

      </div>
    </div>
  );
};

export default Stepwork;
