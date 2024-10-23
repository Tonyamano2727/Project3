import React, { useState, useCallback, useEffect } from "react";
import { Inputfields, Button } from "../../components";
import { apiRegister, apiLogin, apiForgotPassword } from "../../apis/user";
import Swal from "sweetalert2";
import { useNavigate, useSearchParams } from "react-router-dom";
import path from "../../ultils/path";
import { login } from "../../store/user/userSlice";
import { useDispatch } from "react-redux";
import { useSnackbar } from "notistack";
import { validate } from "../../ultils/helper";
import loginfrom from "../../assets/loginfrom.mp4";

const Login = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [confirmPassword, setConfirmPassword] = useState("");
  const [payload, setpayload] = useState({
    email: "",
    password: "",
    firstname: "",
    lastname: "",
    mobile: "",
  });

  const [isRegister, setisRegister] = useState(false);
  const [isForgotpassword, setisForgotpassword] = useState(false);
  const [searchParams] = useSearchParams();
  const { enqueueSnackbar } = useSnackbar();

  const resetPayLoad = () => {
    setpayload({
      email: "",
      password: "",
      firstname: "",
      lastname: "",
      mobile: "",
    });
    setConfirmPassword("");
  };

  const [invalidFields, setinvalidFields] = useState([]);
  const [email, setEmail] = useState("");

  const handleForgotPassword = async () => {
    const response = await apiForgotPassword({ email });
    if (response.success) {
      enqueueSnackbar(response.mes, { variant: "success" });
    } else {
      enqueueSnackbar(response.mes, { variant: "info" });
    }
  };

  useEffect(() => {
    resetPayLoad();
  }, [isRegister]);

  const handleSubmit = useCallback(async () => {
    const { firstname, lastname, mobile, ...data } = payload;
    const invalids = isRegister
      ? validate(payload, setinvalidFields)
      : validate(data, setinvalidFields);

    if (invalids === 0) {
      if (isRegister) {
        if (payload.password !== confirmPassword) {
          enqueueSnackbar("Passwords do not match!", { variant: "error" });
          return;
        }

        const response = await apiRegister(payload);
        if (response.success) {
          enqueueSnackbar("Congratulations: " + response.mes, {
            variant: "success",
          });
          setisRegister(false);
          resetPayLoad();
        } else {
          enqueueSnackbar("Oops: " + response.mes, { variant: "error" }); // Hiển thị thông báo lỗi
        }
      } else {
        const rs = await apiLogin(data);
        if (rs.success) {
          dispatch(
            login({
              isLoggedIn: true,
              token: rs.Accesstoken,
              userData: rs.userData,
            })
          );
          if (searchParams.get("redirect")) {
            navigate(searchParams.get("redirect"));
            window.location.reload();
          } else {
            window.location.href = `/${path.HOME}`;
          }
        } else {
          Swal.fire("Oops", rs.mes, "Error");
        }
      }
    }
  }, [payload, isRegister, dispatch, confirmPassword, navigate, searchParams]);

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
          {isForgotpassword && (
            <div className="flex w-[60%] flex-col">
              <h1 className="text-[25px] font-semibold text-black mb-8 leading-9">
                Please enter your email to recover your password
              </h1>
              <div className="flex flex-col w-full relative">
                <label
                  className="text-[10px] absolute top-[-14px]"
                  htmlFor="email">
                  Enter your email:
                </label>

                <input
                  type="text"
                  id="email"
                  className="p-2 mt-2 w-full placeholder:text-gray-500 placeholder:text-[14px] rounded-lg mb-2 border border-gray-300 focus:outline-none focus:border-transparent focus:ring-0"
                  placeholder="email@gmail.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                />
                <div className="flex mt-5 gap-6">
                  <Button name="Submit" handleOnclick={handleForgotPassword} />
                  <Button
                    name="Back"
                    handleOnclick={() => setisForgotpassword(false)}
                  />
                </div>
              </div>
            </div>
          )}

          {!isForgotpassword && (
            <div className="flex flex-col w-[60%] text-center">
              <h1 className="text-[28px] font-semibold text-black mb-8">
                {isRegister ? "Create Account" : "Welcome Back !!!"}
              </h1>
              {isRegister && (
                <div className="w-full flex flex-wrap gap-2 ">
                  <div className="w-full flex flex-wrap gap-2 justify-between">
                    <div className="w-[49%]">
                      <Inputfields
                        value={payload.firstname}
                        setValue={setpayload}
                        nameKey="firstname"
                        invalidFields={invalidFields}
                        setinvalidFields={setinvalidFields}
                      />
                    </div>
                    <div className="w-[49%]">
                      <Inputfields
                        value={payload.lastname}
                        setValue={setpayload}
                        nameKey="lastname"
                        invalidFields={invalidFields}
                        setinvalidFields={setinvalidFields}
                      />
                    </div>
                  </div>
                  <div className="w-full">
                    <Inputfields
                      value={payload.mobile}
                      setValue={setpayload}
                      nameKey="mobile"
                      invalidFields={invalidFields}
                      setinvalidFields={setinvalidFields}
                    />
                  </div>
                </div>
              )}
              <Inputfields
                value={payload.email}
                setValue={setpayload}
                nameKey="email"
                type="email"
                invalidFields={invalidFields}
                setinvalidFields={setinvalidFields}
                style={"w-full"}
              />
              <Inputfields
                type="password"
                value={payload.password}
                setValue={setpayload}
                nameKey="password"
                invalidFields={invalidFields}
                setinvalidFields={setinvalidFields}
              />
              {isRegister && (
                <div className="flex flex-col w-full relative">
                  <label
                    className="text-[10px] absolute top-[-14px]"
                    htmlFor="confirm-password">
                    Confirm your password:
                  </label>
                  <input
                    type="password"
                    id="confirm-password"
                    className="p-2 mt-2 w-full placeholder:text-gray-500 placeholder:text-[14px] rounded-lg mb-2 border border-gray-300 focus:outline-none focus:border-transparent focus:ring-0"
                    placeholder="Confirm Password"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                  />
                </div>
              )}

              <Button
                name={isRegister ? "Register" : "Login"}
                handleOnclick={handleSubmit}
                fw
              />
              <div className="flex items-center justify-between my-2 w-full text-sm">
                {!isRegister && (
                  <span
                    onClick={() => setisForgotpassword(true)}
                    className="text-black-500 hover:underline cursor-pointer">
                    Forgot your account?
                  </span>
                )}
                {!isRegister && (
                  <span
                    onClick={() => setisRegister(true)}
                    className="text-black-500 hover:underline cursor-pointer">
                    Create account
                  </span>
                )}
                {isRegister && (
                  <div className="flex items-center justify-between w-full px-2">
                    <span
                      onClick={() => setisForgotpassword(true)}
                      className="text-black-500 hover:underline cursor-pointer">
                      Forgot your account?
                    </span>
                    <span
                      onClick={() => setisRegister(false)}
                      className="text-black-500 hover:underline cursor-pointer text-center">
                      Login
                    </span>
                  </div>
                )}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Login;
