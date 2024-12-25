import React, { useState, useEffect } from "react";
import {
  apiGetemployee,
  apiUpdateEmployee,
  apiDeletedemployee,
} from "../../api/supervisor";
import { useSnackbar } from "notistack";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
} from "@mui/material";
import axios from "axios";

const Manageemployee = () => {
  const [staff, setStaff] = useState([]);
  const [, setLoading] = useState(true);
  const [, setError] = useState(null);
  const [open, setOpen] = useState(false);
  const [selectedEmployee, setSelectedEmployee] = useState(null);
  const [avatarFile, setAvatarFile] = useState(null);
  const [jobCategories, setJobCategories] = useState([]);
  const { enqueueSnackbar } = useSnackbar();
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [deleteEmployeeId, setDeleteEmployeeId] = useState(null);
  const [errors, setErrors] = useState({
    email: "",
    mobile: "",
    baseSalary: "",
  });

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

  const fetchJobCategories = async () => {
    try {
      const response = await axios.get(
        "https://project3-dq33.onrender.com/api/categoryservice"
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

  const openDeleteDialog = (id) => {
    setDeleteEmployeeId(id);
    setDeleteDialogOpen(true);
  };

  const handleEdit = (employee) => {
    setSelectedEmployee(employee);
    setAvatarFile(null);
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
    setSelectedEmployee(null);
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;

    let error = "";

    if (name === "email") {
      const emailRegex =
        /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|.(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
      error = !emailRegex.test(value) ? "Invalid email format" : "";
    }

    if (name === "mobile") {
      const phoneRegex = /^\d{10,11}$/;
      error = !phoneRegex.test(value) ? "Phone must be 10 or 11 digits" : "";
    }

    if (name === "baseSalary") {
      error = Number(value) < 0 ? "Base Salary cannot be negative" : "";
    }

    setErrors((prevErrors) => ({
      ...prevErrors,
      [name]: error,
    }));

    setSelectedEmployee({
      ...selectedEmployee,
      [name]: name === "baseSalary" ? Number(value) : value,
    });
  };

  const handleAvatarChange = (e) => {
    const file = e.target.files[0];
    setAvatarFile(file);
  };

  const handleSave = async () => {
    if (errors.email || errors.mobile || errors.baseSalary) {
      alert("Please fix validation errors before saving.");
      return;
    }

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
        enqueueSnackbar("Employee updated successfully!", {
          variant: "success",
        });
        setOpen(false);
        fetchEmployees();
      } else {
        enqueueSnackbar("Failed to update employee.", { variant: "error" });
      }
    } catch (error) {
      enqueueSnackbar("An error occurred while updating employee.", {
        variant: "error",
      });
    }
  };

  const handleDelete = async () => {
    try {
      const response = await apiDeletedemployee(deleteEmployeeId);
      if (response.success) {
        enqueueSnackbar("Employee deleted successfully!", {
          variant: "success",
        });
        fetchEmployees();
      } else {
        enqueueSnackbar(response.message || "Failed to delete employee.", {
          variant: "error",
        });
      }
    } catch (error) {
      enqueueSnackbar("An error occurred while deleting employee.", {
        variant: "error",
      });
    } finally {
      setDeleteDialogOpen(false);
      setDeleteEmployeeId(null);
    }
  };

  useEffect(() => {
    fetchEmployees();
    fetchJobCategories();
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
                  className="text-red-600 hover:text-red-800 text-center ml-3"
                  onClick={() => openDeleteDialog(employee._id)}
                >
                  Delete
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      {/* Dialog để xác nhận xóa */}
      <Dialog
        open={deleteDialogOpen}
        onClose={() => setDeleteDialogOpen(false)}
        aria-labelledby="delete-dialog-title"
        aria-describedby="delete-dialog-description"
      >
        <DialogTitle id="delete-dialog-title">Confirm Delete</DialogTitle>
        <DialogContent>
          Are you sure you want to delete this employee? This action cannot be
          undone.
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setDeleteDialogOpen(false)} color="primary">
            Cancel
          </Button>
          <Button onClick={handleDelete} color="secondary" autoFocus>
            Confirm
          </Button>
        </DialogActions>
      </Dialog>

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
                className={`h-8 border rounded-3xl px-4 w-full placeholder:text-gray-600 ${
                  errors.email ? "border-red-500" : ""
                } focus:outline-none focus:border focus:ring-0`}
              />
              {errors.email && (
                <p className="text-red-500 text-xs mt-1">{errors.email}</p>
              )}
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
                className={`h-8 border rounded-3xl px-4 w-full placeholder:text-gray-600 ${
                  errors.mobile ? "border-red-500" : ""
                } focus:outline-none focus:border focus:ring-0`}
              />
              {errors.mobile && (
                <p className="text-red-500 text-xs mt-1">{errors.mobile}</p>
              )}
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
                className={`h-8 border rounded-3xl px-4 w-full placeholder:text-gray-600 ${
                  errors.baseSalary ? "border-red-500" : ""
                } focus:outline-none focus:border focus:ring-0`}
              />
              {errors.baseSalary && (
                <p className="text-red-500 text-xs mt-1">{errors.baseSalary}</p>
              )}
            </div>

            {/* Avatar */}
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
