import React, { useState, useEffect } from "react";
import { NavLink, useParams } from "react-router-dom";
import { Breadcrumb, Frombookingplan } from "../../components";
import backgroundservice from "../../assets/backgroundservice.png";
import thumb from "../../assets/thumb.png";
import DOMPurify from "dompurify";
import iconphone from "../../assets/iconphone.png";
import icons from "../../ultils/icons";
import { apiGetServicesplan, apiGetDetailsServicesplan } from "../../apis";
const { FaArrowRightLong } = icons;

const Detailservice = ({ category }) => {
  const { sid, title } = useParams();
  const [serviceDetail, setServiceDetail] = useState(null);
  const [services, setServices] = useState([]);
  const [showForm, setShowForm] = useState(false);

  useEffect(() => {
    const fetchServices = async () => {
      try {
        const response = await apiGetServicesplan({
          params: {
            category: category,
          },
        });
        setServices(response.service);
        console.log(response.service);
      } catch (err) {
        console.log(err.message);
      }
    };

    fetchServices();
  }, [category]);

  useEffect(() => {
    const fetchServiceDetail = async () => {
      try {
        const response = await apiGetDetailsServicesplan(sid);
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
      <div className="flex justify-center w-full relative">
        <div className="w-full">
          <img src={backgroundservice} alt="backgroundservice" />
        </div>
        <div className="flex absolute flex-col text-white left-20 top-[70px] p-4">
          <h2 className="text-[45px] mb-[8px] font-bold tracking-wide">Services</h2>
          <Breadcrumb title={title} />
        </div>
      </div>
      <div className="w-[90%] flex justify-center gap-8 mt-20">
        <div className="w-[33%] flex flex-col items-center">
          <div className="h-auto bg-[#F3F3F7] w-[90%] p-6 rounded-xl">
            <div>
              <h6 className="text-[25px] text-[#00197e] font-semibold mb-3">Category</h6>
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
                      to={`/servicesplan/${services.find(
                        (service) => service.category === category
                      )?._id}/${category}`}
                    >
                      {category}
                    </NavLink>
                    <span className="absolute left-0 right-0 bottom-[-5px] h-[2px] bg-[#2F6EFF] scale-x-0 transition-transform duration-500 group-hover:scale-x-100" />
                  </div>
                ))}
              </div>
            </div>
          </div>
          <div className="flex flex-col justify-center items-center mt-4 relative">
            <div className="flex items-center justify-center w-full">
              <img className="w-full h-[400px] object-cover rounded-xl" src={thumb} alt="Thumbnail" />
            </div>
            <div className="flex flex-col justify-center absolute top-0 left-0 p-8">
              <div>
                <img src={iconphone} alt="phone icon" />
              </div>
              <div className="flex flex-col justify-start text-white leading-10">
                <span className="text-[18px] font-medium">Call Us Anytime</span>
                <span className="text-[24px] font-semibold">+038 (6950) 752</span>
                <span className="text-[16px]">Toanb3074@gmail.com</span>
              </div>
              <div>
                <button
                  onClick={handleButtonClick}
                  className="p-4 bg-[#2F6EFF] text-[15px] font-normal rounded-full w-full mt-4 text-white justify-center flex items-center gap-2"
                >
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
              <Frombookingplan handleCloseForm={handleCloseForm} />
            </div>
          )}
        </div>

        <div className="w-[60%]">
          <div>
            <h1 className="text-[#00197E] text-[36px] font-bold">{serviceDetail?.title}</h1>
          </div>
          <div>
            {serviceDetail?.description?.length > 1 ? (
              <span className="flex leading-8 mt-4 flex-col">
                {serviceDetail?.description}
              </span>
            ) : (
              <div
                className="flex leading-8 mt-4 flex-col"
                dangerouslySetInnerHTML={{
                  __html: DOMPurify.sanitize(serviceDetail?.description[0]),
                }}
              ></div>
            )}
          </div>

          <div className="w-full mt-[20px]">
            <img className="w-full object-cover h-auto" src={serviceDetail?.thumb} alt={serviceDetail?.title} />
          </div>
        </div>
      </div>
    </div>
  );
};

export default Detailservice;