import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import { formatMoney } from "../../ultils/helper";
import icons from "../../ultils/icons";
import { fetchDistricts, fetchWards, fetchAddressSuggestions } from "../../apis/mapApi";
import {
  timeSlots,
} from "../../ultils/contants";
import {
  apiGetDetailsServices,
  createbooking,
  gethotdistric,
} from "../../apis";


const { IoCloseOutline } = icons;

const Frombooking = ({ handleCloseForm }) => {
  const { sid } = useParams();
  const [servicePrice, setServicePrice] = useState(0);
  const [totalPrice, setTotalPrice] = useState(0);
  const [service, setService] = useState(null);
  const [isHotDistrict, setIsHotDistrict] = useState(false);
  const [percentage, setPercentage] = useState(0);
  const [notification, setNotification] = useState("");
  const [districts, setDistricts] = useState([]);
  const [wards, setWards] = useState([]);

  const [suggestions, setSuggestions] = useState([]);

  

  // const googleMapsApiKey = "YOUR_GOOGLE_MAPS_API_KEY";
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

  // Lấy thông tin dịch vụ
  useEffect(() => {
    const fetchServiceDetails = async () => {
      try {
        const response = await apiGetDetailsServices(sid);
        setService(response.service);
        setServicePrice(response.service.price);
      } catch (error) {
        console.error("Error fetching service details:", error);
      }
    };
    fetchServiceDetails();
  }, [sid]);

 // Lấy danh sách quận trong Hồ Chí Minh
 useEffect(() => {
  const loadDistricts = async () => {
    try {
      const districts = await fetchDistricts();
      setDistricts(districts);
    } catch (err) {
      console.error(err.message);
    }
  };
  loadDistricts();
}, []);

// Lấy danh sách phường/xã khi chọn quận
const handleDistrictChange = async (e) => {
  const selectedDistrictId = e.target.value;
  const district = districts.find((d) => d.code.toString() === selectedDistrictId);

  if (!district) {
    setWards([]);
    setFormData((prev) => ({ ...prev, district: "", ward: "" }));
    setIsHotDistrict(false);
    setPercentage(0);
    return;
  }

  setFormData((prev) => ({
    ...prev,
    district: district.name,
    ward: "",
  }));

  try {
    const wards = await fetchWards(selectedDistrictId);
    setWards(wards);

    // Kiểm tra quận nóng
    const response = await gethotdistric(district.name);
    if (response.success) {
      const hotDistrict = response.data.find((d) => d.name === district.name);
      setIsHotDistrict(!!hotDistrict);
      setPercentage(hotDistrict ? hotDistrict.percentage : 0);
    } else {
      setIsHotDistrict(false);
      setPercentage(0);
    }
  } catch (err) {
    console.error(err.message);
  }
};


const handleAddressChange = async (e) => {
  const value = e.target.value;
  setFormData((prevData) => ({ ...prevData, address: value }));

  if (value.length > 2) {
    try {
      const predictions = await fetchAddressSuggestions(value);
      setSuggestions(predictions || []);
    } catch (err) {
      console.error(err.message);
    }
  } else {
    setSuggestions([]);
  }
};
const handleSuggestionClick = (suggestion) => {
  setFormData((prevData) => ({ ...prevData, address: suggestion.description }));
  setSuggestions([]); 
};
  
  useEffect(() => {
    const updatedPrice = isHotDistrict
      ? servicePrice * (1 + percentage / 100)
      : servicePrice;
    setTotalPrice(updatedPrice * formData.quantity);

    if (isHotDistrict) {
      setNotification(`Price increase ${percentage}% you choose hot district`);
    } else {
      setNotification("");
    }
  }, [formData.quantity, servicePrice, isHotDistrict, percentage]);

  // Xử lý nhập liệu
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({ ...prevData, [name]: value }));
  };

  // Xử lý gửi form
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.district || !formData.ward) {
      alert("Please select district and ward/commune.");
      return;
    }

    try {
      const response = await createbooking({
        ...formData,
        service: sid,
        totalPrice,
      });

      if (response.success) {
        alert("Booking success!");
        handleCloseForm();
      } else {
        alert("Booking failure: " + response.message);
      }
    } catch (error) {
      console.error("Error submitting booking:", error);
    }
  };

  const getAvailableTimeSlots = () => {
    if (!formData.date) return []; // Nếu chưa chọn ngày, không hiển thị time slot
  
    const selectedDate = new Date(formData.date); // Ngày được chọn
    const currentDate = new Date(); // Ngày hiện tại
  
    // Nếu ngày được chọn là hôm nay, lọc các time slot dựa trên giờ hiện tại
    if (selectedDate.toDateString() === currentDate.toDateString()) {
      return timeSlots.filter((slot) => {
        const [hours, minutes] = slot.value.split(":").map(Number); // Parse giờ và phút từ time slot
        const slotTime = new Date(); // Tạo thời gian cho time slot
        slotTime.setHours(hours, minutes, 0, 0);
  
        return slotTime > currentDate; // Chỉ lấy các time slot trong tương lai
      });
    }
  
    // Nếu ngày được chọn trong tương lai, hiển thị tất cả time slot
    if (selectedDate > currentDate) {
      return timeSlots;
    }
  
    // Nếu ngày trong quá khứ, không hiển thị time slot
    return [];
  };
  
  
  const today = new Date().toISOString().split("T")[0];
  const maxDate = new Date();
  maxDate.setDate(maxDate.getDate() + 10);
  const formattedMaxDate = maxDate.toISOString().split("T")[0];

  return (
    <div className="flex w-full fixed top-[-30px] z-99 justify-center from">
      <div className="mt-10 p-5 bg-[#F3F3F7] rounded-lg w-[80%] justify-center items-center flex flex-col">
        <div className="flex justify-between items-center w-[91%] mb-4">
          <div className="text-black text-[20px] font-medium">
            {service?.category}
          </div>
          <button
            className="text-[30px] font-extrabold"
            onClick={handleCloseForm}
          >
            <IoCloseOutline />
          </button>
        </div>
        <form
          className="flex flex-wrap justify-center gap-2"
          onSubmit={handleSubmit}
        >
   
          <div className="w-[45%]">
            <label className="block text-gray-700 text-sm font-bold mb-2">
            Customer name
            </label>
            <input
              type="text"
              name="customerName"
              value={formData.customerName}
              onChange={handleInputChange}
              className="w-full p-2 border border-gray-300 rounded"
              required
              placeholder="Customer name"
            />
          </div>
          {/* Email */}
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
          {/* Số điện thoại */}
          <div className="w-[45%]">
            <label className="block text-gray-700 text-sm font-bold mb-2">
            Phone number
            </label>
            <input
              type="number"
              name="phoneNumber"
              value={formData.phoneNumber}
              onChange={handleInputChange}
              className="w-full p-2 border border-gray-300 rounded"
              required
              placeholder="Phone number"
            />
          </div>
          {/* Địa chỉ */}
         {/* Address */}
<div className="w-[45%] relative">
  <label className="block text-gray-700 text-sm font-bold mb-2">
    Address
  </label>
  <input
    type="text"
    name="address"
    value={formData.address}
    onChange={handleAddressChange}
    className="w-full p-2 border border-gray-300 rounded"
    required
    placeholder="House number, street name"
  />
  {suggestions.length > 0 && (
    <ul className="absolute z-10 bg-white border border-gray-300 rounded w-full max-h-40 overflow-y-auto mt-1">
      {suggestions.map((suggestion, index) => (
        <li
          key={index}
          className="p-2 cursor-pointer hover:bg-gray-100"
          onClick={() => handleSuggestionClick(suggestion)}
        >
          {suggestion.description}
        </li>
      ))}
    </ul>
  )}
</div>

     {/* District */}
<div className="w-[45%]">
  <label className="block text-gray-700 text-sm font-bold mb-2">District</label>
  <select
    onChange={handleDistrictChange}
    className="w-full p-2 border border-gray-300 rounded"
    required
  >
    <option value="">-- Select District --</option>
    {districts.map((district) => (
      <option key={district.code} value={district.code}>
        {district.name}
      </option>
    ))}
  </select>
</div>

{/* Ward */}
<div className="w-[45%]">
  <label className="block text-gray-700 text-sm font-bold mb-2">Ward/Commune</label>
  <select
    onChange={(e) =>
      setFormData((prev) => ({ ...prev, ward: e.target.value }))
    }
    className="w-full p-2 border border-gray-300 rounded"
    required
  >
    <option value="">-- Select Ward/Commune --</option>
    {wards.map((ward) => (
      <option key={ward.code} value={ward.name}>
        {ward.name}
      </option>
    ))}
  </select>
</div>

          {/* Ngày */}
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
              min={today}
              max={formattedMaxDate}
            />
          </div>
          {/* Thời gian */}
          <div className="w-[45%]">
  <label className="block text-gray-700 text-sm font-bold mb-2">
    Time
  </label>
  <select
    name="timeSlot"
    value={formData.timeSlot}
    onChange={handleInputChange}
    className="w-full p-2 border border-gray-300 rounded"
    required
  >
    <option value="">-- Select time --</option>
    {getAvailableTimeSlots().map((slot) => (
      <option key={slot.value} value={slot.value}>
        {slot.label}
      </option>
    ))}
  </select>
</div>

          {/* Số lượng */}
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
          {/* Ghi chú */}
          <div className="w-[90%]">
            <label className="block text-gray-700 text-sm font-bold mb-2">
            Note
            </label>
            <textarea
              name="notes"
              value={formData.notes}
              onChange={handleInputChange}
              className="w-full p-2 border border-gray-300 rounded"
            />
          </div>
          {/* Tổng giá */}
          <div className="w-[90%] flex items-center justify-between">
            <h3>Total price:</h3>
            <span>{`${formatMoney(totalPrice)} VNĐ`}</span>
          </div>
          {notification && (
            <div className="text-[13px] text-right w-[90%]">
              {notification}
            </div>
          )}
          {/* Nút submit */}
          <button
            type="submit"
            className="bg-[#FFC704] p-3 rounded w-[90%] font-medium mt-2"
          >
            Book Now
          </button>
        </form>
      </div>
    </div>
  );
};

export default Frombooking;
