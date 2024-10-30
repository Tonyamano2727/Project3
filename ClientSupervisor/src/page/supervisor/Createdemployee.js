import React, { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const Createdemployee = () => {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    job: "",
    mobile: "",
    district: "",
    avatar: null,
  });

  const [jobCategories, setJobCategories] = useState([]);

  useEffect(() => {
    const fetchJobCategories = async () => {
      try {
        const response = await axios.get(
          "http://localhost:5000/api/categoryservice"
        );
        setJobCategories(response.data);
        console.log("Job Categories:", response.data); // Log danh sách job categories sau khi lấy
      } catch (error) {
        console.error("Error fetching job categories:", error);
      }
    };

    fetchJobCategories();
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
    console.log("Form Data:", { ...formData, [name]: value }); // Log dữ liệu form mỗi khi thay đổi
  };

  const handleFileChange = (e) => {
    setFormData({
      ...formData,
      avatar: e.target.files[0],
    });
    console.log("Avatar File Selected:", e.target.files[0]); // Log file avatar khi được chọn
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const data = new FormData();
    data.append("name", formData.name);
    data.append("email", formData.email);
    data.append("job", formData.job);
    data.append("mobile", formData.mobile);
    data.append("district", formData.district);
    if (formData.avatar) data.append("avatar", formData.avatar);

    console.log("Submitting Employee Data:", formData); // Log dữ liệu form trước khi gửi lên server

    try {
      const response = await axios.post(
        "http://localhost:5000/api/employee/registeremployee",
        data,
        {
          headers: {
            "Content-Type": "multipart/form-data",
            Authorization: `Bearer ${localStorage.getItem("accessToken")}`,
          },
        }
      );
      console.log("API Response:", response.data); // Log phản hồi từ API sau khi gửi

      if (response.data.success) {
        alert("Employee created successfully!");
        navigate("/manage-employee");
      }
    } catch (error) {
      console.error("Error creating employee:", error);
      alert("Failed to create employee.");
    }
  };

  return (
    <div>
      <h2>Create Employee</h2>
      <form onSubmit={handleSubmit} encType="multipart/form-data">
        <div>
          <label>Name:</label>
          <input
            type="text"
            name="name"
            value={formData.name}
            onChange={handleChange}
            required
          />
        </div>
        <div>
          <label>Email:</label>
          <input
            type="email"
            name="email"
            value={formData.email}
            onChange={handleChange}
            required
          />
        </div>
        <div>
          <label>Job:</label>
          <select
            name="job"
            value={formData.job}
            onChange={handleChange}
            required
          >
            <option value="">Select Job</option>
            {jobCategories.map((category) => (
              <option key={category._id} value={category.title}>
                {category.title}
              </option>
            ))}
          </select>
        </div>
        <div>
          <label>Mobile:</label>
          <input
            type="text"
            name="mobile"
            value={formData.mobile}
            onChange={handleChange}
            required
          />
        </div>
        <div>
          <label>District:</label>
          <input
            type="text"
            name="district"
            value={formData.district}
            onChange={handleChange}
            required
          />
        </div>
        <div>
          <label>Avatar:</label>
          <input type="file" name="avatar" onChange={handleFileChange} />
        </div>
        <button type="submit">Create Employee</button>
      </form>
    </div>
  );
};

export default Createdemployee;
