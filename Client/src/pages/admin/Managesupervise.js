import React, { useEffect, useState, useCallback } from "react";
import { apiGetsupervise, apiDeletesupervise } from "../../apis/supervise";
import { sortByDate } from "../../ultils/contants";
import { Button, Inputfields, Pagination, Selectinput } from "../../components";
import useDebounce from "../../hooks/useDebounce";
import { useSearchParams } from "react-router-dom";
import { useSnackbar } from "notistack";
import { fetchDistricts } from "../../apis/mapApi"; 

const Managesupervise = () => {
  const { enqueueSnackbar } = useSnackbar();
  const [invalidFields, setInvalidFields] = useState(null);
  const [districts, setDistricts] = useState([]); 
  const [supervisors, setSupervisors] = useState([]);
  const [queries, setQueries] = useState({
    q: "",
    district: "All",
  });
  const [sort, setSort] = useState("");
  const [counts, setCounts] = useState(0);
  const [params] = useSearchParams();

  const changeValue = useCallback((value, type) => {
    if (value === "Choose option") {
      if (type === "district") {
        setQueries((prev) => ({ ...prev, district: "All" }));
        setSort("");
      } else if (type === "sortByDate") {
        setSort("");
      }
    } else {
      if (type === "sortByDate") {
        setSort(value);
      } else if (type === "district") {
        setQueries((prev) => ({ ...prev, district: value }));
      }
    }
  }, []);

  useEffect(() => {
    const loadDistricts = async () => {
      try {
        const districtsData = await fetchDistricts();
        // Định dạng dữ liệu cho Selectinput
        const formattedDistricts = districtsData.map((district) => ({
          id: district.code,
          value: district.name,
          text: district.name,
        }));
        setDistricts(formattedDistricts);
      } catch (error) {
        console.error("Error fetching districts:", error);
        enqueueSnackbar("Failed to fetch districts.", { variant: "error" });
      }
    };

    loadDistricts();
  }, [enqueueSnackbar]);

  const fetchSupervisors = async (params) => {
    try {
      const response = await apiGetsupervise({
        ...params,
        limit: process.env.REACT_APP_PRODUCT_LIMIT,
        sort,
      });
      if (response.success) {
        setSupervisors(response.supervisor);
        setCounts(response.counts);
      } else {
        enqueueSnackbar("Failed to load supervisors", { variant: "error" });
      }
    } catch (error) {
      enqueueSnackbar("An error occurred while fetching supervisors", {
        variant: "error",
      });
    }
  };

  const queriesDebounce = useDebounce(queries.q, 800);

  useEffect(() => {
    const searchParams = Object.fromEntries([...params]);
    if (queriesDebounce) searchParams.q = queriesDebounce;
    if (queries.district && queries.district !== "All") {
      searchParams.district = queries.district;
    } else {
      delete searchParams.district;
    }

    fetchSupervisors(searchParams);
  }, [params, queriesDebounce, queries.district, sort]);

  const deleteSupervisor = async (spid) => {
    try {
      const response = await apiDeletesupervise(spid);
      if (response.success) {
        enqueueSnackbar("Supervisor deleted successfully", {
          variant: "success",
        });

        fetchSupervisors();
      } else {
        enqueueSnackbar("Failed to delete supervisor", { variant: "error" });
      }
    } catch (error) {
      enqueueSnackbar("An error occurred while deleting supervisor", {
        variant: "error",
      });
    }
  };

  return (
    <div className="w-[85%]">
      <div className="w-full justify-center items-center flex flex-col">
        <div className="flex w-full">
          <Inputfields
            style={"inputsearcadmin"}
            nameKey={"q"}
            value={queries.q}
            setValue={setQueries}
            placeholder="Search name or email Supervisor..."
            isHidelabel
            setinvalidFields={setInvalidFields}
          />
        </div>
        <div className="flex w-full justify-around items-center mb-5 gap-10">
          <Selectinput
            className='bg-gradient-to-r from-[#979db6] to-gray-300'
            changeValue={(value) => changeValue(value, "district")}
            value={queries.district}
            options={districts}
          />
          <Selectinput
           className='bg-gradient-to-r from-[#979db6] to-gray-300'
            changeValue={(value) => changeValue(value, "sortByDate")}
            value={sort}
            options={sortByDate}
          />
        </div>

        <div className="w-[100%] border rounded-2xl bg-white p-5">
          <table className="rounded-3xl overflow-hidden w-full leading-10">
            <thead>
              <tr className="text-[13px] ">
                <th>Number</th>
                <th>Name</th>
                <th>Email</th>
                <th>District</th>
                <th>Phone</th>
                <th>CreatedAt</th>
                <th>Action</th>
              </tr>
            </thead>
            <tbody className="text-center">
              {supervisors?.map((el, idx) => (
                <tr
                  key={el._id}
                  className="text-[13px] transition duration-300 ease-in-out transform hover:scale-105 focus:outline-none focus:ring-2 focus:ring-[#e0a96a] focus:ring-opacity-50">
                  <td className="text-center">{idx + 1}</td>
                  <td>
                    <span>{el.name}</span>
                  </td>
                  <td>
                    <span>{el.email}</span>
                  </td>
                  <td>
                    <span>{el.district}</span>
                  </td>
                  <td>
                    <span>{el.phone}</span>
                  </td>
                  <td className="py-2 px-4">
                    {new Date(el.createdAt).toLocaleDateString()}
                  </td>
                  <td>
                    <Button style={'w-auto'}
                      handleOnclick={() => deleteSupervisor(el._id)}
                      className="bg-red-500 text-white">
                      Delete
                    </Button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
      <div className="w-full flex justify-end mt-5">
        <Pagination totalCount={counts} />
      </div>
    </div>
  );
};

export default Managesupervise;
