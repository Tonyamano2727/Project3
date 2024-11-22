import React, { useCallback, useEffect, useState } from "react";
import { InputForm, Pagination, Selectinput } from "../../components";
import { useForm } from "react-hook-form";
import { apiGetProducts, apiGetCategory, apiDeleteproduct } from "../../apis";
import { formatMoney } from "../../ultils/helper";
import { Link, useSearchParams } from "react-router-dom";
import useDebounce from "../../hooks/useDebounce";
import Updateproducts from "./Updateproducts";
import Swal from "sweetalert2";
import { useSnackbar } from "notistack";
import { sortByDate } from "../../ultils/contants";
import { FaEdit } from "react-icons/fa";
import { RiDeleteBin6Line } from "react-icons/ri";
import { CSVLink } from "react-csv";
import Papa from "papaparse";
import moment from "moment"; // Import moment for date formatting

const ManageProducts = () => {
  const { register, formState: { errors }, watch } = useForm();
  const { enqueueSnackbar } = useSnackbar();
  const [params] = useSearchParams();
  const [products, setProducts] = useState([]);
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

    if (!selectedCategory) delete queryParams.category;
    else queryParams.category = selectedCategory;

    if (!selectedBrand) delete queryParams.brand;
    else queryParams.brand = selectedBrand;

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
      }
    } catch (error) {
      console.error("Error fetching categories:", error);
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
          enqueueSnackbar(response.mes, { variant: "success" });
        } else {
          enqueueSnackbar(response.mes, { variant: "error" });
        }
        render();
      }
    });
  };

  const handleFileUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      Papa.parse(file, {
        header: true,
        skipEmptyLines: true,
        complete: (result) => {
          setProducts(result.data);
          enqueueSnackbar("Products imported successfully!", { variant: "success" });
        },
        error: (error) => {
          enqueueSnackbar(`Error importing products: ${error.message}`, { variant: "error" });
        },
      });
    }
  };

  const generateCsvData = () => {
    const currentDate = moment().format("YYYY-MM-DD HH:mm:ss");
    const metadata = [
      ["Product Report"], // Title row
      [`Generated On: ${currentDate}`], // Date row
      [], // Blank row
    ];

    const headers = [
      { label: "Title", key: "title" },
      { label: "Image URL", key: "thumb" },
      { label: "Color", key: "color" },
      { label: "Brand", key: "brand" },
      { label: "Category", key: "category" },
      { label: "Price", key: "price" },
      { label: "Quantity", key: "quantity" },
      { label: "Sold", key: "sold" },
      { label: "Ratings", key: "totalRatings" },
    ];

    const productData = products.map((product) => ({
      title: product.title,
      thumb: product.thumb,
      color: product.color,
      brand: product.brand,
      category: product.category,
      price: formatMoney(product.price),
      quantity: product.quantity,
      sold: product.sold,
      totalRatings: product.totalRatings,
    }));

    return metadata.concat([headers.map((header) => header.label)]).concat(productData.map(Object.values));
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
        <Link className="p-2 bg-gradient-to-r from-[#979db6] to-gray-300 rounded-2xl text-[13px] px-4">
          + New Products
        </Link>
        <div className="flex space-x-4">
          <input
            type="file"
            accept=".csv"
            onChange={handleFileUpload}
            className="p-2 bg-white rounded-2xl border"
          />
          <CSVLink
            data={generateCsvData()}
            filename={`Product_Report_${moment().format("YYYYMMDD_HHmmss")}.csv`}
            className="p-2 bg-gradient-to-r from-green-500 to-green-700 rounded-2xl text-white"
          >
            Export Report
          </CSVLink>
        </div>
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
              <tr className="text-[13px]" key={el._id || idx}>
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
                      className="hover:underline cursor-pointer px-2 text-blue-500"
                    >
                      <FaEdit size={20} />
                    </span>
                    <span
                      onClick={() => handleDeleteProduct(el._id)}
                      className="text-red-500 hover:underline cursor-pointer px-2"
                    >
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
