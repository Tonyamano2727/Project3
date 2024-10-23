import React from "react";
import usePAganation from "../../hooks/usePAganation";
import Pagiitem from "./Pagiitem";

const Pagination = ({ totalCount }) => {
  const pagination = usePAganation(totalCount , 1 );
  return (
    <div className="flex items-center">
      {pagination?.map((el) => (
        <Pagiitem key={el}>{el}</Pagiitem>
      ))}
    </div>
  );
};

export default Pagination;
