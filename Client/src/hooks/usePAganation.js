import React, { useMemo } from 'react';
import { generateRage } from '../ultils/helper';
import { BiDotsHorizontalRounded } from "react-icons/bi";

const usePagination = (totalProductCount, currentPage, siblingCount = 1) => {
  const paginationArray = useMemo(() => {
    // Lấy giới hạn sản phẩm mỗi trang, mặc định là 10 nếu không có giá trị từ biến môi trường
    const pageSize = parseInt(process.env.REACT_APP_PRODUCT_LIMIT, 10) || 10;
    // Tính toán tổng số trang dựa trên số lượng sản phẩm và giới hạn mỗi trang
    const paginationCount = Math.ceil(totalProductCount / pageSize);

    // Nếu số trang <= 1, thì không cần phân trang, chỉ có 1 trang
    if (paginationCount <= 1) return [];

    // Tổng số item trong phân trang bao gồm siblings, dấu chấm, và trang đầu/cuối
    const totalPaginationItem = siblingCount + 5;

    // Nếu tổng số trang nhỏ hơn số item trong phân trang, thì chỉ cần tạo dãy từ 1 đến tổng số trang
    if (paginationCount <= totalPaginationItem) return generateRage(1, paginationCount);

    // Kiểm tra xem có cần hiển thị dấu ba chấm bên trái và phải không
    const isShowLeft = currentPage - siblingCount > 2;
    const isShowRight = currentPage + siblingCount < paginationCount - 1;

    // Trường hợp chỉ hiển thị dấu ba chấm ở bên phải
    if (isShowLeft && !isShowRight) {
      const rightStart = paginationCount - 4;
      const rightRange = generateRage(rightStart, paginationCount);
      return [1, <BiDotsHorizontalRounded key="dots-left" />, ...rightRange];
    }

    // Trường hợp chỉ hiển thị dấu ba chấm ở bên trái
    if (!isShowLeft && isShowRight) {
      const leftRange = generateRage(1, 5);
      return [...leftRange, <BiDotsHorizontalRounded key="dots-right" />, paginationCount];
    }

    // Trường hợp hiển thị dấu ba chấm ở cả hai bên
    const siblingLeft = Math.max(currentPage - siblingCount, 1);
    const siblingRight = Math.min(currentPage + siblingCount, paginationCount);
    if (isShowLeft && isShowRight) {
      const middleRange = generateRage(siblingLeft, siblingRight);
      return [1, <BiDotsHorizontalRounded key="dots-left" />, ...middleRange, <BiDotsHorizontalRounded key="dots-right" />, paginationCount];
    }

  }, [totalProductCount, currentPage, siblingCount]);

  return paginationArray;
};

export default usePagination;
