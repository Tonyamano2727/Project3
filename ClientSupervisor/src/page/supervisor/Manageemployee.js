import React, { useState, useEffect } from 'react';
import { apiGetemployee } from '../../api/supervisor'; 

const Manageemployee = () => {
  const [staff, setStaff] = useState([]); 
  const [loading, setLoading] = useState(true); 
  const [error, setError] = useState(null);


  const fetchEmployees = async () => {
    try {
      const response = await apiGetemployee(); 
      if (response.success) {
        setStaff(response.staff); 
      } else {
        setError(response.message || "No staff found"); // Handle API response error
      }
    } catch (error) {
      setError(error.message || "An error occurred while fetching employees."); // Handle any unexpected errors
    } finally {
      setLoading(false); // Set loading to false after the API call
    }
  };

  // Fetch employees when the component mounts
  useEffect(() => {
    fetchEmployees();
  }, []);

  return (
    <div className="w-full flex justify-center items-center flex-col bg-gray-100 p-6">
      <h1 className="text-2xl font-bold mb-6">Manage Employees</h1>
      {loading ? (
        <div className="text-lg">Loading...</div> // Loading indicator
      ) : error ? (
        <div className="text-red-500">{error}</div> // Display error message if any
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
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default Manageemployee;
