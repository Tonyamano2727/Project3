import React, { useEffect, useState } from "react";
import { Breadcrumb } from "../../components";
import backgroundservice from "../../assets/backgroundservice.png";
import contactbg from "../../assets/contactbg.png";
import { createcounsel } from "../../apis";
import axios from "axios";

const FQA = ({ title }, { category }) => {
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
    const fetchServices = async () => {
      try {
        const response = await axios.get("http://localhost:5000/api/service/", {
          params: {
            category: category,
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
    <div className="w-full flex items-center justify-center flex-col">
      <div className="flex justify-center w-full ">
        <div className="w-full  ">
          <img
            className="relative"
            src={backgroundservice}
            alt="backgroundservice"
          />
        </div>
        <div className="flex absolute flex-col text-white left-20 top-[200px] p-4">
          <h2 className="text-[45px] mb-[8px] font-bold font tracking-wide">
            Contact
          </h2>
          <Breadcrumb title={title} />
        </div>
      </div>
      <div className="flex items-center justify-center w-full">
        <div className="flex ">
          <div className="w-full relative">
            <img src={contactbg} />
          </div>
          <div className="flex absolute w-[50%] left-[50%] flex-col">
            <div className="flex flex-col mt-20"> 
              <h3 className="text-[35px] leading-[55px] font-bold text-[#00197e]">
                CONTACT WITH US
              </h3>
            </div>
            <form
              onSubmit={handleSubmit}
              className="w-full gap-5 flex flex-col flex-wrap justify-center mt-5">
              <div className="flex flex-wrap gap-3 w-full">
                <input
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="p-4 w-[48%] placeholder:text-gray-500 placeholder:text-[14px] rounded-lg border border-gray-300 "
                  placeholder="Your Name*"
                />
                <input
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  className="p-4 w-[48%] placeholder:text-gray-500 placeholder:text-[14px] rounded-lg border border-gray-300 "
                  placeholder="Phone No.*"
                />
              </div>
              <select
                id="options"
                value={service}
                onChange={(e) => setService(e.target.value)}
                className="p-4 w-[98%] rounded-lg border border-gray-300 text-[14px] text-gray-500">
                <option value="">Select Service</option>
                {services.map((serviceItem) => (
                  <option key={serviceItem._id} value={serviceItem.title}>
                    {serviceItem.title}
                  </option>
                ))}
              </select>
              <button
                type="submit"
                className="p-4 w-[98%] rounded-lg bg-[#FFC704] transition-all duration-300 hover:bg-blue-500 hover:text-white">
                Send Consultation
              </button>
            </form>
          </div>
        </div>
      </div>
      
      <div className="w-full lg:w-main flex leading-7 text-[15px] flex-wrap"></div>
    </div>
  );
};

export default FQA;
