import React from "react";
import Slider from "react-slick";
import { Link} from "react-router-dom";
import path from "../../ultils/path";
var settings = {
  dots: false,
  infinite: false,
  speed: 500,
  slidesToShow: 3,
  slidesToScroll: 2,
  responsive: [
    {
      breakpoint: 1024,
      settings: {
        slidesToShow: 3,
        slidesToScroll: 2
      }
    },
    {
      breakpoint: 768,
      settings: {
        slidesToShow: 2,
        slidesToScroll: 1
      }
    },
    {
      breakpoint: 480,
      settings: {
        slidesToShow: 1,
        slidesToScroll: 1
      }
    }
  ]
};

const Blog = () => {
  return (
    <div className="w-full flex-col flex text-[25px] gap-8 mb-[50px] ">
      <div className="w-full">
        <div className="w-[100%]">
          <div className="mt-4">
            <Slider {...settings}>
              <Link to={`/${path.BLOGS}`} className="text-center text-[15px]">
                <div className="w-full flex justify-center flex-col items-center">
                  <img
                    className="h-[280px] w-[80%] object-cover"
                    src="https://th.bing.com/th/id/OIP.GDH7bifW1-n_-n34o2ENFAHaFF?rs=1&pid=ImgDetMain"
                    alt=""></img>
                  <div className="w-[80%] flex flex-col justify-center items-center">
                    <Link className="w-[80%] mt-2 text-[15px] font-semibold">
                      These are the 5 best phones you can buy right now
                    </Link>
                    <div className="mt-2">
                      <span className="px-2">December 13, 2016</span>
                      <span className="px-2">Comment</span>
                    </div>
                    <span className="text-[13px] mt-2 w-[80%]">
                      From high-priced pocket-busters to our favorite budget
                      beauties. You're up to date on everything you need to know
                      before buying a phone, and now the...
                    </span>
                  </div>
                </div>
              </Link>
              <Link to={`/${path.BLOGS}`} className="text-center text-[15px]">
                <div className="w-full flex justify-center flex-col items-center">
                  <img
                    className="h-[280px] w-[80%] object-cover"
                    src="https://th.bing.com/th/id/OIP.aQJroiLQdvsMOTuCD9gZwAHaFj?w=1600&h=1200&rs=1&pid=ImgDetMain"
                    alt=""></img>
                  <div className="w-[80%] flex flex-col justify-center items-center">
                    <Link className="w-[80%] mt-2 text-[15px] font-semibold">
                      These are the 5 best phones you can buy right now
                    </Link>
                    <div className="mt-2">
                      <span className="px-2">December 13, 2016</span>
                      <span className="px-2">Comment</span>
                    </div>
                    <span className="text-[13px] mt-2 w-[80%]">
                      From high-priced pocket-busters to our favorite budget
                      beauties. You're up to date on everything you need to know
                      before buying a phone, and now the...
                    </span>
                  </div>
                </div>
              </Link>
              <Link to={`/${path.BLOGS}`} className="text-center text-[15px]">
                <div className="w-full flex justify-center flex-col items-center">
                  <img
                    className="h-[280px] w-[80%] object-cover"
                    src="https://www.usinenouvelle.com/mediatheque/2/2/6/001218622_896x598_c.jpg"
                    alt=""></img>
                  <div className="w-[80%] flex flex-col justify-center items-center">
                    <Link className="w-[80%] mt-2 text-[15px] font-semibold">
                      These are the 5 best phones you can buy right now
                    </Link>
                    <div className="mt-2">
                      <span className="px-2">December 13, 2016</span>
                      <span className="px-2">Comment</span>
                    </div>
                    <span className="text-[13px] mt-2 w-[80%]">
                      From high-priced pocket-busters to our favorite budget
                      beauties. You're up to date on everything you need to know
                      before buying a phone, and now the...
                    </span>
                  </div>
                </div>
              </Link>
              <Link to={`/${path.BLOGS}`} className="text-center text-[15px]">
                <div className="w-full flex justify-center flex-col items-center">
                  <img
                    className="h-[280px] w-[80%] object-cover"
                    src="https://images.hindustantimes.com/tech/img/2023/09/12/1600x900/iPhone_15_Pro_1694541536304_1694541571648.jpeg"
                    alt=""></img>
                  <div className="w-[80%] flex flex-col justify-center items-center">
                    <Link className="w-[80%] mt-2 text-[15px] font-semibold">
                      These are the 5 best phones you can buy right now
                    </Link>
                    <div className="mt-2">
                      <span className="px-2">December 13, 2016</span>
                      <span className="px-2">Comment</span>
                    </div>
                    <span className="text-[13px] mt-2 w-[80%]">
                      From high-priced pocket-busters to our favorite budget
                      beauties. You're up to date on everything you need to know
                      before buying a phone, and now the...
                    </span>
                  </div>
                </div>
              </Link>
            </Slider>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Blog;
