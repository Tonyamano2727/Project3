import React, { useCallback, useEffect, useState } from "react";
import { apiGetServices, apiDeleteService } from "../../apis"; // Import API cho dịch vụ
import { sortByDate } from "../../ultils/contants"; // Giả sử bạn đã có constant cho sorting
import { Inputfields, Pagination, Selectinput } from "../../components";
import useDebounce from "../../hooks/useDebounce";
import { Link, useSearchParams } from "react-router-dom";
import { useSnackbar } from "notistack";
import Swal from "sweetalert2";
import { FaEdit } from "react-icons/fa";
import { RiDeleteBin6Line } from "react-icons/ri";
import Updateservices from "./Updateservice";

const Manageservices = () => {
  const { enqueueSnackbar } = useSnackbar();
  const [invalidFields, setinvalidFields] = useState([]);
  const [services, setServices] = useState([]);
  const [counts, setCounts] = useState(0);
  const [queries, setQueries] = useState({
    q: "",
    category: "",
  });
  const [sort, setSort] = useState("");
  const [params] = useSearchParams();
  const [editService, setEditService] = useState(null);
  const [update, setUpdate] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState("");

  const [allCategories, setAllCategories] = useState([]);

  const queriesDebounce = useDebounce(queries.q, 800);

  const fetchServices = async (params) => {
    try {
      const response = await apiGetServices({
        ...params,
        limit: process.env.REACT_APP_PRODUCT_LIMIT,
        sort,
      });
      console.log(response);
      if (response.success) {
        setServices(response.service);
        setCounts(response.counts);
        if (!allCategories.length) {
          const uniqueCategories = [
            ...new Set(response.service.map((service) => service.category)),
          ];
          setAllCategories(uniqueCategories);
        }
      } else {
        enqueueSnackbar("Failed to load services", { variant: "error" });
      }
    } catch (error) {}
  };

  useEffect(() => {
    const searchParams = Object.fromEntries([...params]);
    if (queriesDebounce) searchParams.q = queriesDebounce;
    if (selectedCategory) {
      searchParams.category = selectedCategory;
    } else {
      delete searchParams.category;
    }
    fetchServices(searchParams);
  }, [params, queriesDebounce, sort, selectedCategory]);

  const handleDeleteService = async (sid) => {
    const result = await Swal.fire({
      title: "Are you sure?",
      text: "Do you want to remove this service?",
      icon: "warning",
      showCancelButton: true,
    });

    if (result.isConfirmed) {
      const response = await apiDeleteService(sid); // Gọi API xóa dịch vụ
      if (response.success) {
        // Kiểm tra xem message có phải là chuỗi không
        const message =
          typeof response.message === "string"
            ? response.message
            : "Service deleted successfully";
        enqueueSnackbar(message, { variant: "success" });
        fetchServices(Object.fromEntries([...params])); // Gọi lại hàm fetchServices sau khi xóa
      } else {
        const errorMessage =
          typeof response.message === "string"
            ? response.message
            : "Failed to delete the service";
        enqueueSnackbar(errorMessage, { variant: "error" });
      }
    }
  };

  const changeValue = (value) => {
    setSort(value);
  };

  const render = useCallback(() => {
    setUpdate(!update);
  }, [update]);

  return (
    <div className="w-[90%] flex flex-col gap-4 relative h-[1060px]">
      {editService && (
        <Updateservices
          editService={editService}
          setEditService={setEditService}
          render={render}
        />
      )}
      <div className="w-full flex p-2 gap-10 flex-col justify-start">
        <Link
          to="/admin/create-services" // Thay đổi đường dẫn cho dịch vụ
          className="p-2 bg-gradient-to-r from-[#979db6] to-gray-300 rounded-2xl w-[15%] text-[14px] text-black text-center">
          + New Service
        </Link>
        <div className="flex gap-10">
          <Selectinput
          className={'bg-gradient-to-r from-[#979db6] to-gray-300'}
            changeValue={(value) => {
              setSelectedCategory(value);
              if (!value) {
                const searchParams = { ...Object.fromEntries(params) };
                delete searchParams.category;
                fetchServices(searchParams);
              }
            }}
            value={selectedCategory}
            options={[
              ...allCategories.map((category) => ({
                text: category,
                value: category,
              })),
            ]}
          />
          <Selectinput
          className={'bg-gradient-to-r from-[#979db6] to-gray-300'}
            changeValue={changeValue}
            value={sort}
            options={sortByDate} // Sử dụng cùng một constant cho sorting
          />
        </div>
      </div>
      <div className="flex w-full items-center">
        <Inputfields
          style={"inputsearcadmin"}
          nameKey={"q"}
          value={queries.q}
          setValue={setQueries}
          setinvalidFields={setinvalidFields}
          placeholder="Search service title..."
          isHidelabel
        />
      </div>
      <div className="border rounded-2xl p-5 bg-white z-1">
        <table className="overflow-hidden w-full leading-10">
          <thead>
            <tr className="text-[13px]">
              <th>STT</th>
              <th>Title</th>
              <th>Category</th>
              <th>Price</th> {/* Thay đổi tiêu đề cho dịch vụ */}
              <th>Created At</th>
              <th>Author</th>
              <th>Action</th>
            </tr>
          </thead>
          <tbody className="text-center">
            {services.map((service, idx) => (
              <tr
                className="text-[13px] transition duration-300 ease-in-out transform hover:scale-105 focus:outline-none"
                key={service._id}>
                <td>{idx + 1}</td>
                <td>
                  <span className="font-medium">{service.title}</span>
                </td>
                <td>{service.category}</td>
                <td>{service.price}</td> {/* Hiển thị giá dịch vụ */}
                <td>{new Date(service.createdAt).toLocaleDateString()}</td>
                <td>{service.author || "Unknown"}</td>
                <td>
                  <div className="flex items-center justify-center">
                    <span
                      onClick={() => setEditService(service)}
                      className="hover:underline cursor-pointer px-2 text-blue-500">
                      <FaEdit size={20} />
                    </span>
                    <span
                      onClick={() => handleDeleteService(service._id)} 
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

export default Manageservices;
