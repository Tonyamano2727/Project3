import React, { useEffect, useState } from "react";
import { Breadcrumb } from "../../components";
import axios from "axios";
import { Link } from "react-router-dom";
import icons from "../../ultils/icons";
import { Icon } from "../../ultils/contants";
import backgroundservice from "../../assets/backgroundservice.png";

const { FaArrowRightLong } = icons;

const Service = ({ title, category }) => {
  const [services, setServices] = useState([]);
  useEffect(() => {
    const fetchServices = async () => {
      try {
        const response = await axios.get("http://localhost:5000/api/service/", {
          params: {
            category: category,
            page: 1,
            limit: 10,
          },
        });
        setServices(response.data.service);
      } catch (err) {
        console.log(err.message);
      } finally {
        console.log(false);
      }
    };

    fetchServices();
  }, [category]);
  return (
    <div className="w-full justify-center items-center flex flex-col bg-[white]">
      <div className="w-full relative flex justify-center items-center flex-col bg-[#E7E7E7]">
        <img
          className="w-full object-cover h-[200px] md:h-[350px]"
          src={backgroundservice}
          alt="backgroundservice"
        />
        <div className="absolute text-white flex flex-col items-center md:items-start md:left-20 p-4">
          <h2 className="text-[24px] md:text-[45px] font-bold tracking-wide">
            Services
          </h2>
          <Breadcrumb title={title} />
        </div>
      </div>

      <div className="flex flex-col md:flex-row justify-center gap-5 items-center mt-10 w-[90%]">
        <div className="flex flex-col w-full md:w-[50%] text-center md:text-left">
          <h5 className="text-[16px] text-[#2f6eff] font-medium mb-[10px]">
            OUR SERVICES
          </h5>
          <h3 className="text-[24px] md:text-[44px] text-[#00197e] font-bold leading-[30px] md:leading-[55px]">
            Professional Clean Service What we Provide
          </h3>
        </div>
        <div className="w-full md:w-[40%]">
          <p className="text-[14px] text-center md:text-start md:text-[16px] text-[#3A4268] font-normal leading-[22px] md:leading-[26px]">
            Competently repurpose go forward benefits without goal-oriented
            conveniently target e-business opportunities whereas parallel
            multimedia based web services.
          </p>
        </div>
      </div>
      <div className="flex flex-wrap gap-5 w-[90%] justify-center mt-10">
        {services.map((service, index) => (
          <div
            key={service._id}
            className="w-full sm:w-[48%] lg:w-[30%] flex flex-col mb-5">
            <div className="w-full relative">
              <div className="absolute z-50 top-[200px] md:top-[250px] w-full">
                <h3 className="xl:text-[18px] md:text-[15px] bg-[#F3F3F7] text-[#00197e] rounded-tr-xl p-5 font-semibold">
                  {service.title}
                </h3>
              </div>
              <img
                src={service.thumb}
                alt={service.title}
                className="w-full h-[200px] md:h-[300px] object-cover rounded-tl-xl rounded-tr-xl"
              />
              <div className="w-full bg-[#E7E7E7] p-6 md:p-8 rounded-bl-xl rounded-br-xl h-[130px] md:h-[85px]">
                <Link
                  className="w-full text-[#273689] text-[14px] lg:mt-0 mt-[50px] md:mt-[0px] md:text-[16px] font-medium flex items-center justify-between z-50"
                  to={`/services/${service._id}/${service.title}`}>
                  <div className="flex gap-2 items-center">
                    {Icon[index % Icon.length].title}
                    <FaArrowRightLong />
                  </div>
                  <img
                    src={Icon[index % Icon.length].imageSrc}
                    alt={`Icon ${Icon[index % Icon.length].title}`}
                    className="h-8 w-8 md:h-10 md:w-10 object-cover mr-2"
                  />
                </Link>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Service;
