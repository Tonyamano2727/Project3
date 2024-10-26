import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import { formatMoney } from "../../ultils/helper";
import icons from "../../ultils/icons";
import {
  apiGetDetailsServices,
  createbooking,
  gethotdistric,
} from "../../apis";
import {
  districtsHCM,
  timeSlots,
  wardsByDistrict,
} from "../../ultils/contants";

const { IoCloseOutline } = icons;

const Frombooking = ({ handleCloseForm }) => {
  const { sid } = useParams();
  const [availableWards, setAvailableWards] = useState([]);
  const [servicePrice, setServicePrice] = useState(0);
  const [totalPrice, setTotalPrice] = useState(0);
  const [service, setService] = useState(null);
  const [isHotDistrict, setIsHotDistrict] = useState(false);
  const [percentage, setPercentage] = useState(0);
  const [notification, setNotification] = useState("");

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
        const response = await apiGetDetailsServices(sid);
        setService(response.service);
        setServicePrice(response.service.price);
      } catch (error) {
        console.error("Error fetching service details:", error);
      }
    };

    fetchServiceDetails();
  }, [sid]);

  const handleDistrictChange = async (e) => {
    const selectedDistrict = e.target.value;
    setFormData((prevData) => ({
      ...prevData,
      district: selectedDistrict,
      ward: "",
    }));
    setAvailableWards(wardsByDistrict[selectedDistrict] || []);

    try {
      const response = await gethotdistric(selectedDistrict);
      if (response.success && response.data.length > 0) {
        const hotDistrict = response.data.find(
          (district) => district.name === selectedDistrict
        );
        setIsHotDistrict(hotDistrict ? true : false);
        setPercentage(hotDistrict ? hotDistrict.percentage || 0 : 0); // Lấy giá trị % hoặc 0 nếu không có
      } else {
        setIsHotDistrict(false);
        setPercentage(0);
      }
    } catch (error) {
      console.error("Error checking hot district:", error);
      setIsHotDistrict(false);
      setPercentage(0);
    }
  };

  useEffect(() => {
    const updatedPrice = isHotDistrict
      ? servicePrice * (1 + (percentage || 0) / 100)
      : servicePrice;
    setTotalPrice(updatedPrice * formData.quantity);

    if (isHotDistrict) {
      setNotification(
        `The price has increased by ${
          percentage || 0
        }% because you selected a hot district.`
      );
    } else {
      setNotification("");
    }
  }, [formData.quantity, servicePrice, isHotDistrict, percentage]);

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
    <div className="flex w-full fixed top-[-30px] z-99 justify-center from">
      <div className="mt-10 p-5 bg-[#F3F3F7] rounded-lg w-[80%] justify-center items-center flex flex-col">
        <div className="flex justify-between items-center w-[91%] mb-4">
          <div className="text-black text-[20px] font-medium">
            {service?.category}
          </div>
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
            <h3>Total Price:</h3>
            <span>{`${formatMoney(totalPrice)} VNĐ`}</span>
          </div>
          {notification && (
            <div className="text-[13px] text-right w-[90%]">
              {notification}
            </div>
          )}
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
