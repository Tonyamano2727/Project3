import React from "react";
import banner from "../../assets/banner.png";
import hero from "../../assets/hero.png";
import star from "../../assets/star.png";
import star2 from "../../assets/star2.png";
import icons from "../../ultils/icons";

const { FaArrowRightLong } = icons;

const Banner = () => {
  return (
    <div className="relative flex flex-col md:flex-row">
      <img className="w-full relative object-cover h-[300px] lg:h-auto" src={banner} alt="banner" />

      <img
        className="absolute top-[60px] left-[80%] lg:left-[70%] transform -translate-x-1/2 h-[130px] md:h-[580px] object-contain"
        src={hero}
        alt="hero"
      />

      <img
        className="absolute top-[40px] right-[2%] md:top-[60px] md:right-[10%] h-[50px] md:h-[80px] object-contain animate-zoom"
        src={star}
        alt="star"
      />

      <img
        className="absolute  left-[70%] top-10 lg:left-[50%] transform -translate-x-1/2 h-[30px] md:h-[50px] object-contain animate-roll"
        src={star2}
        alt="star2"
      />

      <div className="absolute top-[40px] md:top-[140px] w-[60%] md:w-[48%] left-[5%] md:left-[8%] p-2">
        <h4 className="text-[10px] md:text-[18px] text-[#ffc804] font-medium">
          BEST CLEENY AGENCY
        </h4>
        <h1 className="text-[16px] md:text-[60px] text-white font-bold leading-tight">
          <span>NEED CLEANING? CALL </span>
          <span className="text-[#ffc804]">US TODAY</span>
        </h1>
        <p className="w-full md:w-[70%] text-[#CFD3ED] text-[14px] md:text-[16px] mt-4">
          Need Clean of your home or office? Just Feel Free to Contact us. We
          try to Help you as soon as possible.
        </p>
        <div>
          <button className="text-[14px] lg:text-[18px]    mt-4 lg:mt-8 flex items-center gap-2 rounded-full px-6 py-3 md:p-4 text-white bg-[#2F6EFF] transition-colors duration-300 ease-in-out hover:bg-[#1E4EB8] hover:shadow-lg">
            Get Started Now <FaArrowRightLong />
          </button>
        </div>
      </div>
    </div>
  );
};

export default Banner;
