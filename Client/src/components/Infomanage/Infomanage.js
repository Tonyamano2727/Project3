import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";

const Infomanage = () => {
  const [supervisors, setSupervisors] = useState([]);
  const [supervisorCount, setSupervisorCount] = useState(0);
  const [users, setUsers] = useState([]);
  const [userCount, setUserCount] = useState(0);

  useEffect(() => {
    const fetchSupervisors = async () => {
      try {
        const response = await fetch(
          "http://localhost:5000/api/supervisor/getallsupervisor"
        );
        const data = await response.json();

        if (data.success) {
          setSupervisors(data.supervisor);
          setSupervisorCount(data.supervisor.length);
        } else {
          console.error("Failed to fetch supervisors:", data.mes);
        }
      } catch (error) {
        console.error("Error fetching supervisors:", error);
      }
    };
    console.log();
    const fetchUsers = async () => {
      try {
        const response = await fetch("http://localhost:5000/api/user/"); // Đường dẫn API của bạn
        const data = await response.json();

        if (data.success) {
          setUsers(data.users);
          setUserCount(data.counts); // Lấy tổng số lượng users từ response
        } else {
          console.error("Failed to fetch users:", data.mes);
        }
      } catch (error) {
        console.error("Error fetching users:", error);
      }
    };

    fetchSupervisors();
    fetchUsers();
  }, []);

  return (
    <div className="flex flex-col bg-white p-5 rounded-2xl w-[45%] border hover:mt-2 duration-200 ease-in-out">
      <h1 className="pl-4 text-[20px]">Manage Human Resources </h1>
      <table className="w-full mt-4">
        <thead>
          <tr className="text-left text-[15px] text-gray-500">
            <th className=" px-4 font-light ">Directory</th>
            <th className=" px-4 font-light">Quantity</th>
            <th className=" px-4 "></th>
          </tr>
        </thead>
        <tbody>
          <tr className="text-[13px]">
            <td className="py-2 px-4 font-medium">User</td>
            <td className="py-2 px-8 text-[14px] font-semibold">{userCount}</td>
            <td className="py-2 px-4"><Link>Manage</Link></td>
          </tr>
          <tr className="text-[13px]">
            <td className="py-2 px-4 font-medium">Supervise</td>
            <td className="py-2 px-8 text-[14px] font-semibold">{supervisorCount}</td>
            <td className="py-2 px-4"><Link>Manage</Link></td>
          </tr>
        </tbody>
      </table>
    </div>
  );
};

export default Infomanage;
