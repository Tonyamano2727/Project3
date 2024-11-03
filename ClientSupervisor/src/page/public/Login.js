import React, { useState } from "react";
import { apiLoginSuperVisor } from "../../api/supervisor";
import path from "../../ultils/path";
import Snackbar from "@mui/material/Snackbar";
import MuiAlert from "@mui/material/Alert";

const styles = {
  loginContainer: {
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    minHeight: "100vh",
    backgroundColor: "#f7f8fa",
  },
  loginForm: {
    backgroundColor: "#ffffff",
    border: "1px solid #e2e8f0",
    padding: "2rem",
    borderRadius: "8px",
    width: "100%",
    maxWidth: "400px",
    boxShadow: "0 4px 8px rgba(0, 0, 0, 0.1)",
  },
  formTitle: {
    textAlign: "center",
    marginBottom: "1.5rem",
    color: "#333",
  },
  formGroup: {
    marginBottom: "1.5rem",
  },
  formLabel: {
    display: "block",
    fontWeight: 600,
    color: "#4a5568",
    marginBottom: "0.5rem",
  },
  formInput: {
    width: "100%",
    padding: "0.75rem",
    border: "1px solid #e2e8f0",
    borderRadius: "8px",
    fontSize: "1rem",
    color: "#333",
    backgroundColor: "#f7f7f9",
    transition: "border-color 0.3s ease",
  },
  submitButton: {
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
  errorMessage: {
    color: "#e53e3e",
    fontSize: "0.875rem",
    marginBottom: "1rem",
    textAlign: "center",
  },
};

const Alert = React.forwardRef(function Alert(props, ref) {
  return <MuiAlert elevation={6} ref={ref} variant="filled" {...props} />;
});

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [openSnackbar, setOpenSnackbar] = useState(false);

  const handleLogin = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      const response = await apiLoginSuperVisor({ email, password });

      if (response && response.success) {
        const { accessToken, refreshToken, supervisor } = response;
        console.log("Access Token:", accessToken);
        console.log("Supervisor Info:", supervisor);

        localStorage.setItem("accessToken", accessToken);
        localStorage.setItem("refreshToken", refreshToken);

        setOpenSnackbar(true);
        setTimeout(() => {
          window.location.href = path.SUPER_LAYOUT;
        }, 1500);
      } else {
        setError(response?.message || "Login failed");
      }
    } catch (err) {
      console.error("Login error:", err);
      setError("An error occurred. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleCloseSnackbar = () => {
    setOpenSnackbar(false);
  };

  return (
    <div style={styles.loginContainer}>
      <form onSubmit={handleLogin} style={styles.loginForm}>
        <h2 style={styles.formTitle}>Login</h2>
        {error && <p style={styles.errorMessage}>{error}</p>}
        <div style={styles.formGroup}>
          <label style={styles.formLabel}>Email</label>
          <input
            type="email"
            style={styles.formInput}
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
        </div>
        <div style={styles.formGroup}>
          <label style={styles.formLabel}>Password</label>
          <input
            type="password"
            style={styles.formInput}
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
        </div>
        <button type="submit" style={styles.submitButton} disabled={loading}>
          Login
        </button>
      </form>

      <Snackbar
        open={openSnackbar}
        autoHideDuration={1500}
        onClose={handleCloseSnackbar}
        anchorOrigin={{ vertical: "top", horizontal: "center" }}
      >
        <Alert onClose={handleCloseSnackbar} severity="success">
          Login successful!
        </Alert>
      </Snackbar>
    </div>
  );
};

export default Login;
