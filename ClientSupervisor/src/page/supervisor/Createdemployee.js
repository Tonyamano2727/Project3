import React, { useState, useEffect } from "react";
import axios from "axios";
import Snackbar from "@mui/material/Snackbar";
import MuiAlert from "@mui/material/Alert";

const styles = {
  container: {
    maxWidth: "500px",
    margin: "0 auto",
    padding: "2rem",
    backgroundColor: "#ffffff",
    borderRadius: "8px",
    boxShadow: "0 4px 8px rgba(0, 0, 0, 0.1)",
  },
  title: {
    textAlign: "center",
    color: "#333",
    marginBottom: "1.5rem",
  },
  formGroup: {
    marginBottom: "0.5rem",
  },
  label: {
    display: "block",
    fontWeight: "600",
    color: "#4a5568",
    marginBottom: "0.5rem",
  },
  input: {
    width: "100%",
    padding: "0.75rem",
    border: "1px solid #e2e8f0",
    borderRadius: "8px",
    fontSize: "1rem",
    color: "#333",
    backgroundColor: "#f7f7f9",
  },
  select: {
    width: "100%",
    padding: "0.75rem",
    border: "1px solid #e2e8f0",
    borderRadius: "8px",
    fontSize: "1rem",
    color: "#333",
    backgroundColor: "#f7f7f9",
    marginBottom: "0.5rem",
  },
  button: {
    width: "100%",
    padding: "0.75rem",
    border: "none",
    borderRadius: "8px",
    backgroundColor: "#3182ce",
    color: "#ffffff",
    fontWeight: "bold",
    fontSize: "1rem",
    cursor: "pointer",
    transition: "background-color 0.3s ease",
  },
};

const Alert = React.forwardRef(function Alert(props, ref) {
  return <MuiAlert elevation={6} ref={ref} variant="filled" {...props} />;
});

const Createdemployee = () => {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    job: "",
    mobile: "",
    district: "",
    avatar: null,
    baseSalary: "",
  });
  const [jobCategories, setJobCategories] = useState([]);
  const [districts, setDistricts] = useState([]);
  const [snackbarData, setSnackbarData] = useState({
    open: false,
    message: "",
    severity: "success",
  });

  useEffect(() => {
    const fetchJobCategories = async () => {
      try {
        const response = await axios.get(
          "http://localhost:5000/api/categoryservice"
        );
        if (response.data.success && Array.isArray(response.data.categories)) {
          setJobCategories(response.data.categories);
        }
      } catch (error) {
        console.error("Error fetching job categories:", error);
      }
    };

    const fetchDistricts = async () => {
      try {
        const response = await axios.get(
          "http://localhost:5000/api/supervisor/districts",
          {
            headers: {
              Authorization: `Bearer ${localStorage.getItem("accessToken")}`,
            },
          }
        );
        if (response.data.success) {
          setDistricts(response.data.districts);
          if (response.data.districts && response.data.districts.length > 0) {
            setFormData({
              ...formData,
              district: response.data.districts[0],
            });
          }
        }
      } catch (error) {
        console.error("Error fetching districts:", error);
      }
    };

    fetchJobCategories();
    fetchDistricts();
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  const handleFileChange = (e) => {
    setFormData({
      ...formData,
      avatar: e.target.files[0],
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const selectedJobCategory = jobCategories.find(
      (category) => category._id === formData.job
    );

    const data = new FormData();
    data.append("name", formData.name);
    data.append("email", formData.email);
    data.append("job", selectedJobCategory ? selectedJobCategory.title : "");
    data.append("mobile", formData.mobile);
    data.append("district", formData.district);
    data.append("baseSalary", formData.baseSalary);
    data.append("avatar", formData.avatar);

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
      if (response.data.success) {
        setSnackbarData({
          open: true,
          message: "Employee created successfully",
          severity: "success",
        });

        setFormData({
          name: "",
          email: "",
          job: "",
          mobile: "",
          district: "",
          avatar: null,
          baseSalary: "",
        });
      }
    } catch (error) {
      const errorMessage =
        error.response?.data?.mes || "Failed to create employee.";
      setSnackbarData({
        open: true,
        message: errorMessage,
        severity: "error",
      });
    }
  };

  const handleCloseSnackbar = () => {
    setSnackbarData({ ...snackbarData, open: false });
  };

  return (
    <div style={styles.container}>
      <h2 style={styles.title}>Create New Employee</h2>
      <form onSubmit={handleSubmit}>
        <div style={styles.formGroup}>
          <label style={styles.label} htmlFor="name">
            Name
          </label>
          <input
            style={styles.input}
            type="text"
            id="name"
            name="name"
            value={formData.name}
            onChange={handleChange}
            required
          />
        </div>

        <div style={styles.formGroup}>
          <label style={styles.label} htmlFor="email">
            Email
          </label>
          <input
            style={styles.input}
            type="email"
            id="email"
            name="email"
            value={formData.email}
            onChange={handleChange}
            required
          />
        </div>

        <div style={styles.formGroup}>
          <label style={styles.label}>Job Category</label>
          <select
            name="job"
            style={styles.select}
            value={formData.job}
            onChange={handleChange}
          >
            <option value="">Select Job Category</option>
            {Array.isArray(jobCategories) && jobCategories.length > 0 ? (
              jobCategories.map((category) => (
                <option key={category._id} value={category._id}>
                  {category.title}
                </option>
              ))
            ) : (
              <option disabled>Loading...</option>
            )}
          </select>
        </div>

        <div style={styles.formGroup}>
          <label style={styles.label} htmlFor="mobile">
            Mobile
          </label>
          <input
            style={styles.input}
            type="text"
            id="mobile"
            name="mobile"
            value={formData.mobile}
            onChange={handleChange}
            required
          />
        </div>

        <div style={styles.formGroup}>
          <label style={styles.label} htmlFor="district">
            District
          </label>
          <select
            style={styles.select}
            id="district"
            name="district"
            value={formData.district}
            onChange={handleChange}
            required
          >
            {districts.map((district) => (
              <option key={district} value={district}>
                {district}
              </option>
            ))}
          </select>
        </div>

        <div style={styles.formGroup}>
          <label style={styles.label} htmlFor="avatar">
            Avatar
          </label>
          <input
            style={styles.input}
            type="file"
            id="avatar"
            name="avatar"
            onChange={handleFileChange}
          />
        </div>

        <div style={styles.formGroup}>
          <label style={styles.label} htmlFor="baseSalary">
            Base Salary
          </label>
          <input
            style={styles.input}
            type="number"
            id="baseSalary"
            name="baseSalary"
            value={formData.baseSalary}
            onChange={handleChange}
            required
          />
        </div>

        <button type="submit" style={styles.button}>
          Create Employee
        </button>
      </form>

      <Snackbar
        open={snackbarData.open}
        autoHideDuration={6000}
        onClose={handleCloseSnackbar}
      >
        <Alert
          onClose={handleCloseSnackbar}
          severity={snackbarData.severity}
          sx={{ width: "100%" }}
        >
          {snackbarData.message}
        </Alert>
      </Snackbar>
    </div>
  );
};

export default Createdemployee;
