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
  const [openSnackbar, setOpenSnackbar] = useState(false);
  const [isHovered, setIsHovered] = useState(false);

  const districts = ["District 11"];

  useEffect(() => {
    const fetchJobCategories = async () => {
      try {
        const response = await axios.get(
          "http://localhost:5000/api/categoryservice"
        );
        setJobCategories(response.data);
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
  };

  const handleFileChange = (e) => {
    setFormData({
      ...formData,
      avatar: e.target.files[0],
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const data = new FormData();
    data.append("name", formData.name);
    data.append("email", formData.email);
    data.append("job", formData.job);
    data.append("mobile", formData.mobile);
    data.append("district", formData.district);
    data.append("baseSalary", formData.baseSalary);
    if (formData.avatar) data.append("avatar", formData.avatar);

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
        setOpenSnackbar(true);
      }
    } catch (error) {
      console.error("Error creating employee:", error);
      alert("Failed to create employee.");
    }
  };

  const handleCloseSnackbar = () => {
    setOpenSnackbar(false);
  };

  return (
    <div style={styles.container}>
      <h2 style={styles.title}>Create Employee</h2>
      <form onSubmit={handleSubmit} encType="multipart/form-data">
        <div style={styles.formGroup}>
          <label style={styles.label}>Name:</label>
          <input
            type="text"
            name="name"
            style={styles.input}
            value={formData.name}
            onChange={handleChange}
            required
          />
        </div>
        <div style={styles.formGroup}>
          <label style={styles.label}>Email:</label>
          <input
            type="email"
            name="email"
            style={styles.input}
            value={formData.email}
            onChange={handleChange}
            required
          />
        </div>
        <div style={styles.formGroup}>
          <label style={styles.label}>Job:</label>
          <select
            name="job"
            style={styles.select}
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
        <div style={styles.formGroup}>
          <label style={styles.label}>Mobile:</label>
          <input
            type="text"
            name="mobile"
            style={styles.input}
            value={formData.mobile}
            onChange={handleChange}
            required
          />
        </div>
        <div style={styles.formGroup}>
          <label style={styles.label}>District:</label>
          <select
            name="district"
            style={styles.select}
            value={formData.district}
            onChange={handleChange}
            required
          >
            <option value="">Select District</option>
            {districts.map((district, index) => (
              <option key={index} value={district}>
                {district}
              </option>
            ))}
          </select>
        </div>
        <div style={styles.formGroup}>
          <label style={styles.label}>Avatar:</label>
          <input
            type="file"
            name="avatar"
            style={styles.input}
            onChange={handleFileChange}
          />
        </div>
        <div style={styles.formGroup}>
          <label style={styles.label}>Base Salary:</label>
          <input
            type="number"
            name="baseSalary"
            style={styles.input}
            value={formData.baseSalary}
            onChange={handleChange}
            onInput={(e) => {
              if (e.target.value > 4000000) {
                e.target.value = 4000000;
              }
            }}
            required
            max="4000000"
          />
        </div>
        <button
          type="submit"
          style={{
            ...styles.button,
            backgroundColor: isHovered ? "#2b6cb0" : "#3182ce",
          }}
          onMouseEnter={() => setIsHovered(true)}
          onMouseLeave={() => setIsHovered(false)}
        >
          Create Employee
        </button>
      </form>

      <Snackbar
        open={openSnackbar}
        autoHideDuration={1500}
        onClose={handleCloseSnackbar}
        anchorOrigin={{ vertical: "top", horizontal: "center" }}
      >
        <Alert onClose={handleCloseSnackbar} severity="success">
          Employee created successfully!
        </Alert>
      </Snackbar>
    </div>
  );
};

export default Createdemployee;
