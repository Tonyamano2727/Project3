import React, { useState, useEffect } from "react";
import { apiCreatesupervise } from "../../apis";
import { Button, InputForm, Selectinput } from "../../components";
import { useSnackbar } from "notistack";
import { useForm } from "react-hook-form";
import { fetchDistricts } from "../../apis/mapApi";

const Createdsupervise = () => {
  const { enqueueSnackbar } = useSnackbar();
  const [districts, setDistricts] = useState([]);
  const [district, setDistrict] = useState("");
  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm();

  useEffect(() => {
    const loadDistricts = async () => {
      try {
        const districtsData = await fetchDistricts();
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

  const onSubmit = async (data) => {
    try {
      const response = await apiCreatesupervise({ ...data, district });
      if (response.success) {
        enqueueSnackbar("Supervisor created successfully!", {
          variant: "success",
        });
        reset();
        setDistrict("");
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
          <Button
            fw
            type="submit"
            style={
              "w-full p-2 bg-white rounded-2xl bg-gradient-to-r from-[#979db6] to-gray-300"
            }
          >
            Create Supervisor
          </Button>
        </div>
      </form>
    </div>
  );
};

export default Createdsupervise;
