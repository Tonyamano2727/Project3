import React from "react";
import banner from "../../assets/banner.png";
import hero from "../../assets/hero.png";
import star from "../../assets/star.png";
import star2 from "../../assets/star2.png";
import icons from "../../ultils/icons";

const { FaArrowRightLong } = icons;

const Banner = () => {
  return (
    <div className='flex relative'>
      <img className="relative" src={banner}></img>
      <img
        className="absolute top-[60px] h-[580px] left-[50%] object-contain"
        src={hero}
      />
      <img
        className="absolute top-[60px] h-[80px] left-[80%] object-contain animate-zoom"
        src={star}
      />
      <img
        className="absolute top-[550px] h-[50px] left-[48%] object-contain animatie-roll"
        src={star2}
      />

      <div className="absolute top-[140px] w-[48%] left-[8%] p-2">
        <h4 className="text-[18px] text-[#ffc804] font-medium">
          {" "}
          BEST CLEENY AGENCY{" "}
        </h4>
        <h1 className="text-[60px] text-white font-bold">
          <span>NEED CLEANING? CALL </span>
          <span></span>
          <span className="text-[#ffc804]">US TODAY</span>
        </h1>
        <p className="w-[70%] text-[#CFD3ED]">
          Need Clean of your home or office? Just Feel Free to Contact us. We
          try to Help you as soon as possible.
        </p>
        <div>
          <button className="mt-10 flex items-center gap-2 rounded-full px-6 text-white bg-[#2F6EFF] p-4 transition-colors duration-300 ease-in-out hover:bg-[#1E4EB8] hover:shadow-lg">
            Get Started Now <FaArrowRightLong />
          </button>
        </div>
      </div>
    </div>
  );
};

export default Banner;
