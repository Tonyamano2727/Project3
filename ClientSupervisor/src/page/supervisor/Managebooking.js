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
  const [bookings, setBookings] = useState([]);
  const [filteredBookings, setFilteredBookings] = useState([]);
  const [employees, setEmployees] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
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

  const fetchEmployees = async () => {
    try {
      const response = await apiGetemployee();
      if (response.success) {
        setEmployees(response.staff);
      } else {
        setError(response.message || "No employees found");
      }
    } catch (error) {
      setError(error.message || "An error occurred while fetching employees.");
    }
  };

  const fetchBookingDetails = async (bkid) => {
    try {
      const response = await apigetdetailbooking(bkid);
      if (response.success) {
        setSelectedBooking(response.data);
      } else {
        setError(response.message || "Failed to fetch booking details");
      }
    } catch (error) {
      setError(error.message || "An error occurred while fetching booking details.");
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
    setShowDetails(false); // Reset details view when opening modal
  };

  const handleCloseModal = () => {
    setOpenModal(false);
    setSelectedBooking(null);
    setIsEditing(false);
    setUpdateError(null);
    setShowDetails(false); // Reset details view when closing modal
  };

  const handleSubmitUpdate = async () => {
    try {
      if (!selectedBooking) {
        setUpdateError("Booking details are not available.");
        return;
      }
      if (selectedBooking.status === "Completed") {
        enqueueSnackbar("Cannot completed booking because date ", {
          variant: "error",
        });
        return;
      }

      const updatedData = { ...selectedBooking };
      const response = await apiupdatebooking(updatedData, selectedBooking._id);
      if (response.success) {
        enqueueSnackbar("Update booking successfull ", {
          variant: "success",
        });
        setOpenModal(false);
        fetchBookings();
      } else {
        setUpdateError(response.message || "Failed to update booking");
      }
    } catch (error) {
      setUpdateError(error.message || "An error occurred while updating the booking.");
    }
  };

  useEffect(() => {
    fetchBookings();
    fetchEmployees();
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
            {updateError && <div className="text-red-500 mb-2">{updateError}</div>}

            {isEditing ? (
              <>
                <div className="mb-4">
                  <label className="block font-medium mb-1">Employee</label>
                  <select
                    onChange={(e) =>
                      setSelectedBooking((prev) => ({
                        ...prev,
                        employeeId: e.target.value,
                      }))
                    }
                    value={selectedBooking?.employeeId || ""}
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
                    disabled={selectedBooking?.status === "Completed"}
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
              <Fromdetailsbooking booking={selectedBooking} onClose={handleCloseModal} />

            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default Managebooking;
