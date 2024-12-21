import React, { useState, useEffect } from "react";
import {
  apiGetemployee,
  apiUpdateEmployee,
  apiDeletedemployee,
} from "../../api/supervisor";
import { FaEdit } from "react-icons/fa";
import axios from "axios";

const Manageemployee = () => {
  const [staff, setStaff] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [open, setOpen] = useState(false);
  const [selectedEmployee, setSelectedEmployee] = useState(null);
  const [avatarFile, setAvatarFile] = useState(null);
  const [jobCategories, setJobCategories] = useState([]);

  // Fetch employees
  const fetchEmployees = async () => {
    try {
      const response = await apiGetemployee();
      if (response.success) {
        setStaff(response.staff);
      } else {
        setError(response.message || "No staff found");
      }
    } catch (error) {
      setError(
        error.message || "An error occurred while fetching employee data."
      );
    } finally {
      setLoading(false);
    }
  };

  // Fetch job categories
  const fetchJobCategories = async () => {
    try {
      const response = await axios.get(
        "http://13.229.115.93:5000/api/categoryservice"
      );
      if (response.data.success) {
        setJobCategories(
          response.data.categories.map((job) => ({
            id: job._id,
            value: job.title,
            text: job.title,
          }))
        );
      }
    } catch (error) {
      console.error("Error loading job categories:", error);
    }
  };

  // Handle editing employee
  const handleEdit = (employee) => {
    setSelectedEmployee(employee);
    setAvatarFile(null);
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
    setSelectedEmployee(null);
  };

  // Handle input changes for employee info
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setSelectedEmployee({
      ...selectedEmployee,
      [name]: name === "baseSalary" ? Number(value) : value,
    });
  };

  // Handle avatar change
  const handleAvatarChange = (e) => {
    const file = e.target.files[0];
    setAvatarFile(file);
  };

  // Save updated employee info
  const handleSave = async () => {
    const formData = new FormData();
    formData.append("name", selectedEmployee.name);
    formData.append("email", selectedEmployee.email);
    formData.append("job", selectedEmployee.job);
    formData.append("mobile", selectedEmployee.mobile);
    formData.append("baseSalary", selectedEmployee.baseSalary);

    if (avatarFile) {
      formData.append("avatar", avatarFile);
    }

    try {
      const response = await apiUpdateEmployee(selectedEmployee._id, formData);
      if (response.success) {
        setOpen(false);
        fetchEmployees();
      } else {
        alert("Failed to update employee");
      }
    } catch (error) {
      alert("An error occurred while updating employee.");
    }
  };

  // Handle employee deletion
  const handleDelete = async (id) => {
    if (window.confirm("Are you sure you want to delete this employee?")) {
      try {
        const response = await apiDeletedemployee(id);
        if (response.success) {
          alert("Employee deleted successfully");
          fetchEmployees();
        } else {
          alert(response.message);
        }
      } catch (error) {
        alert("An error occurred while deleting the employee.");
      }
    }
  };

  // Fetch data on component mount
  useEffect(() => {
    fetchEmployees();
    fetchJobCategories(); // Fetch job categories
  }, []);

  return (
    <div className="w-full flex justify-center items-center flex-col p-6 border rounded-3xl bg-white mt-8">
      <table className="w-full rounded-3xl leading-10 ">
        <thead>
          <tr className="text-[13px] ">
            <th className="p-2">Number</th>
            <th className="p-2">Avatar</th>
            <th className="p-2">Name</th>
            <th className="p-2">Job</th>
            <th className="p-2">Email</th>
            <th className="p-2">Phone</th>
            <th className="p-2">Base Salary</th>
            <th className="p-2">Action</th>
          </tr>
        </thead>
        <tbody className="text-center">
          {staff.map((employee, index) => (
            <tr key={employee._id} className="text-[11px]">
              <td className="p-2">{index + 1}</td>
              <td className="p-2 flex items-center justify-center">
                <img
                  className="h-[50px] w-[50px] object-cover rounded-full"
                  src={employee.avatar}
                  alt={employee.name}
                />
              </td>
              <td className="p-2">{employee.name}</td>
              <td className="p-2">{employee.job}</td>
              <td className="p-2">{employee.email}</td>
              <td className="p-2">{employee.mobile}</td>
              <td className="p-2">
                {employee.baseSalary.toLocaleString()} VND
              </td>
              <td className="p-2 gap-2">
                <button
                  className="text-blue-600 hover:text-blue-800 text-center "
                  onClick={() => handleEdit(employee)}
                >
                  Update
                </button>
                <button
                  className="text-red-600 hover:text-red-800  text-center ml-3"
                  onClick={() => handleDelete(employee._id)}
                >
                  Deleted
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      {open && (
        <div className="fixed inset-0 flex items-center justify-center bg-gray-800 bg-opacity-50 z-50 ">
          <div className="bg-white rounded-lg shadow-lg w-full max-w-lg p-8">
            <h2 className="text-2xl font-bold text-center ">Edit Employee</h2>

            {/* Name */}
            <div>
              <label className="block text-sm font-semibold text-gray-700 p-1 ">
                Name:
              </label>
              <input
                type="text"
                name="name"
                value={selectedEmployee?.name || ""}
                onChange={handleInputChange}
                className="h-8 border rounded-3xl px-4 w-full placeholder:text-gray-600  focus:outline-none focus:border focus:ring-0"
              />
            </div>

            {/* Email */}
            <div>
              <label className="block text-sm font-semibold text-gray-700 p-1">
                Email:
              </label>
              <input
                type="email"
                name="email"
                value={selectedEmployee?.email || ""}
                onChange={handleInputChange}
                className="h-8 border rounded-3xl px-4 w-full placeholder:text-gray-600  focus:outline-none focus:border focus:ring-0"
              />
            </div>

            {/* Job Category */}
            <div>
              <label className="block text-sm font-semibold text-gray-700 p-1">
                Job Category:
              </label>
              <select
                name="job"
                value={selectedEmployee?.job || ""}
                onChange={handleInputChange}
                className="h-8 border rounded-3xl px-4 w-full placeholder:text-gray-600  focus:outline-none focus:border focus:ring-0"
              >
                <option value="">Select Job Category</option>
                {jobCategories.map((job) => (
                  <option key={job.id} value={job.value}>
                    {job.text}
                  </option>
                ))}
              </select>
            </div>

            {/* Phone */}
            <div>
              <label className="block text-sm font-semibold text-gray-700 p-1">
                Phone:
              </label>
              <input
                type="text"
                name="mobile"
                value={selectedEmployee?.mobile || ""}
                onChange={handleInputChange}
                className="h-8 border rounded-3xl px-4 w-full placeholder:text-gray-600  focus:outline-none focus:border focus:ring-0"
              />
            </div>

            {/* Base Salary */}
            <div>
              <label className="block text-sm font-semibold text-gray-700 p-1">
                Base Salary:
              </label>
              <input
                type="number"
                name="baseSalary"
                value={selectedEmployee?.baseSalary || ""}
                onChange={handleInputChange}
                className="h-8 border rounded-3xl px-4 w-full placeholder:text-gray-600  focus:outline-none focus:border focus:ring-0"
              />
            </div>

            <div>
              <label className="block text-sm font-semibold text-gray-700 p-1">
                Avatar:
              </label>
              <input
                type="file"
                accept="image/*"
                onChange={handleAvatarChange}
                className="mt-2 p-2 border border-gray-300 rounded-lg w-full"
              />
            </div>

            <div className="mt-6 flex flex-col">
              <button
                onClick={handleSave}
                className="bg-blue-500 text-white p-1 rounded-lg hover:bg-blue-600 transition duration-200"
              >
                Save Changes
              </button>
              <button
                onClick={handleClose}
                className="bg-gray-500 text-white p-1 rounded-lg hover:bg-gray-600 transition duration-200 mt-5"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Manageemployee;
