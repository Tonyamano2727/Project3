import React, { useEffect, useState } from "react";
import { getallbooking } from "../../apis/booking";
import {
  Inputfields,
  Pagination,
  Selectinput,
  Frombookingdetails,
} from "../../components";
import { useSearchParams } from "react-router-dom";
import useDebounce from "../../hooks/useDebounce";
import { statusOptionsBooking, sortByDate } from "../../ultils/contants";

const ManageBooking = () => {
  const [invalidFields, setinvalidFields] = useState(null);
  const [bookings, setBookings] = useState([]);
  const [filteredBookings, setFilteredBookings] = useState([]);
  const [totalPrice, setTotalPrice] = useState(0);
  const [error, setError] = useState(null);
  const [counts, setCounts] = useState(0);
  const [params] = useSearchParams();
  const [queries, setqueries] = useState({});
  const [selectedStatus, setSelectedStatus] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("");
  const [categories, setCategories] = useState([]);
  const [selectedBooking, setSelectedBooking] = useState(null);
  const [selectedSortByDate, setSelectedSortByDate] = useState(
    sortByDate[0].value
  );

  const fetchBookings = async (params) => {
    try {
      const response = await getallbooking({
        ...params,
        limit: process.env.REACT_APP_PRODUCT_LIMIT,
        sort: selectedSortByDate,
      });

      if (response.success) {
        setBookings(response.bookings || []);
        setCategories(response.bookings.map((booking) => booking.category));
        calculateTotalPrice(response.bookings || []);
        setCounts(response.counts || 0);
      } else {
        setError(response.mes || "Failed to fetch bookings.");
      }
    } catch (err) {
      setError("Failed to fetch bookings.");
    }
  };

  const calculateTotalPrice = (bookingsData) => {
    const total = bookingsData.reduce((acc, booking) => {
      return acc + (booking.totalPrice || 0);
    }, 0);
    setTotalPrice(total);
  };
  useEffect(() => {
    if (selectedCategory) {
      setFilteredBookings(
        bookings.filter((booking) => booking.category === selectedCategory)
      );
    } else {
      setFilteredBookings(bookings);
    }
  }, [bookings, selectedCategory]);

  const queriesDebounce = useDebounce(queries.q, 800);

  useEffect(() => {
    const searchParams = Object.fromEntries([...params]);
    if (queriesDebounce) searchParams.q = queriesDebounce;
    if (selectedStatus && selectedStatus !== "All") {
      searchParams.status = selectedStatus;
    } else {
      delete searchParams.status;
    }
    fetchBookings(searchParams);
  }, [params, queriesDebounce, selectedStatus, selectedSortByDate]);

  return (
    <div className="w-[98%] ">
      <div className="flex w-full mb-4 flex-col">
        <Inputfields
          style={"inputsearcadmin"}
          nameKey={"q"}
          value={queries.q}
          setValue={setqueries}
          placeholder="Search name or email user..."
          isHidelabel
          setinvalidFields={setinvalidFields}
        />
        <div className="flex gap-5">
          <Selectinput
            className={"bg-gradient-to-r from-[#979db6] to-gray-300"}
            options={statusOptionsBooking}
            changeValue={setSelectedStatus}
            value={selectedStatus}
          />
          <Selectinput
            className={"bg-gradient-to-r from-[#979db6] to-gray-300"}
            options={[...new Set(categories)].map((category) => ({
              value: category,
              text: category,
            }))}
            changeValue={setSelectedCategory}
            value={selectedCategory}
          />
          <Selectinput
            className={"bg-gradient-to-r from-[#979db6] to-gray-300"}
            options={sortByDate}
            changeValue={setSelectedSortByDate}
            value={selectedSortByDate}
          />
        </div>
      </div>
      <form className="w-[100%] border rounded-2xl bg-white p-5">
        <table className="rounded-3xl overflow-hidden w-full leading-10">
          <thead>
            <tr className="text-[13px]">
              <th className="">Customer Name</th>
              <th className="">Service</th>
              <th className="">Email</th>
              <th className="">Phone</th>
          
              <th className="">Date</th>
              <th className="">Time Slot</th>
              <th className="">Status</th>
              <th className="">Total Price</th>
              <th className="">Actions</th>
            </tr>
          </thead>
          <tbody className="text-center">
            {(selectedCategory ? filteredBookings : bookings).map((booking) => (
              <tr key={booking._id} className="text-[10px] border-b">
                <td>{booking.customerName}</td>
                <td>{booking.category}</td>
                <td>{booking.email}</td>
                <td>{booking.phoneNumber}</td>
             
                <td>{booking.date}</td>
                <td>{booking.timeSlot}</td>
                <td>{booking.status}</td>
                <td>{booking.totalPrice.toLocaleString()} VND</td>
                <td>
                  <button
                    type="button"
                    className="text-blue-500 hover:underline"
                    onClick={() => setSelectedBooking(booking)}>
                    Show
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </form>
      <div className="flex justify-between">
        <div className="mt-4 justify-end flex text-center w-[20%]">
          <h2 className="text-lg font-bold">
            Total : {totalPrice.toLocaleString()} VND
          </h2>
        </div>
        <div className="w-full flex justify-end mt-5">
          <Pagination totalCount={counts} />
        </div>
        {selectedBooking && (
          <Frombookingdetails
            booking={selectedBooking}
            onClose={() => setSelectedBooking(null)}
          />
        )}
      </div>
    </div>
  );
};

export default ManageBooking;
