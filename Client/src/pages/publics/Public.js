import React from "react";
import { Outlet } from "react-router-dom";
import { Header, Navigation,TopHeader,Footer} from "../../components";

const Public = () => {
  return (
    <div className='w-full flex flex-col items-center bg-[#E7E7E7]'>
      <TopHeader />
     
      <Header />
      <Navigation />
      
      <div className='w-[100%]'>
        <Outlet/>
      </div>
      <Footer />
    </div>
  );
};

export default Public;
