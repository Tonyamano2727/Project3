import React from "react";
import icons from "../../ultils/icons";
import backgroundfooter from "../../assets/backgroundfooter.png";
import logofooter from "../../assets/logofooter.png";
import { Link } from "react-router-dom";
import workgalary from "../../assets/workgalary.png";
import footershape1 from "../../assets/footer-shape.png";
import footershape2 from "../../assets/footer-shape1.png";
import { TfiEmail } from "react-icons/tfi";

const { MdPhone, FaFacebook, FaTelegram, FaInstagram, IoIosArrowForward , AiOutlineEnvironment} =
  icons;
const Footer = () => {
  return (
    <div className="w-full flex items-center justify-center bg-[#00197D] flex-col relative z-0 mt-[150px]">
      <div className="absolute top-0 w-[90%]">
        <img className="w-full" src={backgroundfooter} />
      </div>
      <div className='absolute left-[-50px] top-20 animate-zoom-background'>
      <img src={footershape1} />
      </div>
      <div className='absolute right-[-50px] top-20 animate-zoom-background'>
      <img src={footershape2} />
      </div>
      <div className="z-50 w-[90%] flex justify-center items-center mt-8">
        <div className="flex justify-start items-center w-[40%] gap-5">
          <div className="h-[60px] w-[60px] rounded-full bg-white flex justify-center items-center text-[22px] text-[#2f6eff]">
            <MdPhone />
          </div>
          <div>
            <h4 className="text-[15px] text-[#00197e] font-light mb-1 leading-[30px]">
              Call Us Now
            </h4>
            <p className="text-[22px] text-[#00197e] font-semibold leading-[28px]">
              +980 765 (546) 900
            </p>
          </div>
        </div>
        <div className="flex justify-start items-center gap-10 w-[55%]">
          <h2 className="text-[27px] font-semibold text-white w-[35%]">
            Subscribe Now
          </h2>
          <div className="flex w-[65%]">
            <input
              className="p-3 w-[90%] rounded-tl-lg rounded-bl-lg placeholder:text-[14px] placeholder:pl-[10px]"
              placeholder="Enter E-Mail*"></input>
            <button className="bg-[#00197D] p-3 text-white rounded-tr-lg rounded-br-lg">
              Subscribe
            </button>
          </div>
        </div>
      </div>
      <div className="mt-20 flex w-[90%] p-3">
        <div className="w-[50%] flex justify-center gap-5">
          <div className="flex flex-col justify-start w-[50%]">
            <div className="flex mb-5">
              <img src={logofooter} />
            </div>
            <div className="text-white mb-5">
              <p>
                Competently repurpose forward conveniently target e-business
                multipurpose clean
              </p>
            </div>
            <div className="flex gap-3 text-white mt-4">
              <div className="h-[40px] w-[40px] rounded-full border-white border-[1px] flex justify-center items-center">
                <FaFacebook />
              </div>
              <div className="h-[40px] w-[40px] rounded-full border-white border-[1px] flex justify-center items-center">
                <FaTelegram />
              </div>
              <div className="h-[40px] w-[40px] rounded-full border-white border-[1px] flex justify-center items-center">
                <FaInstagram />
              </div>
              <div className="h-[40px] w-[40px] rounded-full border-white border-[1px] flex justify-center items-center">
                <FaInstagram />
              </div>
            </div>
          </div>
          <div className="flex flex-col text-white w-[50%]">
            <div>
              <h3 className="text-[24px] text-whit font-semibold mb-3">Company</h3>
            </div>
            <div className="flex flex-col leading-8">
              <Link className="flex items-center gap-2 text-[16px] font-normal mb-2">
                <IoIosArrowForward /> <span>Home</span>
              </Link>
              <Link className="flex items-center gap-2 text-[16px] font-normal mb-2">
                <IoIosArrowForward /> <span>About Us</span>
              </Link>
              <Link className="flex items-center gap-2 text-[16px] font-normal mb-2">
                <IoIosArrowForward /> <span>Our Service</span>
              </Link>
              <Link className="flex items-center gap-2 text-[16px] font-normal mb-2">
                <IoIosArrowForward /> <span>Meet Our Team</span>
              </Link>
              <Link className="flex items-center gap-2 text-[16px] font-normal mb-2">
                <IoIosArrowForward /> <span>Lastest Blog</span>
              </Link>
            </div>
          </div>
        </div>
        <div className="w-[50%] flex">
          <div className="flex flex-col">
            <div>
              <h3 className="text-[24px] text-whit font-semibold text-white mb-3">
                Latest Blogs
              </h3>
            </div>
            <div className="flex flex-col">
              <div className="flex justify-center items-center mb-6 gap-3">
                <div>
                  <img
                    className="w-[130px] h-[80px] object-cover rounded-2xl "
                    src={workgalary}
                  />
                </div>
                <div className="flex flex-col">
                  <Link className="text-[16px] text-white font-medium hover:text-[#FFC703] transition duration-500">
                    Equipment for House 2024 Newest Cleaning
                  </Link>
                  <span className="text-[14px] font-normal leading-[26px] text-[#808CBF]">
                    May 19, 2024
                  </span>
                </div>
              </div>
              <div className="flex justify-center items-center gap-3">
                <div>
                  <img
                    className="w-[130px] h-[80px] object-cover rounded-2xl "
                    src={workgalary}
                  />
                </div>
                <div className="flex flex-col">
                  <Link className="text-[16px] text-white font-medium hover:text-[#FFC703] transition duration-500">
                    Equipment for House 2024 Newest Cleaning
                  </Link>
                  <span className="text-[14px] font-normal leading-[26px] text-[#808CBF]">
                    May 19, 2024
                  </span>
                </div>
              </div>
            </div>
          </div>
          <div className="flex flex-col">
            <div>
              <h3 className="text-[24px] text-whit font-semibold text-white mb-3">
                Contact Us
              </h3>
            </div>
            <div className="flex flex-col justify-start items-start">
              <div className="flex justify-center items-center gap-3 mb-3">
                <div className="rounded-full border-[#43559F] border-dashed border-[1px] flex justify-center items-center p-3 text-white bg-[#193089]">
                  <AiOutlineEnvironment />
                </div>
                <div className="flex flex-col">
                  <span className="text-[15px] font-semibold text-white">
                    Address
                  </span>
                  <p className="text-[#B9BBD2] font-normal mt-1">
                  18 / 3, Long Thoi commune, Nha Be district, Ho Chi Minh City
                  </p>
                </div>
              </div>

              <div className="flex justify-center items-center gap-3 mb-3">
                <div className="rounded-full border-[#43559F] border-dashed border-[1px] flex justify-center items-center p-3 text-white bg-[#193089]">
                  <MdPhone />
                </div>
                <div className="flex flex-col">
                  <span className="text-[15px] font-semibold text-white">
                    Call Us
                  </span>
                  <p className="text-[#B9BBD2] font-normal mt-1">
                    Call Us +84 038 (6950) 752
                  </p>
                </div>
              </div>
              <div className="flex justify-center items-center gap-3">
                <div className="rounded-full border-[#43559F] border-dashed border-[1px] flex justify-center items-center p-3 text-white bg-[#193089]">
                  <TfiEmail />
                </div>
                <div className="flex flex-col">
                  <span className="text-[15px] font-semibold text-white">
                    Email
                  </span>
                  <p className="text-[#B9BBD2] font-normal mt-1">
                    toanb3074@gmail.com
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div className="w-[90%] flex flex-col mt-[100px]">
        <div className="h-[1px] bg-slate-500"></div>
        <p className="text-white text-center mt-[20px] mb-[20px] ">
          © The project is implemented by <span className="text-[#FFC703]">Group 3</span>
        </p>
      </div>
    </div>
  );
};

export default Footer;
