import React, { useEffect } from "react";
import { useForm } from "react-hook-form";
import { Button, InputForm } from "../../components";
import { useDispatch, useSelector } from "react-redux";
import avatar from "../../assets/logo.png";
import { useSnackbar } from "notistack"; // Import useSnackbar
import { apiupdateUser } from "../../apis";
import { getCurrent } from "../../store/user/asyncAction";

const Fromupdateprofile = ({ onClose }) => {
  const { current } = useSelector((state) => state.user);
  const dispatch = useDispatch();
  const {
    register,
    formState: { errors },
    handleSubmit,
    reset,
  } = useForm();

  const { enqueueSnackbar } = useSnackbar(); // Initialize notistack

  useEffect(() => {
    reset({
      firstname: current?.firstname,
      lastname: current?.lastname,
      mobile: current?.mobile,
      email: current?.email,
      avatar: current?.avatar,
      address: current?.address,
    });
  }, [current, reset]);

  const handleUpdateinfor = async (data) => {
    const formData = new FormData();
    if (data.avatar.length > 0) formData.append("avatar", data.avatar[0]);
    delete data.avatar;
    for (let i of Object.entries(data)) formData.append(i[0], i[1]);

    const response = await apiupdateUser(formData);
    console.log();
    if (response.success) { 
      dispatch(getCurrent());
      enqueueSnackbar(response.mes, { variant: "success" }); 
    } else {
      enqueueSnackbar(response.mes, { variant: "error" }); 
    }
  };

  return (
    <div className="flex w-full fixed top-[30px] z-99 justify-center from">
      <div className="mt-10 p-5 bg-[#F3F3F7] rounded-lg w-[70%] justify-center items-center flex flex-col">
        <div className="flex justify-between items-center w-full">
          <p>Update information</p>
          <button
            className="mt-4  bg-gradient-to-r from-[#0f1c92] to-[#0e28d1]  text-white px-4 py-2 rounded-3xl"
            onClick={onClose}>
            Close
          </button>
        </div>
        <form
          onSubmit={handleSubmit(handleUpdateinfor)}
          className="w-[100%] mx-auto flex flex-wrap py-8 gap-4">
          <div className="w-[45%]">
            <InputForm
              label="Firstname"
              register={register}
              errors={errors}
              id="firstname"
              validate={{
                required: "Need fill this field",
              }}
            />
          </div>
          <div className="w-[45%]">
            <InputForm
              label="Lastname"
              register={register}
              errors={errors}
              id="lastname"
              validate={{
                required: "Need fill this field",
              }}
            />
          </div>
          <div className="w-[45%]">
            <InputForm
              label="Email address"
              register={register}
              errors={errors}
              id="email"
              validate={{
                required: "Need fill this field",
                pattern: {
                  value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
                  message: "Email invalid",
                },
              }}
            />
          </div>
          <div className="w-[45%]">
            <InputForm
              label="Phone"
              register={register}
              errors={errors}
              id="mobile"
              validate={{
                required: "Need fill this field",
                pattern: {
                  value: /^[0-9 +\-()]+$/,
                  message: "Mobile number must be at least 10 digits long.",
                },
              }}
            />
          </div>
          <div className="w-[45%]">
            <InputForm
              label="Address"
              register={register}
              errors={errors}
              id="address"
              validate={{
                required: "Need fill this field",
              }}
            />
          </div>

          <div className="flex flex-col gap-2">
            <span className="font-medium">Profile images:</span>
            <label htmlFor="file">
              <img
                src={current?.avatar || avatar}
                alt="avatar"
                className="w-20 h-20 object-cover rounded-full"
              />
            </label>
            <input type="file" id="file" {...register("avatar")} hidden />
          </div>
          <Button type="submit">Update information</Button>
        </form>
      </div>
    </div>
  );
};

export default Fromupdateprofile;
