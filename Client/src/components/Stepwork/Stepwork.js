import React from "react";
import { StepsData } from "../../ultils/contants";
import line from "../../assets/line.png";
import heroclean from "../../assets/heroclean.png";

const Stepwork = () => {
  return (
    <div className="mt-20 flex flex-col items-center">
      <div className="text-center leading-10 flex flex-col items-center px-5">
        <h5 className="text-[#2f6eff] text-[16px] font-medium">WORKING PROCESS</h5>
        <h3 className="text-[#00197e] text-[28px] lg:text-[44px] font-bold mt-2">
          Easy Steps to Works
        </h3>
        <p className="text-[14px] lg:text-[16px] font-light leading-7 text-[#3a4268] max-w-[700px] mt-5">
          Competently repurpose go forward benefits without goal-oriented ROI
          conveniently target e-business opportunities whereas
        </p>
      </div>

     
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-10 mt-20 relative w-full px-5 max-w-[1200px]">
        {StepsData.map((step, index) => (
          <div
            key={index}
            className="flex flex-col items-center group relative text-center">
           
            <div
              className="bg-[#ffffff] h-[80px] w-[80px] lg:h-[95px] lg:w-[95px] rounded-2xl flex items-center justify-center relative group transition-all duration-500 transform hover:scale-110 hover:bg-blue-500"
              style={{ boxShadow: "rgba(0, 123, 255, 0.4) 0px 30px 90px" }}>
              <img
                className="group-hover:filter group-hover:invert group-hover:brightness-0"
                src={step.icon}
                alt={`step ${step.stepNumber} icon`}
              />
              <div className="absolute top-[40%] right-[-10px] h-[20px] lg:h-[25px] w-[20px] lg:w-[25px] rounded-full bg-[#FFC704] flex items-center justify-center">
                <h1 className="text-[12px] lg:text-[14px] font-bold">{step.stepNumber}</h1>
              </div>
            </div>

          
            <h2 className="text-[18px] lg:text-[24px] text-[#00197e] font-semibold mt-3">
              {step.title}
            </h2>

           
            <div className="mt-4 h-[5px] lg:h-[10px] w-full border-t-2 border-blue-500 transition-all duration-500 transform scale-x-50 group-hover:scale-x-100"></div>

           
            <p className="text-[14px] lg:text-[16px] text-[#565969] w-full lg:w-[70%] mt-3">
              {step.description}
            </p>

            
            {step.linePosition && (
              <div className={`absolute w-[20%] lg:w-[26%] ${step.linePosition} top-5`}>
                <img className="w-full" src={line} alt="line" />
              </div>
            )}
          </div>
        ))}

      
        <div className="absolute hidden lg:block right-[-60px] animate-bounce-up-down">
          <img src={heroclean} alt="Hero Clean" />
        </div>
      </div>
    </div>
  );
};

export default Stepwork;
