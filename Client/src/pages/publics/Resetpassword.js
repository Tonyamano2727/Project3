import React, { useState } from "react";
import { Button } from "../../components";
import { useParams } from "react-router-dom";
import { apiResetPassword } from "../../apis/user";
import { useSnackbar } from 'notistack';
import loginfrom from "../../assets/loginfrom.mp4";

const Resetpassword = () => {
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState(""); // Thêm trạng thái cho mật khẩu xác nhận
  const { token } = useParams();
  const { enqueueSnackbar } = useSnackbar();

  const handleResetPassword = async () => {

    if (password !== confirmPassword) {
      enqueueSnackbar("Passwords do not match", { variant: 'error' });
      return;
    }

    const response = await apiResetPassword({ password, token });
    enqueueSnackbar(response.mes, { variant: response.success ? 'success' : 'error' });
  };

  return (
    <div className="bg-[#f3f4f8] flex justify-center flex-col items-center">
      <div className="items-center justify-center flex shadow-lg w-[80%] bg-white mt-10 mb-10 rounded-2xl">
        <div className="mt-5 mb-5 rounded-md flex items-center justify-center w-main gap-5">
          <div className="flex items-center justify-center w-[35%] bg-transparent">
            <video
              src={loginfrom}
              autoPlay
              loop
              muted
              className="w-full h-auto"
            />
          </div>
          <div className="flex w-[60%] flex-col">
            <h1 className="text-[25px] font-semibold text-black mb-8 leading-9">
              Please enter your password to recover your password
            </h1>
            <div className="flex flex-col w-full relative">
              <label className="text-[10px] absolute top-[-14px]" htmlFor="password">
                Enter your password:
              </label>
              <input
                type="password"
                id="password"
                className="p-2 mt-2 w-full placeholder:text-gray-500 placeholder:text-[14px] rounded-lg mb-2 border border-gray-300 focus:outline-none focus:border-transparent focus:ring-0"
                placeholder="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
            </div>
            <div className="flex flex-col w-full relative mt-10">
              <label className="text-[10px] absolute top-[-14px]" htmlFor="confirm-password">
                Confirm your password:
              </label>
              <input
                type="password"
                id="confirm-password"
                className="p-2 mt-2 w-full placeholder:text-gray-500 placeholder:text-[14px] rounded-lg mb-2 border border-gray-300 focus:outline-none focus:border-transparent focus:ring-0"
                placeholder="Confirm password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
              />
            </div>
            <div className="flex items-center justify-center mt-5">
              <Button name="Submit" handleOnclick={handleResetPassword} />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Resetpassword;
