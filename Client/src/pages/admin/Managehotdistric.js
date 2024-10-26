import React, { useEffect, useState, useRef } from "react";
import { gethotdistric, updatehotdistric } from "../../apis"; // Đảm bảo API này được nhập đúng

const ManageHotDistrict = () => {
  const [hotDistricts, setHotDistricts] = useState([]); // Danh sách quận nóng
  const [loading, setLoading] = useState(true); // Trạng thái tải
  const [error, setError] = useState(null); // Lỗi
  const [editingId, setEditingId] = useState(null); // Theo dõi quận nào đang được chỉnh sửa
  const [newPercentage, setNewPercentage] = useState(0); // Giá trị phần trăm mới

  // Tạo ref cho input
  const inputRef = useRef(null);

  useEffect(() => {
    const fetchHotDistricts = async () => {
      try {
        const response = await gethotdistric();
        if (response.success) {
          setHotDistricts(response.data); // Lưu dữ liệu quận nóng
        } else {
          setError("Failed to fetch hot districts");
        }
      } catch (err) {
        setError("Error fetching hot districts: " + err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchHotDistricts();
  }, []);

  const handleUpdate = async (did) => {
    // Kiểm tra giá trị phần trăm hợp lệ
    if (newPercentage < 0 || newPercentage > 100) {
      console.log("Please enter a valid percentage between 0 and 100.");
      return;
    }

    // Tìm quận hiện tại từ danh sách
    const currentDistrict = hotDistricts.find((district) => district._id === did);

    // Kiểm tra xem có thay đổi gì không
    if (currentDistrict && currentDistrict.percentage === newPercentage) {
      console.log("No changes detected. Please modify the percentage to update.");
      setEditingId(null);
      return;
    }

    try {
      // Ghi log thông tin đang cập nhật
      console.log("Updating district:", did, "with percentage:", newPercentage);

      // Gọi API để cập nhật
      const response = await updatehotdistric({ percentage: newPercentage }, did); // Thay đổi thứ tự tham số
      console.log("API response:", response); // Ghi log phản hồi API

      // Kiểm tra phản hồi
      if (response && response.data && response.data.success) {
        // Cập nhật danh sách quận
        setHotDistricts((prev) =>
          prev.map((district) =>
            district._id === did ? { ...district, percentage: newPercentage } : district
          )
        );
        setEditingId(null);
        setNewPercentage(0);
      } else {
        console.log(
          "Update failed: " + (response.data ? response.data.message : "Unknown error")
        );
      }
    } catch (error) {
      // Ghi log lỗi
      console.log("Error updating district:", error.response ? error.response.data : error.message);
    }
  };

  // Hàm để bắt đầu chỉnh sửa và focus vào input
  const startEditing = (district) => {
    setEditingId(district._id); // Sửa đổi cho đúng ID
    setNewPercentage(district.percentage || 0);
    setTimeout(() => {
      if (inputRef.current) {
        inputRef.current.focus(); // Tự động focus vào input
      }
    }, 0);
  };

  return (
    <div>
      <h2>Manage Hot Districts</h2>
      {loading && <p>Loading...</p>}
      {error && <p className="text-red-500">{error}</p>}
      {hotDistricts.length > 0 && (
        <table className="min-w-full border-collapse border border-gray-200">
          <thead>
            <tr>
              <th className="border border-gray-300 p-4">District Name</th>
              <th className="border border-gray-300 p-4">Percentage</th>
              <th className="border border-gray-300 p-4">Created At</th>
              <th className="border border-gray-300 p-4">Actions</th>
            </tr>
          </thead>
          <tbody>
            {hotDistricts.map((district) => (
              <tr key={district._id}>
                <td className="border border-gray-300 p-4">{district.name}</td>
                <td className="border border-gray-300 p-4">
                  {editingId === district._id ? (
                    <div className="flex items-center">
                      <input
                        ref={inputRef} // Gán ref cho input
                        type="number"
                        value={newPercentage}
                        onChange={(e) => setNewPercentage(Number(e.target.value))}
                        className="border border-gray-300 p-1"
                        min="0"
                        max="100"
                        autoFocus
                      />
                      <button
                        onClick={() => handleUpdate(district._id)} // Gọi hàm cập nhật khi nhấn nút Save
                        className="text-blue-500 hover:underline ml-2"
                      >
                        Save
                      </button>
                    </div>
                  ) : (
                    <span
                      onClick={() => startEditing(district)} // Gọi hàm để bắt đầu chỉnh sửa
                      className="cursor-pointer">
                      {district.percentage || 0} %
                    </span>
                  )}
                </td>
                <td className="border border-gray-300 p-4">
                  {new Date(district.createdAt).toLocaleString()}
                </td>
                <td className="border border-gray-300 p-4">
                  <button
                    onClick={() => startEditing(district)} // Bắt đầu chỉnh sửa khi nhấn nút Update
                    className="text-blue-500 hover:underline">
                    Update
                  </button>
                  <button
                    // onClick={() => handleDelete(district._id)} // Bỏ comment và triển khai xóa nếu cần
                    className="text-red-500 hover:underline ml-4">
                    Delete
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
      {hotDistricts.length === 0 && !loading && <p>No hot districts found.</p>}
    </div>
  );
};

export default ManageHotDistrict;
