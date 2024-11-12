import React, { useState } from "react";
import { apiCreatesupervise } from "../../apis";
import { Button, InputForm, Selectinput } from "../../components"; 
import { useSnackbar } from "notistack";
import { useForm } from "react-hook-form";

const Createdsupervise = () => {
  const { enqueueSnackbar } = useSnackbar();
  const [district, setDistrict] = useState(""); // State cho quận
  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm();

  const districts = [
    { id: 1, value: "District 1", text: "District 1" },
    { id: 2, value: "District 2", text: "District 2" },
    { id: 3, value: "District 3", text: "District 3" },
    { id: 4, value: "District 4", text: "District 4" },
    { id: 5, value: "District 5", text: "District 5" },
    { id: 6, value: "District 6", text: "District 6" },
    { id: 7, value: "District 7", text: "District 7" },
    { id: 8, value: "District 8", text: "District 8" },
    { id: 9, value: "District 9", text: "District 9" },
    { id: 10, value: "District 10", text: "District 10" },
    { id: 11, value: "District 11", text: "District 11" },
    { id: 12, value: "District 12", text: "District 12" },
  ];

  const onSubmit = async (data) => {
    try {
      const response = await apiCreatesupervise({ ...data, district }); // Gửi quận cùng với dữ liệu
      if (response.success) {
        enqueueSnackbar("Supervisor created successfully!", {
          variant: "success",
        });
        reset(); // Reset form fields
      } else {
        enqueueSnackbar(response.mes || "Failed to create supervisor.", {
          variant: "error",
        });
      }
    } catch (error) {
      console.error("Error creating supervisor:", error);
      enqueueSnackbar("An error occurred while creating the supervisor.", {
        variant: "error",
      });
    }
  };

  return (
    <div className="w-[85%] p-10 rounded-2xl border bg-white mt-5">
      <h2 className="text-lg font-semibold mb-4 text-center uppercase text-black ">
        Create Supervisor
      </h2>
      <form onSubmit={handleSubmit(onSubmit)}>
        <InputForm
          label="Name"
          id="name"
          register={register}
          errors={errors}
          validate={{ required: "Name is required" }}
          placeholder="Name Supervisor"
          style={"placeholder:text-[14px]"}
        />
        <InputForm
          style={"placeholder:text-[14px]"}
          label="Email"
          type="email"
          id="email"
          register={register}
          errors={errors}
          placeholder="Email Supervisor"
          validate={{ required: "Email is required" }}
        />
        <InputForm
          label="Password"
          style={"placeholder:text-[14px] "}
          type="password"
          id="password"
          register={register}
          errors={errors}
          validate={{ required: "Password is required" }}
          placeholder="Password Supervisor"
        />

        <InputForm
          label="Phone"
          type="tel"
          id="phone"
          register={register}
          errors={errors}
          validate={{ required: "Phone is required" }}
          placeholder="Phone Supervisor"
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
        <div className="mt-5">
          <Button fw type="submit" style={"w-full p-2 bg-white rounded-2xl"}>
            Create Supervisor
          </Button>
        </div>
      </form>
    </div>
  );
};

export default Createdsupervise;
