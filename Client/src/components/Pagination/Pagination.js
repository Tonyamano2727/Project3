import React from 'react';
import { useSearchParams, useNavigate, createSearchParams, useLocation } from 'react-router-dom';
import Pagiitem from './Pagiitem';
import usePagination from '../../hooks/usePAganation';
import icons from "../../ultils/icons";

const { MdOutlineNavigateNext , GrFormPrevious } = icons;

const Pagination = ({ totalCount }) => {
  const [params] = useSearchParams();
  const currentPage = parseInt(params.get('page')) || 1;
  const navigate = useNavigate();
  const location = useLocation();
  const { paginationArray } = usePagination(totalCount, currentPage);

  const handlePageChange = (page) => {
    navigate({
      pathname: location.pathname,
      search: createSearchParams({ ...params, page }).toString(),
    });
  };

  const handleNext = () => {
    if (currentPage < paginationArray[paginationArray.length - 1]) {
      handlePageChange(currentPage + 1);
    }
  };

  const handlePrev = () => {
    if (currentPage > 1) {
      handlePageChange(currentPage - 1);
    }
  };

  return (
    <div className="flex items-center gap-2">
      
      <button
        onClick={handlePrev}
        disabled={currentPage <= 1}
        className="p-4 w-10 h-10 text-[20px] flex items-center justify-center bg-gray-300 rounded-full cursor-pointer"
      >
       <span><GrFormPrevious/></span>
      </button>


      {paginationArray.map((pageNum) => (
        <Pagiitem
          key={pageNum}
          children={pageNum}
          onClick={() => handlePageChange(pageNum)}
          page={currentPage}
        />
      ))}

   
      <button
        onClick={handleNext}
        disabled={currentPage >= paginationArray[paginationArray.length - 1]}
        className="p-4 w-10 text-[20px] h-10 flex items-center justify-center bg-gray-300 rounded-full cursor-pointer"
      >
       <span><MdOutlineNavigateNext/></span>
      </button>
    </div>
  );
};

export default Pagination;
