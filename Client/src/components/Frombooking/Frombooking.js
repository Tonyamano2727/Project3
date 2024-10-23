import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import { formatMoney } from "../../ultils/helper";
import icons from "../../ultils/icons";
import axios from "axios";
import {  apiGetDetailsServices , createbooking} from "../../apis"; 
const { IoCloseOutline } = icons;

const Frombooking = ({ handleCloseForm }) => {
  const { sid } = useParams();
  const [availableWards, setAvailableWards] = useState([]);
  const [servicePrice, setServicePrice] = useState(0);
  const [totalPrice, setTotalPrice] = useState(0);
  const [service, setservice] = useState(null);
  const wardsByDistrict = {
    "District 1": [
      "Ward Bến Nghé",
      "Ward Bến Thành",
      "Ward Nguyễn Thái Bình",
      "Ward Phạm Ngũ Lão",
      "Ward Cô Giang",
      "Ward Đa Kao",
      "Ward Nguyễn Cư Trinh",
      "Ward Tân Định",
    ],
    "District 2": [
      "Ward An Khánh",
      "Ward An Phú",
      "Ward Bình An",
      "Ward Bình Trưng Đông",
      "Ward Cát Lái",
      "Ward Thảo Điền",
      "Ward Thạnh Mỹ Lợi",
    ],
    "District 3": [
      "Ward 1",
      "Ward 2",
      "Ward 3",
      "Ward Võ Thị Sáu",
      "Ward Nguyễn Thái Bình",
      "Ward 6",
      "Ward 7",
    ],
    "District 4": ["Ward 1", "Ward 2", "Ward 3", "Ward 4", "Ward 5"],
    "District 5": ["Ward 1", "Ward 2", "Ward 3", "Ward 4", "Ward 5"],
    "District 6": ["Ward 1", "Ward 2", "Ward 3", "Ward 4"],
    "District 7": ["Ward Tân Hưng", "Ward Tân Kiểng", "Ward Tân Thuận Đông"],
    "District 8": ["Ward 1", "Ward 2", "Ward 3"],
    "District 9": [
      "Ward Long Bình",
      "Ward Long Phước",
      "Ward Long Thạnh Mỹ",
      "Ward Long Trường",
      "Ward Phú Hữu",
      "Ward Tân Phú",
      "Ward Tăng Nhơn Phú A",
      "Ward Tăng Nhơn Phú B",
      "Ward Trường Thạnh",
      "Ward Hiệp Phú",
      "Ward Phước Bình",
      "Ward Phước Long A",
      "Ward Phước Long B",
    ],
    "District 10": [
      "Ward 1",
      "Ward 2",
      "Ward 3",
      "Ward 4",
      "Ward 5",
      "Ward 6",
      "Ward 7",
      "Ward 8",
      "Ward 9",
      "Ward 10",
      "Ward 11",
      "Ward 12",
      "Ward 13",
      "Ward 14",
      "Ward 15",
    ],
    "District 11": [
      "Ward 1",
      "Ward 2",
      "Ward 3",
      "Ward 4",
      "Ward 5",
      "Ward 6",
      "Ward 7",
      "Ward 8",
      "Ward 9",
      "Ward 10",
      "Ward 11",
      "Ward 12",
      "Ward 13",
      "Ward 14",
      "Ward 15",
      "Ward 16",
    ],
    "District 12": [
      "Ward An Phú Đông",
      "Ward Đông Hưng Thuận",
      "Ward Hiệp Thành",
      "Ward Tân Chánh Hiệp",
      "Ward Tân Hưng Thuận",
      "Ward Tân Thới Hiệp",
      "Ward Tân Thới Nhất",
      "Ward Thạnh Lộc",
      "Ward Thạnh Xuân",
      "Ward Trung Mỹ Tây",
    ],
    "District Bình Thạnh": [
      "Ward 1",
      "Ward 2",
      "Ward 3",
      "Ward 5",
      "Ward 6",
      "Ward 7",
      "Ward 11",
      "Ward 12",
      "Ward 13",
      "Ward 14",
      "Ward 15",
      "Ward 17",
      "Ward 19",
      "Ward 21",
      "Ward 22",
      "Ward 24",
      "Ward 25",
      "Ward 26",
      "Ward 27",
      "Ward 28",
    ],
    "District Gò Vấp": [
      "Ward 1",
      "Ward 3",
      "Ward 4",
      "Ward 5",
      "Ward 6",
      "Ward 7",
      "Ward 8",
      "Ward 9",
      "Ward 10",
      "Ward 11",
      "Ward 12",
      "Ward 13",
      "Ward 14",
      "Ward 15",
      "Ward 16",
      "Ward 17",
    ],
    "District Phú Nhuận": [
      "Ward 1",
      "Ward 2",
      "Ward 3",
      "Ward 4",
      "Ward 5",
      "Ward 7",
      "Ward 8",
      "Ward 9",
      "Ward 10",
      "Ward 11",
      "Ward 12",
      "Ward 13",
      "Ward 14",
      "Ward 15",
      "Ward 17",
    ],
    "District Tân Bình": [
      "Ward 1",
      "Ward 2",
      "Ward 3",
      "Ward 4",
      "Ward 5",
      "Ward 6",
      "Ward 7",
      "Ward 8",
      "Ward 9",
      "Ward 10",
      "Ward 11",
      "Ward 12",
      "Ward 13",
      "Ward 14",
      "Ward 15",
    ],
    "District Tân Phú": [
      "Ward Hiệp Tân",
      "Ward Hòa Thạnh",
      "Ward Phú Thạnh",
      "Ward Phú Thọ Hòa",
      "Ward Phú Trung",
      "Ward Sơn Kỳ",
      "Ward Tân Quý",
      "Ward Tân Sơn Nhì",
      "Ward Tân Thành",
      "Ward Tây Thạnh",
    ],
    "District Thủ Đức": [
      "Ward Bình Chiểu",
      "Ward Bình Thọ",
      "Ward Hiệp Bình Chánh",
      "Ward Hiệp Bình Phước",
      "Ward Linh Chiểu",
      "Ward Linh Đông",
      "Ward Linh Tây",
      "Ward Linh Trung",
      "Ward Linh Xuân",
      "Ward Tam Bình",
      "Ward Tam Phú",
      "Ward Trường Thọ",
    ],
    "District Bình Chánh": [
      "Commune An Phú Tây",
      "Commune Bình Chánh",
      "Commune Bình Hưng",
      "Commune Bình Lợi",
      "Commune Đa Phước",
      "Commune Hưng Long",
      "Commune Lê Minh Xuân",
      "Commune Phạm Văn Hai",
      "Commune Phong Phú",
      "Commune Quy Đức",
      "Commune Tân Kiên",
      "Commune Tân Nhựt",
      "Commune Tân Quý Tây",
      "Commune Vĩnh Lộc A",
      "Commune Vĩnh Lộc B",
    ],
    "District Cần Giờ": [
      "Commune An Thới Đông",
      "Commune Bình Khánh",
      "Commune Long Hòa",
      "Commune Lý Nhơn",
      "Commune Tam Thôn Hiệp",
      "Commune Thạnh An",
    ],
    "District Củ Chi": [
      "Commune An Nhơn Tây",
      "Commune An Phú",
      "Commune Bình Mỹ",
      "Commune Hòa Phú",
      "Commune Nhuận Đức",
      "Commune Phạm Văn Cội",
      "Commune Phú Hòa Đông",
      "Commune Phú Mỹ Hưng",
      "Commune Phước Hiệp",
      "Commune Phước Thạnh",
      "Commune Phước Vĩnh An",
      "Commune Tân An Hội",
      "Commune Tân Phú Trung",
      "Commune Tân Thạnh Đông",
      "Commune Tân Thạnh Tây",
      "Commune Tân Thông Hội",
      "Commune Thái Mỹ",
      "Commune Trung An",
      "Commune Trung Lập Hạ",
      "Commune Trung Lập Thượng",
    ],
    "District Hóc Môn": [
      "Commune Bà Điểm",
      "Commune Đông Thạnh",
      "Commune Nhị Bình",
      "Commune Tân Hiệp",
      "Commune Tân Thới Nhì",
      "Commune Thới Tam Thôn",
      "Commune Trung Chánh",
      "Commune Xuân Thới Đông",
      "Commune Xuân Thới Sơn",
      "Commune Xuân Thới Thượng",
    ],
    "District Nhà Bè": [
      "Commune Hiệp Phước",
      "Commune Long Thới",
      "Commune Nhơn Đức",
      "Commune Phú Xuân",
      "Commune Phước Kiển",
      "Commune Phước Lộc",
    ],
  };
  const districtsHCM = [
    "District 1",
    "District 2",
    "District 3",
    "District 4",
    "District 5",
    "District 6",
    "District 7",
    "District 8",
    "District 9",
    "District 10",
    "District 11",
    "District 12",
    "District Bình Thạnh",
    "District Gò Vấp",
    "District Phú Nhuận",
    "District Tân Bình",
    "District Tân Phú",
    "District Thủ Đức",
    "District Bình Chánh",
    "District Cần Giờ",
    "District Củ Chi",
    "District Hóc Môn",
    "District Nhà Bè",
  ];

  const timeSlots = [
    { value: "", label: "Select a time slot" },
    { value: "06:00 - 07:00", label: "06:00 AM - 07:00 AM" },
    { value: "07:00 - 08:00", label: "07:00 AM - 08:00 AM" },
    { value: "08:00 - 09:00", label: "08:00 AM - 09:00 AM" },
    { value: "09:00 - 10:00", label: "09:00 AM - 10:00 AM" },
    { value: "10:00 - 11:00", label: "10:00 AM - 11:00 AM" },
    { value: "11:00 - 12:00", label: "11:00 AM - 12:00 PM" },
    { value: "12:00 - 01:00", label: "12:00 PM - 01:00 PM" },
    { value: "01:00 - 02:00", label: "01:00 PM - 02:00 PM" },
    { value: "02:00 - 03:00", label: "02:00 PM - 03:00 PM" },
    { value: "03:00 - 04:00", label: "03:00 PM - 04:00 PM" },
    { value: "04:00 - 05:00", label: "04:00 PM - 05:00 PM" },
    { value: "05:00 - 06:00", label: "05:00 PM - 06:00 PM" },
    { value: "06:00 - 07:00", label: "06:00 PM - 07:00 PM" },
  ];

  const handleDistrictChange = (e) => {
    const selectedDistrict = e.target.value;
    setFormData((prevData) => ({
      ...prevData,
      district: selectedDistrict,
      ward: "",
    }));
    setAvailableWards(wardsByDistrict[selectedDistrict] || []);
  };
  const [formData, setFormData] = useState({
    customerName: "",
    email: "",
    phoneNumber: "",
    address: "",
    district: "",
    ward: "",
    date: "",
    timeSlot: "",
    quantity: 1,
    notes: "",
  });

  useEffect(() => {
    const fetchServiceDetails = async () => {
      try {
        const response = await apiGetDetailsServices(sid)
        setservice(response.service);
        setServicePrice(response.service.price);
      } catch (error) {
        console.error("Error fetching service details:", error);
      }
    };

    fetchServiceDetails();
  }, [sid]);

  useEffect(() => {
    setTotalPrice(servicePrice * formData.quantity);
  }, [formData.quantity, servicePrice]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({ ...prevData, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await createbooking({
        ...formData,  
        service: sid,
        totalPrice,  
      });
      
      if (response.success) {
        alert("Booking successful!");
        handleCloseForm();  
      } else {
        alert("Booking failed: " + response.message);
      }
    } catch (error) {
      console.error("Error submitting booking:", error);
    }
  };  
  const today = new Date().toISOString().split("T")[0]; 
  const maxDate = new Date();
  maxDate.setDate(maxDate.getDate() + 10); 
  const formattedMaxDate = maxDate.toISOString().split("T")[0]; 
  return (
    <div className="flex w-full fixed top-[-30px] z-99  justify-center from">
      <div className="mt-10 p-5 bg-[#F3F3F7] rounded-lg  w-[80%] justify-center items-center flex flex-col">
        <div className="flex justify-between items-center w-[91%] mb-4">
          <div className="text-black text-[20px] font-medium">{service?.category}</div>
          <button
            className="text-[30px] font-extrabold"
            onClick={handleCloseForm}>
            <IoCloseOutline />
          </button>
        </div>

        <form
          className="flex flex-wrap justify-center gap-2"
          onSubmit={handleSubmit}>
          <div className="w-[45%]">
            <label className="block text-gray-700 text-sm font-bold mb-2">
              Name
            </label>
            <input
              type="text"
              name="customerName"
              value={formData.customerName}
              onChange={handleInputChange}
              className="w-full p-2 border border-gray-300 rounded"
              required
              placeholder="Name"
            />
          </div>
          <div className="w-[45%]">
            <label className="block text-gray-700 text-sm font-bold mb-2">
              Email
            </label>
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleInputChange}
              className="w-full p-2 border border-gray-300 rounded"
              required
              placeholder="Email"
            />
          </div>
          <div className="w-[45%]">
            <label className="block text-gray-700 text-sm font-bold mb-2">
              Phone Number
            </label>
            <input
              type="text"
              name="phoneNumber"
              value={formData.phoneNumber}
              onChange={handleInputChange}
              className="w-full p-2 border border-gray-300 rounded"
              required
              placeholder="Phone Number"
            />
          </div>
          <div className="w-[45%]">
            <label className="block text-gray-700 text-sm font-bold mb-2">
            House number and street name
            </label>
            <input
              type="text"
              name="address"
              value={formData.address}
              onChange={handleInputChange}
              className="w-full p-2 border border-gray-300 rounded"
              required
              placeholder="House number and street name"
            />
          </div>
          <div className="w-[45%]">
            <label className="block text-gray-700 text-sm font-bold mb-2">
              District
            </label>
            <select
              name="district"
              value={formData.district}
              onChange={handleDistrictChange}
              className="w-full p-3 border border-gray-300 rounded"
              required>
              <option value="">Select District</option>
              {districtsHCM.map((district, index) => (
                <option key={index} value={district}>
                  {district}
                </option>
              ))}
            </select>
          </div>
          <div className="w-[45%]">
            <label className="block text-gray-700 text-sm font-bold mb-2">
              Ward
            </label>
            <select
              name="ward"
              value={formData.ward}
              onChange={handleInputChange}
              className="w-full p-3 border border-gray-300 rounded"
              required
              disabled={!formData.district}>
              <option value="">Select Ward</option>
              {availableWards.map((ward, index) => (
                <option key={index} value={ward}>
                  {ward}
                </option>
              ))}
            </select>
          </div>

          <div className="w-[45%]">
            <label className="block text-gray-700 text-sm font-bold mb-2">
              Date
            </label>
            <input
              type="date"
              name="date"
              value={formData.date}
              onChange={handleInputChange}
              className="w-full p-2 border border-gray-300 rounded"
              required
              min={today} // Restrict past dates
              max={formattedMaxDate} // Restrict to 10 days in the future
            />
          </div>
          <div className="w-[45%]">
            <label className="block text-gray-700 text-sm font-bold mb-2">
              Time Slot
            </label>
            <select
              name="timeSlot"
              value={formData.timeSlot}
              onChange={handleInputChange}
              className="w-full p-3 border border-gray-300 rounded"
              required>
              {timeSlots.map((slot) => (
                <option key={slot.value} value={slot.value}>
                  {slot.label}
                </option>
              ))}
            </select>
          </div>
          <div className="w-[90%]">
            <label className="block text-gray-700 text-sm font-bold mb-2">
              Quantity
            </label>
            <input
              type="number"
              name="quantity"
              value={formData.quantity}
              onChange={handleInputChange}
              className="w-full p-2 border border-gray-300 rounded"
              min="1"
              required
            />
          </div>
          <div className="w-[90%]">
            <label className="block text-gray-700 text-sm font-bold mb-2">
              Notes
            </label>
            <textarea
              name="notes"
              value={formData.notes}
              onChange={handleInputChange}
              className="w-full p-2 border border-gray-300 rounded"
            />
          </div>
          <div className="w-[90%] flex items-center justify-between">
            <h3>Total Price : </h3>
            <span> {`${formatMoney(totalPrice)} VNĐ`} </span>
          </div>
          <button
            type="submit"
            className="bg-[#FFC704] p-3 rounded w-[90%] font-medium mt-2">
            Book Now
          </button>
        </form>
      </div>
    </div>
  );
};

export default Frombooking;
