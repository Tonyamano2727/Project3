import React from "react";
import {
  Banner,
  Dealdaily,
  TabletandIpad,
  Featureproducts,Blog,Cleaning,Aboutus,
  Booking,
  Stepwork,
  Workgalary
} from "../../components";
import { useSelector } from "react-redux";
const Home = () => {
  const {isLoggedIn , current} = useSelector(state => state.user)
  console.log({isLoggedIn , current});
  return (
    <div className="w-full flex justify-center flex-col">
      <div className="w-[100%] justify-center flex flex-col">
        <div className="flex flex-col gap-5 w-[100%] flex-auto ">
          <Banner />
        </div>
        <div className="flex flex-col gap-5 w-[100%] flex-auto ">
          <Cleaning/>
        </div>
        <div className="mt-20">
          <Aboutus/>
        </div>
        <div className="flex flex-col gap-5 w-[100%] flex-auto ">
          <Booking/>
          {/* <TabletandIpad /> */}
        </div>
        <div className="flex flex-col gap-5 w-[100%] flex-auto ">
          <Stepwork/>
      
        </div>
        <div className="flex flex-col gap-5 w-[100%] flex-auto mt-5">
       
          <TabletandIpad />
        </div>
        <div className="flex flex-col gap-5 w-[100%] flex-auto mt-10">
          <Workgalary/>
       
        </div>
      </div>
      
    </div>
  );
};

export default Home;
