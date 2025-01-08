import React, { useState, useEffect } from "react";
import {
  apiGetbooking,
  apigetdetailbooking,
  apiupdatebooking,
  apiGetemployee,
} from "../../api/supervisor";
import { FaEdit } from "react-icons/fa";
import Fromdetailsbooking from "../../components/Fromdetailsbooking/Fromdetailsbooking";
import { useSnackbar } from "notistack";

const Managebooking = () => {
  const [, setBookings] = useState([]);
  const [filteredBookings, setFilteredBookings] = useState([]);
  const [employees, setEmployees] = useState([]);
  const [, setLoading] = useState(true);
  const [, setError] = useState(null);
  const [openModal, setOpenModal] = useState(false);
  const [selectedBooking, setSelectedBooking] = useState(null);
  const [updateError, setUpdateError] = useState(null);
  const [isEditing, setIsEditing] = useState(false);
  const [statusError, setStatusError] = useState(null);
  const [showDetails, setShowDetails] = useState(false);
  const { enqueueSnackbar } = useSnackbar();

  const fetchBookings = async () => {
    try {
      const response = await apiGetbooking();
      if (response.success) {
        setBookings(response.bookings);
        setFilteredBookings(response.bookings);
      } else {
        setError(response.message || "No bookings found");
      }
    } catch (error) {
      setError(error.message || "An error occurred while fetching bookings.");
    } finally {
      setLoading(false);
    }
  };

  const fetchBookingDetails = async (bkid) => {
    try {
      const response = await apigetdetailbooking(bkid);
      if (response.success) {
        const booking = response.data;

        if (booking.employeeDetails && employees.length > 0) {
          const employeeDetailsWithNames = booking.employeeDetails.map(
            (empDetail) => {
              const employee = employees.find(
                (emp) => emp._id === empDetail.employeeId
              );
              return {
                ...empDetail,
                employeeName: employee ? employee.name : "Unknown",
              };
            }
          );

          booking.employeeDetails = employeeDetailsWithNames;
        }

        setSelectedBooking(booking);
      } else {
        setError(response.message || "Failed to fetch booking details");
      }
    } catch (error) {
      setError(
        error.message || "An error occurred while fetching booking details."
      );
    }
  };

  const handleOpenModal = (bkid, editMode = false) => {
    fetchBookingDetails(bkid);
    if (selectedBooking && selectedBooking.status === "Completed") {
      enqueueSnackbar("Cannot edit a completed booking", {
        variant: "error",
      });

      return;
    } else {
      setStatusError(null);
    }
    setIsEditing(editMode);
    setOpenModal(true);
    setShowDetails(false);
  };

  const handleCloseModal = () => {
    setOpenModal(false);
    setSelectedBooking(null);
    setIsEditing(false);
    setUpdateError(null);
    setShowDetails(false);
  };

  const handleSubmitUpdate = async () => {
    try {
      if (!selectedBooking) {
        setUpdateError("Booking details are not available.");
        return;
      }

      const { date, timeSlot, status: newStatus } = selectedBooking;

      if (!date || !timeSlot) {
        setUpdateError("Date and Time Slot are required.");
        return;
      }

      if (!newStatus) {
        setUpdateError("Status is required.");
        return;
      }

      let hours, minutes;

      // Xử lý định dạng thời gian
      const isAMPMFormat = timeSlot.match(/(AM|PM)$/i); // Kiểm tra định dạng AM/PM
      if (isAMPMFormat) {
        // Định dạng 12 giờ (hh:mm AM/PM)
        const timeParts = timeSlot.match(/(\d+):(\d+)\s*(AM|PM)/i);
        if (!timeParts || timeParts.length !== 4) {
          setUpdateError("Invalid time slot format. Use 'hh:mm AM/PM'.");
          return;
        }

        hours = parseInt(timeParts[1], 10);
        minutes = parseInt(timeParts[2], 10);
        const period = timeParts[3].toUpperCase();

        if (isNaN(hours) || isNaN(minutes)) {
          setUpdateError("Invalid time slot values.");
          return;
        }

        if (period === "PM" && hours !== 12) {
          hours += 12; // Chuyển đổi giờ PM thành 24 giờ
        } else if (period === "AM" && hours === 12) {
          hours = 0; // Chuyển đổi 12 AM thành 0 giờ
        }
      } else {
        // Định dạng 24 giờ (hh:mm)
        const timeParts = timeSlot.split(":"); // Tách chuỗi thời gian
        if (timeParts.length !== 2) {
          setUpdateError("Invalid time slot format. Use 'hh:mm'.");
          return;
        }

        hours = parseInt(timeParts[0], 10);
        minutes = parseInt(timeParts[1], 10);

        if (isNaN(hours) || isNaN(minutes)) {
          setUpdateError("Invalid time slot values.");
          return;
        }
      }

      const bookingDate = new Date(date);
      bookingDate.setHours(hours, minutes, 0, 0); // Cập nhật giờ cho ngày booking

      const currentTime = new Date();

      if (newStatus === "Completed") {
        const timeDifference = currentTime - bookingDate;

        if (timeDifference < 2 * 60 * 60 * 1000) {
          setUpdateError(
            "Cannot update status to 'Completed' before 2 hours have passed."
          );
          return;
        }
      }

      // Tiến hành cập nhật
      console.log("Validated booking update:", selectedBooking);

      const response = await apiupdatebooking(
        selectedBooking,
        selectedBooking._id
      );

      if (response.success) {
        enqueueSnackbar("Update booking successful", { variant: "success" });
        setOpenModal(false);
        fetchBookings();
      } else {
        setUpdateError(response.message || "Failed to update booking");
      }
    } catch (error) {
      setUpdateError(
        error.message || "An error occurred while updating the booking."
      );
    }
  };

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [bookingsResponse, employeesResponse] = await Promise.all([
          apiGetbooking(),
          apiGetemployee(),
        ]);

        if (bookingsResponse.success) {
          setBookings(bookingsResponse.bookings);
          setFilteredBookings(bookingsResponse.bookings);
        } else {
          setError(bookingsResponse.message || "No bookings found");
        }

        if (employeesResponse.success) {
          setEmployees(employeesResponse.staff);
        } else {
          setError(employeesResponse.message || "No employees found");
        }
      } catch (error) {
        setError(error.message || "An error occurred while fetching data.");
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  return (
    <div className="w-full flex justify-center items-center flex-col bg-gray-100 mt-8">
      <table className="border bg-white rounded-3xl overflow-hidden w-full leading-10">
        <thead>
          <tr className="text-[13px] text-center">
            <th className="p-2">Number</th>
            <th>Name</th>
            <th>Service</th>
            <th>Email</th>
            <th>Phone</th>
            <th>Date</th>
            <th>Time Slot</th>
            <th>Status</th>
            <th>Total Price</th>
            <th>Action</th>
          </tr>
        </thead>
        <tbody className="text-center">
          {filteredBookings.map((booking, index) => (
            <tr key={booking._id} className="text-[10px] border-b">
              <td className="p-2">{index + 1}</td>
              <td className="p-2">{booking.customerName}</td>
              <td className="p-2">{booking.category}</td>
              <td className="p-2">{booking.email}</td>
              <td className="p-2">{booking.phoneNumber}</td>
              <td className="p-2">{booking.date}</td>
              <td className="p-2">{booking.timeSlot}</td>
              <td className="p-2">{booking.status}</td>
              <td className="p-2">{booking.totalPrice.toLocaleString()} VND</td>
              <td className="p-2">
                <button
                  onClick={() => {
                    handleOpenModal(booking._id, false);
                    setShowDetails(!showDetails);
                  }}
                  className="text-blue-500 hover:underline"
                >
                  {showDetails ? "Hide" : "Show"} Details
                </button>
                <button
                  onClick={() => {
                    if (booking.status === "Completed") {
                      enqueueSnackbar("Cannot edit a completed booking", {
                        variant: "error",
                      });
                    } else {
                      handleOpenModal(booking._id, true);
                    }
                  }}
                  className="text-yellow-500 hover:underline ml-2"
                >
                  <FaEdit />
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      {statusError && (
        <div className="text-red-500 p-4 bg-white rounded shadow-md mb-4">
          {statusError}
        </div>
      )}

      {openModal && (
        <div className="fixed inset-0 flex items-center justify-center bg-gray-800 bg-opacity-50 z-50">
          <div className="bg-white rounded-lg shadow-lg w-full max-w-lg p-6">
            {updateError && (
              <div className="text-red-500 mb-2">{updateError}</div>
            )}

            {isEditing ? (
              <>
                <div className="mb-4">
                  <label className="block font-medium mb-1">Employee</label>
                  <select
                    onChange={(e) => {
                      const selectedEmployee = employees.find(
                        (employee) => employee._id === e.target.value
                      );
                      setSelectedBooking((prev) => ({
                        ...prev,
                        employeeDetails: [
                          {
                            employeeId: selectedEmployee?._id || "",
                            name: selectedEmployee?.name || "",
                          },
                        ],
                      }));
                    }}
                    value={
                      selectedBooking?.employeeDetails[0]?.employeeId || ""
                    }
                    className="border border-gray-300 p-2 rounded w-full"
                    disabled={selectedBooking?.status === "Completed"}
                  >
                    <option value="">Select Employee</option>
                    {employees.map((employee) => (
                      <option key={employee._id} value={employee._id}>
                        {employee.name}
                      </option>
                    ))}
                  </select>
                </div>

                <div className="mb-4">
                  <label className="block font-medium mb-1">Quantity</label>
                  <input
                    type="number"
                    value={selectedBooking?.quantity || ""}
                    onChange={(e) =>
                      setSelectedBooking((prev) => ({
                        ...prev,
                        quantity: e.target.value,
                      }))
                    }
                    className="border border-gray-300 p-2 rounded w-full"
                    disabled={selectedBooking?.status === "Completed"}
                  />
                </div>

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
                    className="border border-gray-300 p-2 rounded w-full"
                  >
                    <option value="Pending">Pending</option>
                    <option value="Confirmed">Confirmed</option>
                    <option value="In-progress">In-progress</option>
                    <option value="Completed">Completed</option>
                    <option value="Canceled">Canceled</option>
                  </select>
                </div>

                <div className="flex justify-end space-x-4">
                  <button
                    onClick={handleCloseModal}
                    className="bg-gray-300 text-gray-700 px-4 py-2 rounded hover:bg-gray-400"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={handleSubmitUpdate}
                    className="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600"
                  >
                    Save
                  </button>
                </div>
              </>
            ) : (
              <Fromdetailsbooking
                booking={selectedBooking}
                onClose={handleCloseModal}
              />
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default Managebooking;
