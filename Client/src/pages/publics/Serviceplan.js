import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { apiGetServicesplan } from "../../apis";  
import icons from "../../ultils/icons";
import { Icon } from "../../ultils/contants";
import backgroundservice from "../../assets/backgroundservice.png";

const { FaArrowRightLong } = icons;

const Serviceplan = () => {
  const [services, setServices] = useState([]);  
  const [loading, setLoading] = useState(true); 
  const [error, setError] = useState(null);  

  useEffect(() => {
    
    const fetchServices = async () => {
      try {
        const response = await apiGetServicesplan();  
        if (response.success) {
          setServices(response.service);  
          console.log(response.service);
          
        }
      } catch (err) {
        setError(err.message); 
      } finally {
        setLoading(false);  
      }
    };

    fetchServices();
  }, []); 

  return (
    <div className="w-full justify-center items-center flex flex-col bg-[#F3F3F7]">
      <div className="flex justify-center w-full">
        <div className="w-full">
          <img className="relative" src={backgroundservice} alt="backgroundservice" />
        </div>
        <div className="flex absolute flex-col text-white left-20 top-[200px] p-4">
          <h2 className="text-[45px] mb-[8px] font-bold tracking-wide">Services</h2>
        </div>
      </div>
      <div className="flex justify-center gap-5 items-center mt-28 w-[90%]">
        <div className="flex flex-col w-[50%]">
          <h5 className="text-[16px] text-[#2f6eff] font-medium mb-[10px]">OUR SERVICES</h5>
          <h3 className="text-[44px] text-[#00197e] font-bold leading-[55px]">
            Professional Clean Service What we Provide
          </h3>
        </div>
        <div className="w-[40%]">
          <p className="text-16px text-[#3A4268] font-normal leading-[26px]">
            Competently repurpose go forward benefits without goal-orien
            conveniently target e-business opportunities whereas parallel
            multimedia based web services.
          </p>
        </div>
      </div>
      <div className="flex flex-wrap gap-5 w-[90%] justify-center mt-10">
        {services.map((service, index) => (
          <div key={service._id} className="w-[30%] flex flex-col mb-5">
            <div className="w-full relative">
              <div className="absolute z-50 top-[250px] w-full">
                <h3 className="text-xl w-[70%] bg-[#F3F3F7] text-[#00197e] text-[22px] rounded-tr-xl p-5 font-semibold">
                  {service.title}
                </h3>
              </div>
              <img
                src={service.thumb}
                alt={service.title}
                className="w-full h-[300px] object-cover rounded-tl-xl rounded-tr-xl"
              />
              <div className="w-full bg-white p-8 rounded-bl-xl rounded-br-xl">
                <Link
                  className="w-full text-[#273689] text-[16px] font-medium flex items-center justify-between"
                  to={`/servicesplan/${service._id}/${service.title}`}  // Dẫn đến chi tiết dịch vụ
                >
                  <div className="flex gap-2 items-center">
                    {Icon[index % Icon.length].title}
                    <span><FaArrowRightLong /></span>
                  </div>
                  <img
                    src={Icon[index % Icon.length].imageSrc}
                    alt={`Icon ${Icon[index % Icon.length].title}`}
                    className="h-10 w-10 object-cover mr-2"
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

export default Serviceplan;
