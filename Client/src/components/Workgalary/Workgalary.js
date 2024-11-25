import React, { useEffect, useState } from "react";
import axios from "axios";
import Slider from "react-slick";
import animation2 from "../../assets/animation2.png";
import animation3 from "../../assets/animation3.png";
import bgherocontact from "../../assets/bgherocontact.png";
import hero2 from "../../assets/hero2.png";
import { Link } from "react-router-dom";
import icons from "../../ultils/icons";
import { formatMoney } from "../../ultils/helper";
import { apiGetServices } from "../../apis";

const { FaArrowRightLong } = icons;

const settings = {
  arrows: false,
  dots: true,
  infinite: true,
  speed: 500,
  slidesToShow: 3,
  slidesToScroll: 1,
  autoplay: true,
  autoplaySpeed: 7000,
};

const Workgalary = ({ category }) => {
  const [services, setServices] = useState([]);

  useEffect(() => {
    const fetchServices = async (params) => {
      try {
        const response = await apiGetServices({
          ...params,
          limit: process.env.REACT_APP_PRODUCT_LIMIT,
        });
        setServices(response.service);
        console.log(response.service);
      } catch (err) {
        console.log(err.message);
      } finally {
        console.log(false);
      }
    };

    fetchServices();
  }, [category]);

  return (
    <div className="flex justify-center items-center flex-col mt-20">
      <div className="bg-[#F3F3F7] w-full h-[850px] flex relative flex-col items-center">
        <div className="marquee-block flex absolute top-[-13px]">
          <img className="animation-image" src={animation2} />
          <img className="animation-image" src={animation2} />
        </div>
        <div className="flex justify-between items-center mt-20 w-[90%]">
          <div className="flex flex-col">
            <h5 className="text-[16px] text-[#2f6eff] font-medium">
              CLEENY PORTFOLIO
            </h5>
            <h3 className="text-[44px] text-[#00197e] font-bold w-[60%]">
              Latest cleeny Portfolio from Work Galary
            </h3>
          </div>
          <div className="flex text-center bg-[#FFC703] rounded-full p-4 w-[15%] justify-center">
            <Link className="text-[15px] font-medium flex items-center gap-2">
              View All Work
              <span>
                <FaArrowRightLong />
              </span>
            </Link>
          </div>
        </div>
        <div className="flex justify-center items-center w-full mt-16 p-3">
          <Slider
            {...settings}
            className="w-full justify-center items-center flex">
            {services.map((service) => (
              <div
                key={service._id}
                className="relative w-full h-[300px] justify-center items-center flex mb-10">
                <div className="h-full w-[100%] flex justify-center items-center">
                  <img
                    className="h-full w-[95%] object-cover"
                    src={service.thumb}
                    alt={service.title}
                  />
                </div>
                <Link
                  to={`/services/${service._id}/${service.title}`}
                  className="w-[70%] flex flex-col absolute bottom-0 left-3">
                  <div className="w-full rounded-tl-xl rounded-tr-xl p-6 bg-[#2F6EFF]">
                    <div className="text-white flex flex-col">
                      <span className="text-[14px] font-normal">
                        <span>Price : </span>
                        <span>{`${formatMoney(service?.price)} VNĐ `}</span>
                      </span>
                      <span className="mt-2 text-[24px] font-semibold">
                        {service.title}
                      </span>
                    </div>
                  </div>
                  <div className="h-[3px] bg-[#FFC704] w-full"></div>
                  <div className="w-[45px] h-[45px] flex items-center bg-[#FFC704] p-4 rounded-full absolute right-[-20px] top-10">
                    <FaArrowRightLong className="text-white" />
                  </div>
                </Link>
              </div>
            ))}
          </Slider>
        </div>
        <div className="flex mt-20 relative w-[85%] justify-center z-50">
          <div>
            <img src={bgherocontact} />
          </div>
          <div className="flex w-[10%] left-[47%] absolute top-[-50px]">
            <img className="h-[250px] object-contain" src={hero2} />
          </div>
          <div className="absolute flex justify-between top-12 items-center w-[90%]">
            <div className="flex flex-col justify-start w-[45%]">
              <h3 className="text-[35px] text-white font-bold">
                Please Call Us to Take the
              </h3>
              <h3 className="text-[35px] text-white font-bold">
                Extraordinary Service!
              </h3>
            </div>

            <div className="w-[35%] justify-end flex">
              <div className="w-[60%] bg-[#FFC703] p-4 rounded-full text-center">
                <span className="font-normal text-[15px] ">
                  Call : 038 (6950) 752
                </span>
              </div>
            </div>
          </div>
        </div>
        <div className="marquee-block flex absolute bottom-[-13px] z-0">
          <img className="animation-image" src={animation3} />
          <img className="animation-image" src={animation3} />
        </div>
      </div>
    </div>
  );
};

export default Workgalary;
