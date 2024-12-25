import React, { useState, useEffect } from "react";
import axios from "axios";
import { Button, InputForm, Selectinput } from "../../components";
import { useSnackbar } from "notistack";
import { useForm } from "react-hook-form";

const Createdemployee = () => {
  const { enqueueSnackbar } = useSnackbar();
  const [jobCategories, setJobCategories] = useState([]);
  const [districts, setDistricts] = useState([]);
  const [district, setDistrict] = useState("");
  const [job, setJob] = useState("");
  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm();

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [jobResponse, districtResponse] = await Promise.all([
          axios.get("https://project3-dq33.onrender.com/api/categoryservice"),
          axios.get(
            "https://project3-dq33.onrender.com/api/supervisor/districts",
            {
              headers: {
                Authorization: `Bearer ${localStorage.getItem("accessToken")}`,
              },
            }
          ),
        ]);

        if (jobResponse.data.success) {
          setJobCategories(
            jobResponse.data.categories.map((job) => ({
              id: job._id,
              value: job.title,
              text: job.title,
            }))
          );
        }

        if (districtResponse.data.success) {
          setDistricts(
            districtResponse.data.districts.map((dist) => ({
              id: dist,
              value: dist,
              text: dist,
            }))
          );
        }
      } catch (error) {
        console.error("Error loading data:", error);
        enqueueSnackbar("Failed to load data.", { variant: "error" });
      }
    };

    fetchData();
  }, [enqueueSnackbar]);

  const onSubmit = async (data) => {
    try {
      const formData = new FormData();
      formData.append("name", data.name);
      formData.append("email", data.email);
      formData.append("mobile", data.mobile);
      formData.append("baseSalary", data.baseSalary);
      formData.append("district", district);
      formData.append("job", job);
      if (data.avatar && data.avatar[0]) {
        formData.append("avatar", data.avatar[0]);
      }

      console.log("FormData:", {
        name: data.name,
        email: data.email,
        mobile: data.mobile,
        baseSalary: data.baseSalary,
        district,
        job,
        avatar: data.avatar?.[0],
      });

      const response = await axios.post(
        "https://project3-dq33.onrender.com/api/employee/registeremployee",
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
            Authorization: `Bearer ${localStorage.getItem("accessToken")}`,
          },
        }
      );

      if (response.data.success) {
        enqueueSnackbar("Employee created successfully!", {
          variant: "success",
        });
        reset();
        setDistrict("");
        setJob("");
      } else {
        enqueueSnackbar(response.data.mes || "Failed to create employee.", {
          variant: "error",
        });
      }
    } catch (error) {
      const errorMessage =
        error.response?.data?.message ||
        "An error occurred while creating the employee.";
      console.error("Error creating employee:", errorMessage);
      enqueueSnackbar(errorMessage, {
        variant: "error",
      });
    }
  };

  return (
    <div className="w-[85%] p-10 rounded-2xl border bg-white mt-5">
      <h2 className="text-lg font-semibold mb-4 text-center uppercase text-black">
        Create Employee
      </h2>
      <form onSubmit={handleSubmit(onSubmit)}>
        <InputForm
          label="Name"
          id="name"
          register={register}
          errors={errors}
          validate={{ required: "Name is required" }}
          placeholder="Name Employee"
          style={"placeholder:text-[14px]"}
        />
        <InputForm
          style={"placeholder:text-[14px]"}
          label="Email"
          type="email"
          id="email"
          register={register}
          errors={errors}
          placeholder="Email Employee"
          validate={{ required: "Email is required" }}
        />
        <InputForm
          label="Mobile"
          type="tel"
          id="mobile"
          register={register}
          errors={errors}
          placeholder="Mobile Employee"
          validate={{
            required: "Mobile is required",
            pattern: {
              value: /^\d{10,11}$/, // Regex kiểm tra 10 hoặc 11 chữ số
              message: "Mobile must be 10 or 11 digits",
            },
          }}
        />
        <InputForm
          label="Base Salary"
          type="number"
          id="baseSalary"
          register={register}
          errors={errors}
          placeholder="Base Salary Employee"
          validate={{
            required: "Base Salary is required",
            min: {
              value: 1, // Số dương
              message: "Base Salary must be greater than 0",
            },
          }}
        />
        <div className="mt-2">
          <h2 className="text-[13px]">District</h2>
          <Selectinput
            className="bg-gradient-to-r from-[#979db6] to-gray-300"
            value={district}
            changeValue={setDistrict}
            options={districts}
          />
        </div>
        <div className="mt-2">
          <h2 className="text-[13px]">Job Category</h2>
          <Selectinput
            className="bg-gradient-to-r from-[#979db6] to-gray-300"
            value={job}
            changeValue={setJob}
            options={jobCategories}
          />
        </div>
        <div className="mt-2">
          <h2 className="text-[13px]">Avatar</h2>
          <input
            className="w-full p-2 rounded border bg-gray-100"
            type="file"
            id="avatar"
            {...register("avatar")}
          />
        </div>
        <div className="mt-5">
          <Button
            fw
            type="submit"
            style={
              "w-full p-2 bg-white rounded-2xl bg-gradient-to-r from-[#979db6] to-gray-300"
            }
          >
            Create Employee
          </Button>
        </div>
      </form>
    </div>
  );
};

export default Createdemployee;
