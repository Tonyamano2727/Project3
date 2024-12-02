import React, { useState, useEffect } from "react";
import { apiGetemployee, apiGetAllSalaries } from "../../api/supervisor";

const Salary = () => {
  const [employees, setEmployees] = useState([]);
  const [salaries, setSalaries] = useState([]);
  const [filteredSalaries, setFilteredSalaries] = useState([]);
  const [filterMonth, setFilterMonth] = useState("");
  const [filterYear, setFilterYear] = useState("");

  const months = Array.from({ length: 12 }, (_, i) => i + 1);
  const years = Array.from({ length: 7 }, (_, i) => 2024 + i);

  useEffect(() => {
    const fetchEmployees = async () => {
      try {
        const response = await apiGetemployee();
        if (response.success && response.staff) {
          setEmployees(response.staff);
          console.log(response);
        } else {
          console.warn("Invalid employee data:", response);
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
      console.log("Salaries API response:", response); // Log kết quả API
      if (response.success && response.data) {
        const uniqueSalaries = removeDuplicateSalaries(response.data);
        setSalaries(uniqueSalaries);
        setFilteredSalaries(uniqueSalaries);
      } else {
        console.warn("Invalid salary data:", response);
      }
    } catch (error) {
      console.error("Error fetching salaries:", error);
    }
  };

  const removeDuplicateSalaries = (salaryList) => {
    const uniqueEntries = [];
    const uniqueKeys = new Set();
    salaryList.forEach((salary) => {
      if (salary.employee && salary.employee._id) {
        const key = `${salary.employee._id}-${salary.month}-${salary.year}`;
        if (!uniqueKeys.has(key)) {
          uniqueKeys.add(key);
          uniqueEntries.push(salary);
        }
      } else {
        console.warn("Missing employee data:", salary);
      }
    });
    return uniqueEntries;
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
    <div className="p-6 bg-gray-100 w-full">
      <div className="bg-white p-4 shadow-md rounded-lg mb-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Month</label>
            <select
              value={filterMonth}
              onChange={(e) => setFilterMonth(e.target.value)}
              className="w-full border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
            >
              <option value="">All</option>
              {months.map((month) => (
                <option key={month} value={month}>
                  {month}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Year</label>
            <select
              value={filterYear}
              onChange={(e) => setFilterYear(e.target.value)}
              className="w-full border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
            >
              <option value="">All</option>
              {years.map((year) => (
                <option key={year} value={year}>
                  {year}
                </option>
              ))}
            </select>
          </div>
        </div>
      </div>

      <div className="bg-white shadow-md rounded-lg overflow-hidden">
        <table className="table-auto w-full">
          <thead className="bg-gray-200 text-gray-600 text-sm">
            <tr>
              <th className="px-4 py-2 text-left">Employee's Name</th>
              <th className="px-4 py-2 text-left">Month</th>
              <th className="px-4 py-2 text-left">Year</th>
              <th className="px-4 py-2 text-left">Base Salary</th>
              <th className="px-4 py-2 text-left">Commission</th>
              <th className="px-4 py-2 text-left">Total Salary</th>
            </tr>
          </thead>
          <tbody className="text-gray-700 text-sm">
            {filteredSalaries.map((salary) => (
              <tr key={salary._id} className="border-b">
                <td className="px-4 py-2">{salary.employee?.name || "Unknown"}</td>
                <td className="px-4 py-2">{salary.month}</td>
                <td className="px-4 py-2">{salary.year}</td>
                <td className="px-4 py-2">
                  {salary.baseSalary ? salary.baseSalary.toLocaleString() : "0"} VND
                </td>
                <td className="px-4 py-2">
                  {salary.commission ? salary.commission.toLocaleString() : "0"} VND
                </td>
                <td className="px-4 py-2">
                  {salary.totalSalary ? salary.totalSalary.toLocaleString() : "0"} VND
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default Salary;
