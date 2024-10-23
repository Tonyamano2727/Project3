import React  from "react";
import Chartjs from "../../components/Chart/Chartjs";

import { Dayreward, Infomanage, Monthreward, Rightoverview } from "../../components";

const Overview = () => {
  return (
    <div className="flex flex-col w-[85%]">
      <div className="flex gap-2">
        {" "}
        <Dayreward />
        <Monthreward />
        <Infomanage />
      </div>
      <div className="flex h-auto gap-4">
        <div className="w-[55%]">
        <Chartjs />
        </div>
        <div className="w-[43%]">
            <Rightoverview/>
        </div>
      </div>
    </div>
  );
};

export default Overview;
