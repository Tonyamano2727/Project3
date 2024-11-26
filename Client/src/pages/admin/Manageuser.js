import React, { useEffect, useState, useCallback } from "react";
import { apigetuser, apiupdateUserbyadmin } from "../../apis/user";
import moment from "moment";
import { sortsuser, sortByDate } from "../../ultils/contants";
import { Button, Inputfields, Pagination, Selectinput } from "../../components";
import useDebounce from "../../hooks/useDebounce";
import { useForm } from "react-hook-form";
import { useSnackbar } from "notistack";
import { useSearchParams } from "react-router-dom";
import { IoMdCreate } from "react-icons/io";

const ManageUser = () => {
  const { enqueueSnackbar } = useSnackbar(); 
  const [invalidFields, setInvalidFields] = useState(null);
  const {
    handleSubmit,
    register,
    setValue,
    formState: { errors },
  } = useForm();

  const [sort, setSort] = useState("");
  const [users, setUsers] = useState([]);
  const [queries, setQueries] = useState({
    q: "",
    isBlocked: "All",
  });
  const [update, setUpdate] = useState(false);
  const [editEl, setEditEl] = useState(null);
  const [counts, setCounts] = useState(0);
  const [params] = useSearchParams();

  const changeValue = useCallback((value) => {
    if (value.includes("createdAt")) {
      setSort(value);
    } else {
      setSort(value);
      if (value === "isBlocked:true" || value === "isBlocked:false") {
        setQueries((prev) => ({ ...prev, isBlocked: value.split(":")[1] }));
      } else {
        setQueries((prev) => ({ ...prev, isBlocked: "All" }));
      }
    }
  }, []);

  const fetchUser = async (params) => {
    const response = await apigetuser({
      ...params,
      limit: process.env.REACT_APP_PRODUCT_LIMIT,
      sort,
    });
    if (response.success) {
      setUsers(response.users);
      setCounts(response.counts);
    }
  };

  const queriesDebounce = useDebounce(queries.q, 800);

  useEffect(() => {
    const searchParams = Object.fromEntries([...params]);
    if (queriesDebounce) searchParams.q = queriesDebounce;

    if (queries.isBlocked !== "All") {
      searchParams.isBlocked = queries.isBlocked === "true";
    }

    fetchUser(searchParams);
  }, [params, queriesDebounce, queries, sort]);

  const handleUpdate = async (data) => {
    const isBlocked = data.isBlocked === "Blocked";
    const response = await apiupdateUserbyadmin(
      { ...data, isBlocked },
      editEl._id
    );

    if (response.success) {
      setUsers((prevUsers) =>
        prevUsers.map((user) =>
          user._id === editEl._id ? { ...user, ...data, isBlocked } : user
        )
      );
      setEditEl(null);
      enqueueSnackbar(response.mes, { variant: "success" }); // Use Notistack for success messages

      const searchParams = Object.fromEntries([...params]);
      if (queriesDebounce) searchParams.q = queriesDebounce;
      fetchUser(searchParams);
    } else {
      enqueueSnackbar(response.mes, { variant: "error" }); // Use Notistack for error messages
    }
  };

  useEffect(() => {
    if (editEl) {
      setValue("isBlocked", editEl.isBlocked ? "Blocked" : "Active");
    }
  }, [editEl, setValue]);

  return (
    <div className="w-[85%]">
      <div className="w-full justify-center items-center flex flex-col">
        <div className="flex w-full">
          <Inputfields
            style={"inputsearcadmin"}
            nameKey={"q"}
            value={queries.q}
            setValue={setQueries}
            placeholder="Search name or email User..."
            isHidelabel
            setinvalidFields={setInvalidFields}
          />
        </div>
        <div className="flex w-full justify-around items-center mb-5 gap-10">
          <Selectinput
            className="bg-gradient-to-r from-[#979db6] to-gray-300"
            changeValue={changeValue}
            value={sort}
            options={sortsuser}
          />
          <Selectinput
            className={"bg-gradient-to-r from-[#979db6] to-gray-300"}
            changeValue={changeValue}
            value={sort}
            options={sortByDate}
          />
        </div>

        <form
          className="w-[100%] border rounded-2xl bg-white p-5"
          onSubmit={handleSubmit(handleUpdate)}>
          <table className="rounded-3xl overflow-hidden w-full leading-10">
            <thead>
              <tr className="text-[13px] ">
                <th className="">Number</th>
                <th>Email</th>
                <th>Firstname</th>
                <th>Lastname</th>
                <th>Phone</th>
                <th>Status</th>
                <th>CreatedAt</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody className="text-center">
              {users?.map((el, idx) => (
                <tr
                  key={el._id}
                  className="text-[13px] transition duration-300 ease-in-out transform hover:scale-105 focus:outline-none focus:ring-2 focus:ring-[#e0a96a] focus:ring-opacity-50">
                  <td className="text-center">{idx + 1}</td>
                  <td>
                    <span>{el.email}</span>
                  </td>
                  <td>
                    <span>{el.firstname}</span>
                  </td>
                  <td>
                    <span>{el.lastname}</span>
                  </td>
                  <td>
                    <span>{el.mobile}</span>
                  </td>
                  <td>
                    {editEl?._id === el._id ? (
                      <select
                        {...register("isBlocked")}
                        className="p-2 rounded-2xl  w-full text-[14px]  px-4 bg-gradient-to-r from-[#d3b491] to-[#e07c93]"
                        onChange={(e) => setValue("isBlocked", e.target.value)}>
                        <option value="Active">Active</option>
                        <option value="Blocked">Blocked</option>
                      </select>
                    ) : (
                      <span>{el.isBlocked ? "Blocked" : "Active"}</span>
                    )}
                  </td>
                  <td className="py-2 px-4">
                    {moment(el.createdAt).format("DD/MM/YYYY")}
                  </td>
                  <td className="py-2 px-4">
                    <div className="flex justify-center items-center">
                      {editEl?._id === el._id ? (
                        <Button fw type="submit" style={'w-auto'}>
                          Update
                        </Button>
                      ) : (
                        <span
                          onClick={() => setEditEl(el)}
                          className="px-2 hover:underline cursor-pointer">
                          <IoMdCreate size={20} color="blue" />
                        </span>
                      )}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </form>
      </div>
      <div className="w-full flex justify-end mt-5">
        <Pagination totalCount={counts} />
      </div>
    </div>
  );
};

export default ManageUser;
