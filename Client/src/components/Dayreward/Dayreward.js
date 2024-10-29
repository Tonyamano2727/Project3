import React, { useEffect, useState } from "react";
import icons from "../../ultils/icons";
import { getallbooking } from "../../apis/booking";

const { RiMoneyDollarCircleLine } = icons;

const Dayreward = () => {
  const [totalToday, setTotalToday] = useState(0);
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchBookings = async () => {
    try {
      const data = await getallbooking();

      if (data.success) {
        setBookings(data.bookings);
        calculateTotal(data.bookings);
      } else {
        console.error("Failed to fetch bookings:", data.mes);
        setError(data.mes || "Failed to fetch bookings");
      }
    } catch (error) {
      console.error("Error fetching bookings:", error);
      setError(error.message || "Error fetching bookings");
    } finally {
      setLoading(false);
    }
  };

  const calculateTotal = (bookingsData) => {
    const today = new Date();
    const todayDate = today.toLocaleDateString("en-CA"); // Định dạng ngày hiện tại: YYYY-MM-DD

    const total = bookingsData.reduce((acc, booking) => {
      // Kiểm tra định dạng ngày từ API và so sánh với ngày hiện tại
      const bookingDate = new Date(booking.date).toLocaleDateString("en-CA");

      if (bookingDate === todayDate) {
        return acc + (booking.totalPrice || 0);
      }
      return acc;
    }, 0);

    setTotalToday(total);
  };

  useEffect(() => {
    fetchBookings();
  }, []);
  return (
    <div className="bg-white w-[28%] border flex flex-col p-5 rounded-2xl hover:mt-2 duration-200 ease-in-out">
      <h1 className="text-[17px] flex items-center gap-2">
        <span className="text-[30px] bg-[#ebfdc6] rounded-full p-2">
          <RiMoneyDollarCircleLine />
        </span>
        Rewards Today
      </h1>
      <>
        <p className="mt-[50px] text-[25px] font-semibold">
          {totalToday.toLocaleString()}
        </p>
        <span className="text-gray-500 text-[15px]">VND</span>
      </>
    </div>
  );
};

export default Dayreward;
