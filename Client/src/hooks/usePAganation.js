import React, { useMemo } from "react";

// Hàm generateRange tạo dãy số liên tiếp từ start đến end
const generateRange = (start, end) => {
  let range = [];
  for (let i = start; i <= end; i++) {
    range.push(i);
  }
  return range;
};

const usePagination = (totalProductCount, currentPage, siblingCount = 1) => {
  const paginationArray = useMemo(() => {
    const pageSize = parseInt(process.env.REACT_APP_PRODUCT_LIMIT, 10) || 10;

    let paginationCount = Math.ceil(totalProductCount / pageSize);

    currentPage = Math.min(currentPage, paginationCount);

    if (paginationCount <= 1) return [];

    const totalPaginationItem = siblingCount + 5;
    if (paginationCount <= totalPaginationItem) {
      return generateRange(1, paginationCount);
    }

    const siblingLeft = Math.max(currentPage - siblingCount, 1);
    const siblingRight = Math.min(currentPage + siblingCount, paginationCount);

    return generateRange(siblingLeft, siblingRight);
  }, [totalProductCount, currentPage, siblingCount]);

  return { paginationArray };
};

export default usePagination;
