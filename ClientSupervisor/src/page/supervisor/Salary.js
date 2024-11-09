import React, { useState, useEffect } from "react";
import {
  Button,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  MenuItem,
  Select,
  InputLabel,
  FormControl,
  Typography,
  Snackbar,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
} from "@mui/material";
import MuiAlert from "@mui/material/Alert";
import {
  apiGetemployee,
  apiGetAllSalaries,
  apiCalculateSalary,
} from "../../api/supervisor";

const Alert = React.forwardRef(function Alert(props, ref) {
  return <MuiAlert elevation={6} ref={ref} variant="filled" {...props} />;
});

const Salary = () => {
  const [employees, setEmployees] = useState([]);
  const [salaries, setSalaries] = useState([]);
  const [filteredSalaries, setFilteredSalaries] = useState([]);
  const [selectedEmployee, setSelectedEmployee] = useState("");
  const [month, setMonth] = useState("");
  const [year, setYear] = useState("");
  const [filterMonth, setFilterMonth] = useState("");
  const [filterYear, setFilterYear] = useState("");
  const [loading, setLoading] = useState(false);
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [dialogMessage, setDialogMessage] = useState("");
  const [snackbarSeverity, setSnackbarSeverity] = useState("success");

  const months = Array.from({ length: 12 }, (_, i) => i + 1);
  const years = Array.from({ length: 7 }, (_, i) => 2024 + i);

  useEffect(() => {
    const fetchEmployees = async () => {
      try {
        const response = await apiGetemployee();
        if (response.success) {
          setEmployees(response.staff);
        }
      } catch (error) {
        console.error("Error fetching employees:", error);
      }
    };
    fetchEmployees();
    fetchSalaries();
  }, []);

  const fetchSalaries = async () => {
    try {
      const response = await apiGetAllSalaries();
      if (response.success) {
        const uniqueSalaries = removeDuplicateSalaries(response.data);
        setSalaries(uniqueSalaries);
        setFilteredSalaries(uniqueSalaries);
      }
    } catch (error) {
      console.error("Error fetching salaries:", error);
    }
  };

  const removeDuplicateSalaries = (salaryList) => {
    const uniqueEntries = [];
    const uniqueKeys = new Set();
    salaryList.forEach((salary) => {
      const key = `${salary.employee._id}-${salary.month}-${salary.year}`;
      if (!uniqueKeys.has(key)) {
        uniqueKeys.add(key);
        uniqueEntries.push(salary);
      }
    });
    return uniqueEntries;
  };

  const handleCalculateSalary = async () => {
    if (!selectedEmployee || !month || !year) {
      setDialogMessage("Please select employee, month, and year!");
      setDialogOpen(true);
      return;
    }
    setLoading(true);
    try {
      const response = await apiCalculateSalary(selectedEmployee, {
        month,
        year,
      });
      if (response.success) {
        setSnackbarSeverity("success");
        setSnackbarOpen(true);
        fetchSalaries();
      } else {
        setSnackbarSeverity("error");
        setSnackbarOpen(true);
      }
    } catch (error) {
      setSnackbarSeverity("error");
      setSnackbarOpen(true);
      console.error("Error calculating salary:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleFilterChange = () => {
    const filtered = salaries.filter(
      (salary) =>
        (filterMonth ? salary.month === filterMonth : true) &&
        (filterYear ? salary.year === filterYear : true)
    );
    setFilteredSalaries(filtered);
  };

  useEffect(() => {
    handleFilterChange();
  }, [filterMonth, filterYear, salaries]);

  const handleSnackbarClose = () => setSnackbarOpen(false);
  const handleDialogClose = () => setDialogOpen(false);

  return (
    <div style={{ padding: "20px" }}>
      <Typography variant="h4" gutterBottom>
        Salary Management
      </Typography>

      <Paper style={{ padding: "20px", marginBottom: "20px" }}>
        <FormControl fullWidth margin="normal">
          <InputLabel>Select Employee</InputLabel>
          <Select
            value={selectedEmployee}
            onChange={(e) => setSelectedEmployee(e.target.value)}
            label="Select Employee"
          >
            {employees.map((employee) => (
              <MenuItem key={employee._id} value={employee._id}>
                {employee.name}
              </MenuItem>
            ))}
          </Select>
        </FormControl>

        <FormControl fullWidth margin="normal">
          <InputLabel>Month</InputLabel>
          <Select
            value={month}
            onChange={(e) => setMonth(e.target.value)}
            label="Month"
          >
            {months.map((month) => (
              <MenuItem key={month} value={month}>
                {month}
              </MenuItem>
            ))}
          </Select>
        </FormControl>

        <FormControl fullWidth margin="normal">
          <InputLabel>Year</InputLabel>
          <Select
            value={year}
            onChange={(e) => setYear(e.target.value)}
            label="Year"
          >
            {years.map((year) => (
              <MenuItem key={year} value={year}>
                {year}
              </MenuItem>
            ))}
          </Select>
        </FormControl>

        <Button
          variant="contained"
          color="primary"
          onClick={handleCalculateSalary}
          disabled={loading}
          style={{ marginTop: "20px" }}
        >
          {loading ? "Calculating Salary..." : "Calculate Salary"}
        </Button>
      </Paper>

      <Paper style={{ padding: "20px", marginBottom: "20px" }}>
        <Typography variant="h6" gutterBottom>
          Salary Filter
        </Typography>
        <FormControl fullWidth margin="normal">
          <InputLabel>Month</InputLabel>
          <Select
            value={filterMonth}
            onChange={(e) => setFilterMonth(e.target.value)}
            label="Month"
          >
            <MenuItem value="">All</MenuItem>
            {months.map((month) => (
              <MenuItem key={month} value={month}>
                {month}
              </MenuItem>
            ))}
          </Select>
        </FormControl>

        <FormControl fullWidth margin="normal">
          <InputLabel>Year</InputLabel>
          <Select
            value={filterYear}
            onChange={(e) => setFilterYear(e.target.value)}
            label="Year"
          >
            <MenuItem value="">All</MenuItem>
            {years.map((year) => (
              <MenuItem key={year} value={year}>
                {year}
              </MenuItem>
            ))}
          </Select>
        </FormControl>
      </Paper>

      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Employee's Name</TableCell>
              <TableCell>Month</TableCell>
              <TableCell>Year</TableCell>
              <TableCell>Base Salary</TableCell>
              <TableCell>Commission</TableCell>
              <TableCell>Total Salary</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {filteredSalaries.map((salary) => (
              <TableRow key={salary._id}>
                <TableCell>{salary.employee?.name}</TableCell>
                <TableCell>{salary.month}</TableCell>
                <TableCell>{salary.year}</TableCell>
                <TableCell>{salary.baseSalary.toLocaleString()} VND</TableCell>
                <TableCell>{salary.commission.toLocaleString()} VND</TableCell>
                <TableCell>{salary.totalSalary.toLocaleString()} VND</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>

      <Snackbar
        open={snackbarOpen}
        autoHideDuration={3000}
        onClose={handleSnackbarClose}
      >
        <Alert onClose={handleSnackbarClose} severity={snackbarSeverity}>
          {snackbarSeverity === "success"
            ? "Salary calculated successfully!"
            : "Failed to calculate salary!"}
        </Alert>
      </Snackbar>

      <Dialog open={dialogOpen} onClose={handleDialogClose}>
        <DialogTitle>Notification</DialogTitle>
        <DialogContent>
          <DialogContentText>{dialogMessage}</DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleDialogClose} color="primary">
            OK
          </Button>
        </DialogActions>
      </Dialog>
    </div>
  );
};

export default Salary;
