import React, { useCallback, useEffect, useState } from "react";
import { InputForm, Pagination, Selectinput } from "../../components";
import { useForm } from "react-hook-form";
import { apiGetProducts, apiGetCategory } from "../../apis"; // Import API lấy danh mục và thương hiệu
import { formatMoney } from "../../ultils/helper";
import { Link, useSearchParams } from "react-router-dom";
import useDebounce from "../../hooks/useDebounce";
import Updateproducts from "./Updateproducts";
import { apiDeleteproduct } from "../../apis";
import Swal from "sweetalert2";
import { useSnackbar } from 'notistack'; // Import Notistack
import { sortByDate } from "../../ultils/contants";
import { FaEdit } from "react-icons/fa";
import { RiDeleteBin6Line } from "react-icons/ri";

const ManageProducts = () => {
  const {
    register,
    formState: { errors },
    watch,
  } = useForm();

  const { enqueueSnackbar } = useSnackbar(); 

  const [params] = useSearchParams();
  const [products, setProducts] = useState(null);
  const [getallCategory, setgetallCategory] = useState([]);
  const [counts, setCounts] = useState(0);
  const [editProduct, setEditProduct] = useState(null);
  const [update, setUpdate] = useState(false);
  const [sort, setSort] = useState(""); 
  const [selectedCategory, setSelectedCategory] = useState(""); 
  const [selectedBrand, setSelectedBrand] = useState(""); 

  const render = useCallback(() => {
    setUpdate(!update);
  }, [update]);

  const fetchProducts = async (params) => {
    const queryParams = {
      ...params,
      limit: process.env.REACT_APP_PRODUCT_LIMIT,
    };

    if (!selectedCategory) {
      delete queryParams.category; 
    } else {
      queryParams.category = selectedCategory; 
    }

    if (!selectedBrand) {
      delete queryParams.brand;
    } else {
      queryParams.brand = selectedBrand; 
    }

    const response = await apiGetProducts(queryParams);
    if (response.success) {
      setProducts(response.products);
      setCounts(response.counts);
    }
  };

  const querydeBounce = useDebounce(watch("q"), 800);

  useEffect(() => {
    const searchParams = Object.fromEntries([...params]);
    if (querydeBounce) searchParams.q = querydeBounce;
    fetchProducts(searchParams);
  }, [params, querydeBounce, update, selectedCategory, selectedBrand]);
  const fetchCategories = async () => {
    try {
      const response = await apiGetCategory(); 
      if (response.success) {
        setgetallCategory(response.getallCategory);
      } else {
        console.error(
          "Lỗi khi lấy danh mục:",
          response.message || "Unknown error"
        );
      }
    } catch (error) {
      console.error("Có lỗi xảy ra khi gọi API:", error);
    }
  };

  useEffect(() => {
    fetchCategories(); 
  }, []);

  const handleDeleteProduct = (pid) => {
    Swal.fire({
      title: "Are you sure?",
      text: "Are you sure you want to remove this product?",
      icon: "warning",
      showCancelButton: true,
    }).then(async (rs) => {
      if (rs.isConfirmed) {
        const response = await apiDeleteproduct(pid);
        if (response.success) {
          enqueueSnackbar(response.mes, { variant: 'success' }); // Use Notistack
        } else {
          enqueueSnackbar(response.mes, { variant: 'error' }); // Use Notistack
        }
        render();
      }
    });
  };

  return (
    <div className="w-[85%] flex flex-col gap-4 relative h-[1400px]">
      {editProduct && (
        <Updateproducts
          editproduct={editProduct}
          render={render}
          seteditproduct={setEditProduct}
        />
      )}
      <div className="w-full flex p-2 items-center justify-between">
        <Link className="p-2 bg-gradient-to-r from-[#d3b491] to-[#e07c93] rounded-2xl text-[14px] text-white px-4">
          + New Products
        </Link>
        <div className="w-[25%]">
          <Selectinput 
          className='bg-gradient-to-r from-[#d3b491] to-[#e07c93]'
            changeValue={(value) => setSort(value)}
            value={sort}
            options={sortByDate}
          />
        </div>
        <div className="w-[25%]">
          <Selectinput
           className='bg-gradient-to-r from-[#d3b491] to-[#e07c93]'
            changeValue={(value) => setSelectedCategory(value)} // Cập nhật giá trị selectedCategory
            value={selectedCategory}
            options={getallCategory.map((category) => ({
              text: category.title,
            }))}
            placeholder="Select Category"
          />
        </div>
        <div className="w-[25%]">
          <Selectinput
           className='bg-gradient-to-r from-[#d3b491] to-[#e07c93]'
            changeValue={(value) => setSelectedBrand(value)}
            value={selectedBrand}
            options={getallCategory.map((category) => ({
              text: category.brand,
            }))}
            placeholder="Select Brand"
          />
        </div>
      </div>
      <div className="flex w-full justify-end items-center ">
        <form className="w-[100%]">
          <InputForm
            id="q"
            register={register}
            errors={errors}
            fullwith
            placeholder="Search product by title"
          />
        </form>
      </div>
      <div className="border rounded-2xl p-5 bg-white">
        <table className="overflow-hidden w-full leading-10">
          <thead>
            <tr className="text-[13px]">
              <th>STT</th>
              <th>Products</th>
              <th>Color</th>
              <th>Brand</th>
              <th>Category</th>
              <th>Price</th>
              <th>Quantity</th>
              <th>Sold</th>
              <th>Ratings</th>
              <th>Action</th>
            </tr>
          </thead>
          <tbody className="text-center">
            {products?.map((el, idx) => (
              <tr className="text-[13px]" key={el._id}>
                <td>{idx + 1}</td>
                <td className="flex justify-center items-center flex-col">
                  <img
                    src={el.thumb}
                    alt="thumb"
                    className="w-[50px] h-[55px] object-cover rounded-full"
                  />
                  <div>
                    <span className="font-medium">{el.title}</span>
                  </div>
                </td>
                <td>{el.color}</td>
                <td>{el.brand}</td>
                <td>{el.category}</td>
                <td>{`${formatMoney(el.price)} VNĐ`}</td>
                <td>{el.quantity}</td>
                <td>{el.sold}</td>
                <td>{el.totalRatings}</td>
                <td>
                  <div className="flex items-center justify-center">
                    <span
                      onClick={() => setEditProduct(el)}
                      className="hover:underline cursor-pointer px-2 text-blue-500">
                      <FaEdit size={20} />
                    </span>
                    <span
                      onClick={() => handleDeleteProduct(el._id)}
                      className="text-red-500 hover:underline cursor-pointer px-2">
                      <RiDeleteBin6Line size={20} />
                    </span>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <div className="w-full flex justify-end my-8">
        <Pagination totalCount={counts} />
      </div>
    </div>
  );
};

export default ManageProducts;
