import React, { useEffect, useState } from "react";
import animation from "../../assets/animation.png";
import { serviceData } from "../../ultils/contants";
import backgroundfrom from "../../assets/backgroundfrom.png";
import icons from "../../ultils/icons";
import { Link } from "react-router-dom";
import { createcounsel, apiGetServices } from "../../apis";

const { FaCheck, FaArrowRightLong } = icons;

const Booking = ({ category }) => {
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
      await createcounsel({
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
      } catch (err) {
        console.error(err.message);
      }
    };

    fetchServices();
  }, [category]);

  return (
    <div className="flex flex-col items-center justify-center mt-20">
      <div className="bg-[#00187E] w-full flex flex-col relative items-center py-20">
        <div className="marquee-block flex absolute top-[-13px]">
          <img className="animation-image" src={animation} alt="Animation" />
          <img className="animation-image" src={animation} alt="Animation" />
        </div>

        <div className="w-full lg:w-[70%] animate-zoom-background top-0 absolute">
          <img src={backgroundfrom} alt="Background" />
        </div>

        <div className="w-full flex flex-col items-center relative z-10 mt-10">
          <h3 className="text-[28px] lg:text-[44px] font-bold text-white">
            Send Free Consultation
          </h3>
          <form
            onSubmit={handleSubmit}
            className="w-full flex flex-col lg:flex-row items-center justify-center gap-5 mt-8 px-5">
            <input
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="p-3 lg:p-4 w-full lg:w-[21%] placeholder:text-gray-500 text-[14px] rounded-lg border border-gray-300 focus:outline-none"
              placeholder="Your Name*"
            />
            <input
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              className="p-3 lg:p-4 w-full lg:w-[21%] placeholder:text-gray-500 text-[14px] rounded-lg border border-gray-300 focus:outline-none"
              placeholder="Phone No.*"
            />
            <select
              value={service}
              onChange={(e) => setService(e.target.value)}
              className="p-3 lg:p-4 w-full lg:w-[21%] text-[14px] rounded-lg border border-gray-300 text-gray-500">
              <option value="">Select Service</option>
              {services.map((serviceItem) => (
                <option key={serviceItem._id} value={serviceItem.title}>
                  {serviceItem.title}
                </option>
              ))}
            </select>
            <button
              type="submit"
              className="p-3 lg:p-4 w-full lg:w-[21%] rounded-lg bg-[#FFC704] transition-all duration-300 hover:bg-blue-500 hover:text-white">
              Send Consultation
            </button>
          </form>
        </div>

        <div className="w-full flex flex-col items-center mt-20 px-5">
          <h5 className="text-[#FFC704] text-center">OUR SERVICES</h5>
          <h3 className="text-[28px] lg:text-[44px] font-bold text-white text-center mt-3">
            Professional Cleaning Services
          </h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-10 w-full max-w-[1200px] mt-10">
            {serviceData.map(({ id, imgSrc, iconSrc, title, details }) => (
              <div key={id} className="relative flex flex-col items-center">
                <img src={imgSrc} alt={title} className="w-full rounded-lg" />
                <div className="absolute top-[75%] bg-white p-4 rounded-full shadow-lg left-5">
                  <img
                    className="h-[40px] object-contain"
                    src={iconSrc}
                    alt="Icon"
                  />
                </div>
                <div className="flex flex-col w-full p-6 bg-[#0A2A99] rounded-br-lg rounded-tr-lg mt-[-30px] z-10 transition-all hover:scale-105">
                  <h3 className="text-white text-[20px] lg:text-[24px] font-semibold">
                    {title}
                  </h3>
                  {details.map((detail, index) => (
                    <div
                      key={index}
                      className="flex items-center gap-2 mt-4 text-[14px] lg:text-[16px]">
                      <span className="text-[#FFC704]">
                        <FaCheck />
                      </span>
                      <span className="text-[#B8B9D5]">{detail}</span>
                    </div>
                  ))}
                  <hr className="my-4" />
                  <Link className="flex items-center gap-3 text-white text-[14px] lg:text-[16px] font-medium">
                    View Details <FaArrowRightLong />
                  </Link>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="marquee-block flex absolute bottom-[-13px]">
          <img className="animation-image" src={animation} alt="Animation" />
          <img className="animation-image" src={animation} alt="Animation" />
        </div>
      </div>
    </div>
  );
};

export default Booking;
