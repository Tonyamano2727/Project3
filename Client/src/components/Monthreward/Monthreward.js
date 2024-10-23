import React, { useEffect, useState } from "react";
import icons from "../../ultils/icons";
import { getallbooking } from "../../apis/booking";

const { SiMoneygram } = icons;

const Monthreward = () => {
  const [totalThisMonth, setTotalThisMonth] = useState(0);
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
    const currentMonth = today.getMonth();
    const currentYear = today.getFullYear();

    const total = bookingsData.reduce((acc, booking) => {
      const bookingDate = new Date(booking.date);

      if (
        bookingDate.getMonth() === currentMonth &&
        bookingDate.getFullYear() === currentYear
      ) {
        return acc + (booking.totalPrice || 0);
      }
      return acc;
    }, 0);

    setTotalThisMonth(total);
  };

  useEffect(() => {
    fetchBookings();
  }, []);

  return (
    <div className="bg-white w-[28%] border flex flex-col p-5 rounded-2xl hover:mt-2 duration-200 ease-in-out">
      <h1 className="text-[17px] flex items-center gap-2">
        <span className="text-[30px] bg-[#e0e0fe] rounded-full p-2">
          <SiMoneygram />
        </span>
        Rewards Month
      </h1>
      <>
        <p className="mt-[50px] text-[25px] font-semibold">
          {totalThisMonth.toLocaleString()}
        </p>
        <span className="text-gray-500 text-[15px]">VND</span>
      </>
    </div>
  );
};

export default Monthreward;
