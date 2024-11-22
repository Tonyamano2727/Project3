import React, { useState, useEffect } from "react";
import {
  apiGetbooking,
  apiupdatebooking,
  apigetdetailbooking,
  apiGetemployee,
} from "../../api/supervisor";
import Snackbar from "@mui/material/Snackbar";
import MuiAlert from "@mui/material/Alert";
import Dialog from "@mui/material/Dialog";
import DialogTitle from "@mui/material/DialogTitle";
import DialogContent from "@mui/material/DialogContent";
import DialogActions from "@mui/material/DialogActions";
import Button from "@mui/material/Button";

const Alert = React.forwardRef(function Alert(props, ref) {
  return <MuiAlert elevation={6} ref={ref} variant="filled" {...props} />;
});

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
    <div className="w-full flex justify-center items-center flex-col bg-gray-100 p-6">
      <h1 className="text-2xl font-bold mb-6">Manage Bookings</h1>
      {loading ? (
        <div className="text-lg">Loading...</div>
      ) : error ? (
        <div className="text-red-500">{error}</div>
      ) : (
        <>
          <div className="mb-4">
            <select
              value={filterStatus}
              onChange={(e) => handleFilterChange(e.target.value)}
              className="border p-2 rounded"
            >
              <option value="">All Status</option>
              <option value="Pending">Pending</option>
              <option value="Confirmed">Confirmed</option>
              <option value="In-progress">In-progress</option>
              <option value="Completed">Completed</option>
              <option value="Canceled">Canceled</option>
            </select>
          </div>
          <table className="w-full rounded-3xl overflow-hidden leading-10">
            <thead>
              <tr className="text-[13px] bg-gray-200">
                <th className="p-2">Customer Name</th>
                <th className="p-2">Service</th>
                <th className="p-2">Email</th>
                <th className="p-2">Phone</th>
                <th className="p-2">Address</th>
                <th className="p-2">Date</th>
                <th className="p-2">Time Slot</th>
                <th className="p-2">Employee</th>
                <th className="p-2">Status</th>
                <th className="p-2">Total Price</th>
                <th className="p-2">Action</th>
              </tr>
            </thead>
            <tbody className="text-center">
              {filteredBookings.map((booking) => (
                <tr key={booking._id} className="text-[11px] border-b">
                  <td className="p-2">{booking.customerName}</td>
                  <td className="p-2">{booking.category}</td>
                  <td className="p-2">{booking.email}</td>
                  <td className="p-2">{booking.phoneNumber}</td>
                  <td className="p-2">
                    {booking.address}, {booking.district}, {booking.ward}
                  </td>
                  <td className="p-2">
                    {new Date(booking.date).toLocaleDateString()}
                  </td>
                  <td className="p-2">{booking.timeSlot}</td>
                  <td className="p-2">
                    {booking.employeeDetails.map((employee) => (
                      <div key={employee.employeeId}>{employee.name}</div>
                    ))}
                  </td>
                  <td className="p-2">{booking.status}</td>
                  <td className="p-2">
                    {booking.totalPrice.toLocaleString()} VND
                  </td>
                  <td className="p-2">
                    <button
                      type="button"
                      className="bg-blue-500 text-white p-1 rounded"
                      onClick={() => handleOpenModal(booking._id)}
                    >
                      Update
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </>
      )}

      <Dialog
        open={openModal}
        onClose={handleCloseModal}
        fullWidth
        maxWidth="sm"
      >
        <DialogTitle>Update Booking</DialogTitle>
        <DialogContent>
          {updateError && (
            <div className="text-red-500 mb-2">{updateError}</div>
          )}
          <div>
            <label>Status</label>
            <select
              value={selectedBooking?.status || ""}
              onChange={(e) =>
                setSelectedBooking({
                  ...selectedBooking,
                  status: e.target.value,
                })
              }
              className="border p-2 rounded w-full mb-2"
            >
              <option value="Pending">Pending</option>
              <option value="Confirmed">Confirmed</option>
              <option value="In-progress">In-progress</option>
              <option value="Completed">Completed</option>
              <option value="Canceled">Canceled</option>
            </select>
          </div>
          <div>
            <label>Employee</label>
            <select
              value={selectedBooking?.employeeDetails[0]?.employeeId || ""}
              onChange={handleEmployeeChange}
              className="border p-2 rounded w-full mb-2"
            >
              <option value="">Select Employee</option>
              {employees.map((employee) => (
                <option key={employee._id} value={employee._id}>
                  {employee.name}
                </option>
              ))}
            </select>
          </div>
          <div>
            <label>Price</label>
            <div>{selectedBooking?.price || 0} VND</div>
          </div>
          <div>
            <label>Quantity</label>
            <input
              type="number"
              value={selectedBooking?.quantity || ""}
              onChange={handleQuantityChange}
              className="border p-2 rounded w-full mb-2"
            />
          </div>
          <div>
            <label>Total Price</label>
            <input
              type="number"
              value={selectedBooking?.totalPrice || ""}
              className="border p-2 rounded w-full mb-2"
              disabled
            />
          </div>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseModal} color="error">
            Cancel
          </Button>
          <Button onClick={handleSubmitUpdate} color="primary">
            Save Changes
          </Button>
        </DialogActions>
      </Dialog>

      <Snackbar
        open={snackbarOpen}
        autoHideDuration={3000}
        onClose={handleSnackbarClose}
        anchorOrigin={{ vertical: "top", horizontal: "center" }}
      >
        <Alert onClose={handleSnackbarClose} severity={snackbarSeverity}>
          {snackbarMessage}
        </Alert>
      </Snackbar>
    </div>
  );
};

export default Managebooking;
