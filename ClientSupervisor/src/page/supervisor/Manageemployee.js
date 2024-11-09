import React, { useState, useEffect } from "react";
import { apiGetemployee, apiUpdateEmployee } from "../../api/supervisor";
import { FaEdit } from "react-icons/fa";
import Modal from "@mui/material/Modal";
import Box from "@mui/material/Box";
import TextField from "@mui/material/TextField";
import Button from "@mui/material/Button";

const styles = {
  container: {
    maxWidth: "500px",
    margin: "0 auto",
    padding: "2rem",
    backgroundColor: "#ffffff",
    borderRadius: "8px",
    boxShadow: "0 4px 8px rgba(0, 0, 0, 0.1)",
  },
  modalStyle: {
    position: "absolute",
    top: "50%",
    left: "50%",
    transform: "translate(-50%, -50%)",
    width: 400,
    bgcolor: "background.paper",
    border: "2px solid #000",
    boxShadow: 24,
    p: 4,
  },
};

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
      setError(error.message || "An error occurred while fetching employees.");
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
      [name]: value,
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

  useEffect(() => {
    fetchEmployees();
  }, []);

  return (
    <div className="w-full flex justify-center items-center flex-col bg-gray-100 p-6">
      <h1 className="text-2xl font-bold mb-6">Manage Employees</h1>
      {loading ? (
        <div className="text-lg">Loading...</div>
      ) : error ? (
        <div className="text-red-500">{error}</div>
      ) : (
        <div className="w-full border rounded-2xl bg-white p-5">
          <table className="w-full rounded-3xl overflow-hidden leading-10">
            <thead>
              <tr className="text-[13px] bg-gray-200">
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
                <tr key={employee._id} className="text-[11px] border-b">
                  <td className="p-2">
                    <img
                      className="w-16 h-16 object-cover rounded-full"
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
                  <td className="p-2">
                    <button
                      onClick={() => handleEdit(employee)}
                      className="text-blue-500 hover:text-blue-700"
                    >
                      <FaEdit />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      <Modal open={open} onClose={handleClose}>
        <Box sx={styles.modalStyle}>
          <h2>Update Employee's Info</h2>
          <TextField
            label="Name"
            name="name"
            value={selectedEmployee?.name || ""}
            onChange={handleInputChange}
            fullWidth
            margin="normal"
          />
          <TextField
            label="Email"
            name="email"
            value={selectedEmployee?.email || ""}
            onChange={handleInputChange}
            fullWidth
            margin="normal"
          />
          <TextField
            label="Job"
            name="job"
            value={selectedEmployee?.job || ""}
            onChange={handleInputChange}
            fullWidth
            margin="normal"
          />
          <TextField
            label="Mobile"
            name="mobile"
            value={selectedEmployee?.mobile || ""}
            onChange={handleInputChange}
            fullWidth
            margin="normal"
          />
          <TextField
            label="Base Salary"
            name="baseSalary"
            value={selectedEmployee?.baseSalary.toLocaleString() || ""}
            InputProps={{
              readOnly: false,
            }}
            fullWidth
            margin="normal"
          />
          <div className="mt-4">
            <label>Avatar:</label>
            <input type="file" onChange={handleAvatarChange} />
          </div>
          <div className="flex justify-end mt-4">
            <Button onClick={handleClose} color="secondary">
              Cancel
            </Button>
            <Button
              onClick={handleSave}
              variant="contained"
              color="primary"
              className="ml-2"
            >
              Save
            </Button>
          </div>
        </Box>
      </Modal>
    </div>
  );
};

export default Manageemployee;
