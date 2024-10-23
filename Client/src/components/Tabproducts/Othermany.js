import React, { useEffect, useState } from "react";
import { apiGetProducts } from "../../apis/products";
import { Product } from "..";
import Slider from "react-slick";

const tabs = [
  { id: 1, name: "Best Seller" },
];
var settings = {
  dots: false,
  infinite: false,
  speed: 500,
  slidesToShow: 4,
  slidesToScroll: 3,
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
        slidesToShow: 3,
        slidesToScroll: 1
      }
    },
    {
      breakpoint: 480,
      settings: {
        slidesToShow: 2,
        slidesToScroll: 1
      }
    }
  ]
};
const Othermany = () => {
  const [activedTab, setActivedTab] = useState(1);

  const [bestseller, setBestSeller] = useState(null);
 

  const [products, setProducts] = useState(null);
  const fectchProducts = async () => {
    const [bestSellerResponse ] =
      await Promise.all([
        apiGetProducts({ sort: "-sold" }),
      ]);
    if (bestSellerResponse?.success) {
      setBestSeller(bestSellerResponse.products);
      setProducts(bestSellerResponse.products);
    }

    
  };
  useEffect(() => {
    fectchProducts();
  }, []);
  useEffect(() => {
    if (activedTab === 1) setProducts(bestseller);
   
  }, [activedTab, bestseller]);
  return (
    <>
      <div>
        <div className="flex sm:p-4 xl:text-[25px] text-[20px]  xl:p-0 gap-8 mt-[20px]  xl:mt-[50px] w-[50%] xl:mb-[50px] xl:ml-[60px] ml-[30px]">
          {tabs.map((el) => (
            <span
              key={el.id}
              className="font-semibold capitalize cursor-pointer"
              >
              {el.name}
            </span>
          ))}
        </div>
        <div className="w-full pb-8">
          <div className="w-[100%]">
            <div className="mt-4">
              <Slider {...settings}>
                {products?.map((el) => (
                  <Product
                    key={el.id}
                    pid={el._id}
                    productData={el}
                    isNew={activedTab === 1 ? false : true}
                  />
                ))}
              </Slider>
            </div>
            
          </div>
        </div>
      </div>
    </>
  );
};

export default Othermany;
