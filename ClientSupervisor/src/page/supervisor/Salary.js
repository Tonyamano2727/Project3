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
  TextField,
  MenuItem,
  Select,
  InputLabel,
  FormControl,
} from "@mui/material";
import { apiGetemployee } from "../../api/supervisor";
import { apiGetAllSalaries, apiCalculateSalary } from "../../api/supervisor";

const Salary = () => {
  const [employees, setEmployees] = useState([]);
  const [salaries, setSalaries] = useState([]);
  const [selectedEmployee, setSelectedEmployee] = useState("");
  const [month, setMonth] = useState("");
  const [year, setYear] = useState("");
  const [loading, setLoading] = useState(false);

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
      alert("Vui lòng chọn nhân viên, tháng và năm.");
      return;
    }

    setLoading(true);

    try {
      const response = await apiCalculateSalary(selectedEmployee, {
        month,
        year,
      });
      if (response.success) {
        alert("Tính lương thành công!");
        fetchSalaries();
      } else {
        alert("Không thể tính lương.");
      }
    } catch (error) {
      alert("Có lỗi xảy ra khi tính lương.");
      console.error("Error calculating salary:", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ padding: "20px" }}>
      <h2>Salary Management</h2>

      <Paper style={{ padding: "20px", marginBottom: "20px" }}>
        <FormControl fullWidth margin="normal">
          <InputLabel>Chọn nhân viên</InputLabel>
          <Select
            value={selectedEmployee}
            onChange={(e) => setSelectedEmployee(e.target.value)}
            label="Chọn nhân viên"
          >
            {employees.map((employee) => (
              <MenuItem key={employee._id} value={employee._id}>
                {employee.name}
              </MenuItem>
            ))}
          </Select>
        </FormControl>

        <TextField
          label="Tháng"
          type="number"
          value={month}
          onChange={(e) => setMonth(e.target.value)}
          fullWidth
          margin="normal"
        />

        <TextField
          label="Năm"
          type="number"
          value={year}
          onChange={(e) => setYear(e.target.value)}
          fullWidth
          margin="normal"
        />

        <Button
          variant="contained"
          color="primary"
          onClick={handleCalculateSalary}
          disabled={loading}
        >
          {loading ? "Đang tính lương..." : "Tính lương"}
        </Button>
      </Paper>

      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Tên nhân viên</TableCell>
              <TableCell>Tháng</TableCell>
              <TableCell>Năm</TableCell>
              <TableCell>Lương cơ bản</TableCell>
              <TableCell>Hoa hồng</TableCell>
              <TableCell>Tổng lương</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {salaries.map((salary) => (
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
    </div>
  );
};

export default Salary;
