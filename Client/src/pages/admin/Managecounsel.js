import React, { useEffect, useState } from "react";
import { getallcounsel, apiUpdatecounsel } from "../../apis";
import { Button, Pagination } from "../../components";

const Managecounsel = () => {
  const [counsels, setCounsels] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [queries, setQueries] = useState({
    q: "",
  });

  // Fetch dữ liệu counsels
  useEffect(() => {
    const fetchCounsels = async () => {
      try {
        setLoading(true);
        const response = await getallcounsel();
        setCounsels(response.counsels);
        setLoading(false);
      } catch (err) {
        setError("Failed to load counsels");
        setLoading(false);
      }
    };

    fetchCounsels();
  }, [queries.q]);

  const handleUpdateStatus = async (id, newStatus) => {
    try {
      const updatedCounsel = await apiUpdatecounsel({ status: newStatus }, id);
      console.log("Updated Counsel Response:", updatedCounsel);

      if (updatedCounsel && updatedCounsel.success && updatedCounsel.counsel) {
        setCounsels((prev) =>
          prev.map((counsel) =>
            counsel._id === id
              ? { ...counsel, status: updatedCounsel.counsel.status }
              : counsel
          )
        );
      } else {
        alert("Failed to update status");
      }
    } catch (error) {
      console.error("Error during status update:", error);
      alert("Failed to update status");
    }
  };

  return (
    <div className="w-[85%]">
      <div className="w-full justify-center items-center flex flex-col">
        <div className="w-full border rounded-2xl bg-white p-5">
          <table className="rounded-3xl overflow-hidden w-full leading-10">
            <thead>
              <tr className="text-[13px]">
                <th>Number</th>
                <th>Name</th>
                <th>Phone</th>
                <th>Service</th>
                <th>Status</th>
              </tr>
            </thead>
            <tbody className="text-center">
              {counsels.map((counsel, idx) => (
                <tr
                  key={counsel._id} // Đảm bảo key là duy nhất
                  className="text-[13px] transition duration-300 ease-in-out transform hover:scale-105 focus:outline-none focus:ring-2 focus:ring-[#e0a96a] focus:ring-opacity-50">
                  <td className="text-center">{idx + 1}</td>
                  <td>{counsel.name}</td>
                  <td>{counsel.mobile}</td>
                  <td>{counsel.service}</td>
                  <td>
                    <select
                      value={counsel.status}
                      onChange={(e) => {
                        handleUpdateStatus(counsel._id, e.target.value); 
                      }}
                      className="p-2 rounded-2xl w-full text-[14px] px-4 bg-gradient-to-r from-[#979db6] to-gray-300">
                      <option value="Not consulted">Not consulted</option>
                      <option value="Consulted">Consulted</option>
                    </select>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <div className="w-full flex justify-end mt-5">
          <Pagination totalCount={counsels.length} />
        </div>
      </div>
    </div>
  );
};

export default Managecounsel;
