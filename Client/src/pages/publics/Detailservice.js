import React, { useEffect, useState } from "react";
import { NavLink, useParams } from "react-router-dom";
import { Breadcrumb, Frombooking } from "../../components";
import backgroundservice from "../../assets/backgroundservice.png";
import thumb from "../../assets/thumb.png";
import DOMPurify from "dompurify";
import iconphone from "../../assets/iconphone.png";
import icons from "../../ultils/icons";
import { apiGetServices, apiGetDetailsServices } from "../../apis";
const { FaArrowRightLong } = icons;

const Detailservice = ({ category }) => {
  const { sid, title } = useParams();
  const [serviceDetail, setServiceDetail] = useState(null);
  const [services, setServices] = useState([]);
  const [showForm, setShowForm] = useState(false);

  useEffect(() => {
    const fetchServices = async () => {
      try {
        const response = await apiGetServices({
          params: {
            category: category,
          },
        });
        setServices(response.service);
      } catch (err) {
        console.log(err.message);
      }
    };

    fetchServices();
  }, [category]);

  useEffect(() => {
    const fetchServiceDetail = async () => {
      try {
        const response = await apiGetDetailsServices(sid);
        setServiceDetail(response.service);
        console.log(response);
      } catch (err) {
        console.log(err.message);
      }
    };

    fetchServiceDetail();
  }, [sid, title]);

  const handleButtonClick = () => {
    setShowForm(true);
  };

  const handleCloseForm = () => {
    setShowForm(false);
  };

  const uniqueCategories = Array.from(
    new Set(services.map((service) => service.category))
  );

  return (
    <div className="flex w-full justify-center flex-col items-center relative overflow-hidden">
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
      <div className="w-[90%] flex flex-col lg:flex-row justify-center gap-8 mt-10">
     
      <div className="md:w-[33%] flex flex-col items-center">
          <div className="h-auto bg-[#F3F3F7] md:w-[90%] p-6 rounded-xl">
            <div>
              <h6 className="text-[25px] text-[#00197e] font-semibold mb-3">
                Category
              </h6>
              <div className="gap-5 flex flex-wrap">
                {uniqueCategories.map((category, idx) => (
                  <div className="relative group" key={idx}>
                    <NavLink
                      className={({ isActive }) =>
                        `p-2 text-[16px] font-normal ${
                          isActive
                            ? "text-[#00197E] bg-[#FFC703]"
                            : "text-[#00197E] bg-white hover:bg-[#FFC703] duration-300 ease-in-out"
                        }`
                      }
                      to={`/services/${
                        services.find(
                          (service) => service.category === category
                        )?._id
                      }/${category}`}>
                      {category}
                    </NavLink>

                    <span className="absolute left-0 right-0 bottom-[-5px] h-[2px] bg-[#2F6EFF] scale-x-0 transition-transform duration-500 group-hover:scale-x-100" />
                  </div>
                ))}
              </div>
            </div>
          </div>
          <div className="flex flex-col justify-center items-center mt-4 relative w-full md:w-[90%]">
            <div className="flex items-center justify-center w-full">
              <img
                className="w-full h-[400px] object-cover rounded-xl"
                src={thumb}
                alt="Thumbnail"
              />
            </div>
            <div className="flex flex-col justify-center absolute top-0 left-0 p-8">
              <div>
                <img src={iconphone} alt="phone icon" />
              </div>
              <div className="flex flex-col justify-start text-white leading-10">
                <span className="text-[18px] font-medium">Call Us Anytime</span>
                <span className="text-[24px] font-semibold">
                  +038 (6950) 752
                </span>
                <span className="text-[16px]">Toanb3074@gmail.com</span>
              </div>
              <div>
                <button
                  onClick={handleButtonClick}
                  className="p-4 bg-[#2F6EFF] text-[15px] font-normal rounded-full w-full mt-4 text-white justify-center flex items-center gap-2">
                  Book Now
                  <span>
                    <FaArrowRightLong />
                  </span>
                </button>
              </div>
            </div>
          </div>
          {showForm && (
            <div className="absolute min-h-screen bg-box inset-0 bg-overplay z-50 flex">
              <Frombooking handleCloseForm={handleCloseForm} />
            </div>
          )}
        </div>

        <div className="w-full lg:w-[60%]">
          <h1 className="text-[#00197E] text-[24px] md:text-[36px] font-bold">
            {serviceDetail?.title}
          </h1>
          <div className="mt-4 text-[14px] md:text-[16px] leading-6 md:leading-8">
            {serviceDetail?.description?.length > 1 ? (
              <span>{serviceDetail?.description}</span>
            ) : (
              <div
                dangerouslySetInnerHTML={{
                  __html: DOMPurify.sanitize(serviceDetail?.description[0]),
                }}
              />
            )}
          </div>
          <img
            className="w-full h-auto object-cover mt-6 rounded-xl"
            src={serviceDetail?.thumb}
            alt={serviceDetail?.title}
          />
        </div>
      </div>
    </div>
  );
};

export default Detailservice;
