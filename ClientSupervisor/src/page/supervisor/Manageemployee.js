import React, { useState, useEffect } from "react";
import {
  apiGetemployee,
  apiUpdateEmployee,
  apiDeletedemployee,
} from "../../api/supervisor";
import { FaEdit } from "react-icons/fa";

const Manageemployee = () => {
  const [staff, setStaff] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [open, setOpen] = useState(false);
  const [selectedEmployee, setSelectedEmployee] = useState(null);
  const [avatarFile, setAvatarFile] = useState(null);

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

  useEffect(() => {
    fetchEmployees();
  }, []);

  return (
    <div className="w-full flex justify-center items-center flex-col p-6 border rounded-3xl bg-white">
      <table className="w-full rounded-3xl leading-10 ">
        <thead>
          <tr className="text-[13px] ">
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
          {staff.map((employee) => (
            <tr key={employee._id} className="text-[11px]">
              <td className="p-2 flex items-center">
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
              <td className="p-2">{employee.baseSalary}</td>
              <td className="p-2 gap-2">
                <button
                  className="text-blue-600 hover:text-blue-800 text-center "
                  onClick={() => handleEdit(employee)}>
                  <FaEdit />
                </button>
                <button
                  className="text-red-600 hover:text-red-800  text-center ml-3"
                  onClick={() => handleDelete(employee._id)}>
                   <FaEdit />
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      {open && (
        <div>
          <div>
            <h2>Edit Employee</h2>
            <div>
              <label>Name:</label>
              <input
                type="text"
                name="name"
                value={selectedEmployee?.name || ""}
                onChange={handleInputChange}
              />
            </div>
            <div>
              <label>Email:</label>
              <input
                type="email"
                name="email"
                value={selectedEmployee?.email || ""}
                onChange={handleInputChange}
              />
            </div>
            <div>
              <label>Job:</label>
              <input
                type="text"
                name="job"
                value={selectedEmployee?.job || ""}
                onChange={handleInputChange}
              />
            </div>
            <div>
              <label>Phone:</label>
              <input
                type="text"
                name="mobile"
                value={selectedEmployee?.mobile || ""}
                onChange={handleInputChange}
              />
            </div>
            <div>
              <label>Base Salary:</label>
              <input
                type="number"
                name="baseSalary"
                value={selectedEmployee?.baseSalary || ""}
                onChange={handleInputChange}
              />
            </div>
            <div>
              <label>Avatar:</label>
              <input
                type="file"
                accept="image/*"
                onChange={handleAvatarChange}
              />
            </div>
            <div style={{ marginTop: "1rem" }}>
              <button onClick={handleSave}>Save Changes</button>
              <button onClick={handleClose}>Cancel</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Manageemployee;
