import React, { useState } from "react";
import { apiLoginSuperVisor } from "../../api/supervisor"; // Import hàm API gọi đến login
import { useNavigate } from "react-router-dom"; // Import useNavigate để chuyển hướng
import path from "../../ultils/path";

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate(); // Khởi tạo useNavigate

  const handleLogin = async (e) => {
    e.preventDefault();
    setError(""); // Clear any previous error messages
    setLoading(true); // Set loading state

    try {
      
      const response = await apiLoginSuperVisor({ email, password });

  
      if (response && response.success) {
        // Đăng nhập thành công
        const { accessToken, refreshToken, supervisor } = response; 
        console.log("Access Token:", accessToken);
        console.log("Supervisor Info:", supervisor);

        // Lưu token vào localStorage
        localStorage.setItem("accessToken", accessToken); // Updated naming
        localStorage.setItem("refreshToken", refreshToken); // Updated naming

        // Redirect hoặc xử lý khác khi đăng nhập thành công
        alert("Login successful!");
        // Redirect to the new path
        window.location.href = path.SUPER_LAYOUT; // Redirect to your desired path
      } else {
        // Xử lý lỗi nếu login không thành công
        setError(response?.message || "Login failed");
      }
    } catch (err) {
      console.error("Login error:", err);
      setError("An error occurred. Please try again.");
    } finally {
      setLoading(false); 
    }
  };

  return (
    <div className="">
      <form onSubmit={handleLogin}>
        <div className="mb-4">
          <label className="">
            Email
          </label>
          <input
            type="email"
            className="w-full p-3 border rounded-lg"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
        </div>
        <div className="mb-4">
          <label className="">
            Password
          </label>
          <input
            type="password"
            className=""
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
        </div>

        <button
          type="submit"
          className=""
          disabled={loading}
        >
           Dô
        </button>
      </form>
    </div>
  );
};

export default Login;
