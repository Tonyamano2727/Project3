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
} from "@mui/material";
import { apiGetemployee } from "../../api/supervisor";
import { apiGetAllSalaries, apiCalculateSalary } from "../../api/supervisor";

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

  return (
    <div style={{ padding: "20px" }}>
      <Typography variant="h4" gutterBottom>
        Salary Management
      </Typography>

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

        <FormControl fullWidth margin="normal">
          <InputLabel>Tháng</InputLabel>
          <Select
            value={month}
            onChange={(e) => setMonth(e.target.value)}
            label="Tháng"
          >
            {months.map((month) => (
              <MenuItem key={month} value={month}>
                {month}
              </MenuItem>
            ))}
          </Select>
        </FormControl>

        <FormControl fullWidth margin="normal">
          <InputLabel>Năm</InputLabel>
          <Select
            value={year}
            onChange={(e) => setYear(e.target.value)}
            label="Năm"
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
          {loading ? "Đang tính lương..." : "Tính lương"}
        </Button>
      </Paper>

      <Paper style={{ padding: "20px", marginBottom: "20px" }}>
        <Typography variant="h6" gutterBottom>
          Lọc bảng lương
        </Typography>
        <FormControl fullWidth margin="normal">
          <InputLabel>Tháng</InputLabel>
          <Select
            value={filterMonth}
            onChange={(e) => setFilterMonth(e.target.value)}
            label="Tháng"
          >
            <MenuItem value="">Tất cả</MenuItem>
            {months.map((month) => (
              <MenuItem key={month} value={month}>
                {month}
              </MenuItem>
            ))}
          </Select>
        </FormControl>

        <FormControl fullWidth margin="normal">
          <InputLabel>Năm</InputLabel>
          <Select
            value={filterYear}
            onChange={(e) => setFilterYear(e.target.value)}
            label="Năm"
          >
            <MenuItem value="">Tất cả</MenuItem>
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
              <TableCell>Tên nhân viên</TableCell>
              <TableCell>Tháng</TableCell>
              <TableCell>Năm</TableCell>
              <TableCell>Lương cơ bản</TableCell>
              <TableCell>Hoa hồng</TableCell>
              <TableCell>Tổng lương</TableCell>
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
    </div>
  );
};

export default Salary;
