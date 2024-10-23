import React, { useEffect, useState } from "react";
import animation from "../../assets/animation.png";
import { serviceData } from "../../ultils/contants";
import backgroundfrom from "../../assets/backgroundfrom.png";
import icons from "../../ultils/icons";
import { Link } from "react-router-dom";
import { createcounsel , apiGetServices} from "../../apis";
import axios from "axios";

const { FaCheck, FaArrowRightLong } = icons;

const Booking = ({category}) => {
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [service, setService] = useState("");

  const [services, setServices] = useState([]);
  

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!name || !phone || !service) {
      alert("Please fill in all required fields.");
      return;
    }

    try {
      const response = await createcounsel({
        name,
        mobile: phone,
        service,
      });
      setName("");
      setPhone("");
      setService("");
    } catch (error) {
      console.error("Error creating counsel:", error);
      alert("Failed to create booking. Please try again.");
    }
  };

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
    <div className="flex items-center justify-center flex-col mt-20">
      <div className="bg-[#00187E] w-full h-[1100px] flex relative justify-center flex-col items-center">
        <div className="marquee-block flex absolute top-[-13px]">
          <img className="animation-image" src={animation} />
          <img className="animation-image" src={animation} />
        </div>
        <div className="w-[70%] animate-zoom-background top-0 absolute">
          <img className="" src={backgroundfrom} />
        </div>
        <div className="w-full justify-center flex items-center absolute flex-col top-20">
          <h3 className="text-[44px] font-bold text-white">
            Send Free Consultation
          </h3>
          <form
            onSubmit={handleSubmit}
            className="w-full gap-5 flex justify-center mt-10">
            <input
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="p-4 w-[21%] placeholder:text-gray-500 placeholder:text-[14px] rounded-lg border border-gray-300 focus:outline-none focus:border-transparent focus:ring-0"
              placeholder="Your Name*"
            />
            <input
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              className="p-4 w-[21%] placeholder:text-gray-500 placeholder:text-[14px] rounded-lg border border-gray-300 focus:outline-none focus:border-transparent focus:ring-0"
              placeholder="Phone No.*"
            />
            <select
                id="options"
                value={service}
                onChange={(e) => setService(e.target.value)}
                className="p-4 w-[21%] rounded-lg border border-gray-300 text-[14px] text-gray-500">
                <option value="">Select Service</option>
                {services.map((serviceItem) => (
                  <option key={serviceItem._id} value={serviceItem.title}>
                    {serviceItem.title}
                  </option>
                ))}
              </select>
            <button
              type="submit"
              className="p-4 w-[21%] rounded-lg bg-[#FFC704] transition-all duration-300 hover:bg-blue-500 hover:text-white">
              Send Consultation
            </button>
          </form>
        </div>
        <div className="flex w-full justify-center items-center flex-col absolute top-[20%] mt-20">
          <h5 className="text-[#FFC704]">OUR SERVICES</h5>
          <h3 className="text-[44px] font-bold text-white">
            Professional Cleaning Services
          </h3>
          <div className="flex justify-center items-center gap-10 w-[90%] p-5 mt-10">
            {serviceData.map(({ id, imgSrc, iconSrc, title, details }) => (
              <div key={id} className="flex relative flex-col">
                <img src={imgSrc} alt={title} />
                <div className="absolute top-[75%] bg-white p-4 z-50 rounded-full left-7">
                  <img
                    className="object-contain h-[40px]"
                    src={iconSrc}
                    alt="Icon"
                  />
                </div>
                <div
                  className="flex flex-col w-[90%] p-[45px] absolute top-[230px] rounded-tr-lg rounded-br-lg z-0"
                  onMouseEnter={(e) => {
                    e.currentTarget.style.background =
                      "linear-gradient(to right, #0A2A99, #2f6eff)";
                    e.currentTarget.style.backgroundPosition = "0 0";
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.background = "#0A2A99";
                    e.currentTarget.style.backgroundPosition = "100% 0";
                  }}>
                  <h3 className="text-white text-[24px] font-semibold mt-2">
                    {title}
                  </h3>
                  {details.map((detail, index) => (
                    <div
                      key={index}
                      className="flex items-center gap-2 mt-5 mb-3 text-[16px]">
                      <span className="text-[#FFC704]">
                        <FaCheck />
                      </span>
                      <span className="text-[#B8B9D5]">{detail}</span>
                    </div>
                  ))}
                  <hr />
                  <Link className="flex items-center gap-3 mt-5 text-white text-[16px] font-medium">
                    View Details{" "}
                    <span>
                      <FaArrowRightLong />
                    </span>
                  </Link>
                </div>
              </div>
            ))}
          </div>
        </div>
        <div className="marquee-block flex absolute bottom-[-13px]">
          <img className="animation-image" src={animation} />
          <img className="animation-image" src={animation} />
        </div>
      </div>
    </div>
  );
};

export default Booking;
