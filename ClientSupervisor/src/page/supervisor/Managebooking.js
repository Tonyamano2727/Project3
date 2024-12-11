import React, { useState, useEffect } from "react";
import {
  apiGetbooking,
  apiupdatebooking,
  apigetdetailbooking,
  apiGetemployee,
} from "../../api/supervisor";
import { FaEdit } from "react-icons/fa";

const Managebooking = () => {
  const [bookings, setBookings] = useState([]);
  const [filteredBookings, setFilteredBookings] = useState([]);
  const [employees, setEmployees] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [openModal, setOpenModal] = useState(false);
  const [selectedBooking, setSelectedBooking] = useState(null);
  const [updateError, setUpdateError] = useState(null);
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState("");
  const [snackbarSeverity, setSnackbarSeverity] = useState("success");
  const [filterStatus, setFilterStatus] = useState("");

  const fetchBookings = async () => {
    try {
      const response = await apiGetbooking();
      if (response.success) {
        const sortedBookings = response.bookings.sort(
          (a, b) => new Date(b.date) - new Date(a.date)
        );
        setBookings(sortedBookings);
        setFilteredBookings(sortedBookings);
      } else {
        setError(response.message || "No bookings found");
      }
    } catch (error) {
      setError(error.message || "An error occurred while fetching bookings.");
    } finally {
      setLoading(false);
    }
  };

  const fetchEmployees = async () => {
    try {
      const response = await apiGetemployee();
      if (response.success) {
        setEmployees(response.staff);
      } else {
        setError(response.message || "Failed to fetch employees");
      }
    } catch (error) {
      setError(error.message || "An error occurred while fetching employees.");
    }
  };

  useEffect(() => {
    fetchBookings();
    fetchEmployees();
  }, []);

  const fetchBookingDetails = async (bookingId) => {
    try {
      const response = await apigetdetailbooking(bookingId);
      if (response.success) {
        setSelectedBooking(response.data);
      } else {
        setError(response.message || "Failed to fetch booking details");
      }
    } catch (error) {
      setError(
        error.message || "An error occurred while fetching booking details."
      );
    }
  };

  const handleOpenModal = (bookingId) => {
    const booking = bookings.find((b) => b._id === bookingId);
    if (booking.status === "Completed" || booking.status === "Canceled") {
      setSnackbarMessage("Cannot update COMPLETED/CANCELED booking.");
      setSnackbarSeverity("warning");
      setSnackbarOpen(true);
      return;
    }
    fetchBookingDetails(bookingId);
    setOpenModal(true);
  };

  const handleCloseModal = () => {
    setOpenModal(false);
    setSelectedBooking(null);
    setUpdateError(null);
  };

  const handleSubmitUpdate = async (e) => {
    e.preventDefault();
    if (!selectedBooking) return;

    // Kiểm tra xem nhân viên đã được chọn chưa
    if (
      !selectedBooking.employeeDetails ||
      selectedBooking.employeeDetails.length === 0
    ) {
      setUpdateError("Please select an employee before updating.");
      return;
    }

    const currentDateTime = new Date();
    const bookingDateTime = new Date(
      `${selectedBooking.date} ${selectedBooking.timeSlot}`
    );
    if (
      selectedBooking.status === "Completed" &&
      bookingDateTime > currentDateTime
    ) {
      setUpdateError(
        "You cannot mark this booking as Completed before the scheduled date and time."
      );
      return;
    }

    try {
      const response = await apiupdatebooking(
        selectedBooking,
        selectedBooking._id
      );
      if (response.success) {
        setBookings((prevBookings) =>
          prevBookings.map((booking) =>
            booking._id === selectedBooking._id
              ? { ...booking, ...selectedBooking }
              : booking
          )
        );
        setFilteredBookings((prevBookings) =>
          prevBookings.map((booking) =>
            booking._id === selectedBooking._id
              ? { ...booking, ...selectedBooking }
              : booking
          )
        );
        setOpenModal(false);
        setSelectedBooking(null);
        setUpdateError(null);
        setSnackbarMessage("Booking updated successfully!");
        setSnackbarSeverity("success");
        setSnackbarOpen(true);
      } else {
        setSnackbarMessage(response.message || "Failed to update booking");
        setSnackbarSeverity("error");
        setSnackbarOpen(true);
      }
    } catch (error) {
      setSnackbarMessage(
        error.message || "An error occurred while updating the booking."
      );
      setSnackbarSeverity("error");
      setSnackbarOpen(true);
    }
  };

  const handleFilterChange = (status) => {
    setFilterStatus(status);
    if (status === "") {
      setFilteredBookings(bookings);
    } else {
      const filtered = bookings.filter((booking) => booking.status === status);
      setFilteredBookings(filtered);
    }
  };

  const handleQuantityChange = (e) => {
    const quantity = e.target.value;
    setSelectedBooking((prev) => ({
      ...prev,
      quantity: quantity,
      totalPrice: quantity * prev.price,
    }));
  };

  const handleEmployeeChange = (e) => {
    const selectedEmployeeId = e.target.value;
    const selectedEmployee = employees.find(
      (employee) => employee._id === selectedEmployeeId
    );
    setSelectedBooking((prev) => ({
      ...prev,
      employeeDetails: [
        { employeeId: selectedEmployeeId, name: selectedEmployee.name },
      ],
    }));
  };

  const handleSnackbarClose = () => {
    setSnackbarOpen(false);
  };

  return (
    <div className="w-full flex justify-center items-center flex-col bg-gray-100 mt-8">
      <div className="w-full mb-8">
        <select
          value={filterStatus}
          onChange={(e) => handleFilterChange(e.target.value)}
          className="bg-gradient-to-r from-[#979db6] to-gray-300 p-2 rounded-full  w-full text-[14px]  px-4">
          <option value="">All Status</option>
          <option value="Pending">Pending</option>
          <option value="Confirmed">Confirmed</option>
          <option value="In-progress">In-progress</option>
          <option value="Completed">Completed</option>
          <option value="Canceled">Canceled</option>
        </select>
      </div>
      <table className=" border bg-white rounded-3xl overflow-hidden w-full leading-10">
        <thead>
          <tr className="text-[13px] text-center">
            <th>Name</th>
            <th>Service</th>
            <th>Email</th>
            <th>Phone</th>
            <th>Address</th>
            <th>Date</th>
            <th>Time Slot</th>
            <th>Employee</th>
            <th>Status</th>
            <th>Total Price</th>
            <th>Action</th>
          </tr>
        </thead>
        <tbody className="text-center">
          {filteredBookings.map((booking) => (
            <tr key={booking._id} className="text-[10px] border-b">
              <td className="p-2">{booking.customerName}</td>
              <td className="p-2">{booking.category}</td>
              <td className="p-2">{booking.email}</td>
              <td className="p-2">{booking.phoneNumber}</td>
              <td className="p-2">{booking.address}</td>
              <td className="p-2">{booking.date}</td>
              <td className="p-2">{booking.timeSlot}</td>
              <td className="p-2">
                {booking.employeeDetails?.map((e) => e.name).join(", ")}
              </td>
              <td className="p-2">{booking.status}</td>
              <td className="p-2">{booking.totalPrice}</td>
              <td className="p-2">
                <button
                  onClick={() => handleOpenModal(booking._id)}
                 >
                   <FaEdit />
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      {openModal && (
        <div className="fixed inset-0 flex items-center justify-center bg-gray-800 bg-opacity-50 z-50">
          <div className="bg-white rounded-lg shadow-lg w-full max-w-lg p-6">
            <h2 className="text-xl font-semibold mb-4">Edit Booking</h2>
            {updateError && (
              <div className="text-red-500 mb-2">{updateError}</div>
            )}

            {/* Select Employee */}
            <div className="mb-4">
              <label className="block font-medium mb-1">Employee</label>
              <select
                onChange={handleEmployeeChange}
                value={selectedBooking?.employeeDetails[0]?.employeeId || ""}
                className="border border-gray-300 p-2 rounded w-full">
                <option value="">Select Employee</option>
                {employees.map((employee) => (
                  <option key={employee._id} value={employee._id}>
                    {employee.name}
                  </option>
                ))}
              </select>
            </div>

            {/* Input Quantity */}
            <div className="mb-4">
              <label className="block font-medium mb-1">Quantity</label>
              <input
                type="number"
                value={selectedBooking?.quantity || ""}
                onChange={handleQuantityChange}
                className="border border-gray-300 p-2 rounded w-full"
              />
            </div>

            {/* Select Status */}
            <div className="mb-4">
              <label className="block font-medium mb-1">Status</label>
              <select
                value={selectedBooking?.status || ""}
                onChange={(e) =>
                  setSelectedBooking((prev) => ({
                    ...prev,
                    status: e.target.value,
                  }))
                }
                className="border border-gray-300 p-2 rounded w-full">
                <option value="">Select Status</option>
                <option value="Pending">Pending</option>
                <option value="Confirmed">Confirmed</option>
                <option value="In-progress">In-progress</option>
                <option value="Completed">Completed</option>
                <option value="Canceled">Canceled</option>
              </select>
            </div>

            {/* Action Buttons */}
            <div className="flex justify-end space-x-4">
              <button
                onClick={handleCloseModal}
                className="bg-gray-300 text-gray-700 px-4 py-2 rounded hover:bg-gray-400">
                Cancel
              </button>
              <button
                onClick={handleSubmitUpdate}
                className="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600">
                Save
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Managebooking;
