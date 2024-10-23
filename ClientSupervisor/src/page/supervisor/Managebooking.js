import React, { useState, useEffect } from "react"; // Import React and necessary hooks
import {
  apiGetbooking,
  apiupdatebooking,
  apigetdetailbooking,
  apiGetemployee,
} from "../../api/supervisor"; // Import your API functions

const Managebooking = () => {
  const [bookings, setBookings] = useState([]); // State to hold bookings data
  const [employees, setEmployees] = useState([]); // State to hold employee data
  const [loading, setLoading] = useState(true); // State to track loading status
  const [error, setError] = useState(null); // State to hold error messages
  const [showForm, setShowForm] = useState(false); // State to toggle the update form
  const [selectedBooking, setSelectedBooking] = useState(null); // State to hold selected booking details
  const [updateError, setUpdateError] = useState(null); // State to hold update error messages

  // Fetch bookings from the API
  const fetchBookings = async () => {
    try {
      const response = await apiGetbooking(); // Call the API to get bookings
      if (response.success) {
        setBookings(response.bookings); // Update state with bookings data
      } else {
        setError(response.message || "No bookings found"); // Handle API response error
      }
    } catch (error) {
      setError(error.message || "An error occurred while fetching bookings."); // Handle any unexpected errors
    } finally {
      setLoading(false); // Set loading to false after the API call
    }
  };

  // Fetch employees from the API
  const fetchEmployees = async () => {
    try {
      const response = await apiGetemployee(); // Call the API to get employees
      if (response.success) {
        setEmployees(response.staff); // Update state with employees data
      } else {
        setError(response.message || "Failed to fetch employees"); // Handle API response error
      }
    } catch (error) {
      setError(error.message || "An error occurred while fetching employees."); // Handle any unexpected errors
    }
  };

  // Fetch bookings and employees when the component mounts
  useEffect(() => {
    fetchBookings();
    fetchEmployees();
  }, []);

  // Function to fetch booking details
  const fetchBookingDetails = async (bookingId) => {
    try {
      const response = await apigetdetailbooking(bookingId); // Call the API to get booking details
      if (response.success) {
        setSelectedBooking(response.data); // Set selected booking details
        setShowForm(true); // Show the form
      } else {
        setError(response.message || "Failed to fetch booking details"); // Handle API response error
      }
    } catch (error) {
      setError(error.message || "An error occurred while fetching booking details."); // Handle any unexpected errors
    }
  };

  // Function to handle booking update
  const handleUpdateBooking = async (bookingId) => {
    const booking = bookings.find((b) => b._id === bookingId); // Find the booking by ID
    if (booking.status === "Completed") {
      alert("Không thể cập nhật đơn hàng vì đơn hàng đã hoàn thành."); // Alert if booking is completed
      return; // Don't fetch booking details if status is completed
    }
    fetchBookingDetails(bookingId); // Fetch booking details if not completed
  };

  // Function to submit the update form
  const handleSubmitUpdate = async (e) => {
    e.preventDefault();

    if (!selectedBooking) return; 

    try {
      const response = await apiupdatebooking(
        selectedBooking,
        selectedBooking._id
      ); // Call the API to update booking
      if (response.success) {
        setBookings((prevBookings) =>
          prevBookings.map((booking) =>
            booking._id === selectedBooking._id
              ? { ...booking, ...selectedBooking }
              : booking
          )
        );
        setShowForm(false); // Hide the form after successful update
        setSelectedBooking(null); // Reset selected booking
        setUpdateError(null); // Reset update error message
      } else {
        setError(response.message || "Failed to update booking"); // Handle API response error
      }
    } catch (error) {
      setError(
        error.message || "An error occurred while updating the booking."
      ); // Handle any unexpected errors
    }
  };

  // Function to update quantity and calculate total price
  const handleQuantityChange = (e) => {
    const quantity = e.target.value;
    setSelectedBooking((prev) => ({
      ...prev,
      quantity: quantity,
      totalPrice: quantity * prev.price, // Calculate total price based on quantity and price
    }));
  };

  // Function to handle employee change
  const handleEmployeeChange = (e) => {
    const selectedEmployeeId = e.target.value;
    const selectedEmployee = employees.find(
      (employee) => employee._id === selectedEmployeeId
    );
    setSelectedBooking((prev) => ({
      ...prev,
      employeeDetails: [{ employeeId: selectedEmployeeId, name: selectedEmployee.name }],
    }));
  };

  return (
    <div className="w-full flex justify-center items-center flex-col bg-gray-100 p-6">
      <h1 className="text-2xl font-bold mb-6">Manage Bookings</h1>
      {loading ? (
        <div className="text-lg">Loading...</div> // Loading indicator
      ) : error ? (
        <div className="text-red-500">{error}</div> // Display error message if any
      ) : (
        <form
          className="w-full border rounded-2xl bg-white p-5"
          onSubmit={handleSubmitUpdate}>
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
                <th className="p-2">Action</th> {/* New column for action */}
              </tr>
            </thead>
            <tbody className="text-center">
              {bookings.map((booking) => (
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
                      onClick={() => handleUpdateBooking(booking._id)}>
                      Update
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>

          {showForm && selectedBooking && (
            <div className="mt-5 p-4 border rounded">
              <h2 className="text-lg font-bold mb-2">Update Booking</h2>
              {updateError && (
                <div className="text-red-500 mb-2">{updateError}</div>
              )}{" "}
              {/* Display update error message */}
              <div>
                <label>Status</label>
                <select
                  value={selectedBooking.status}
                  onChange={(e) =>
                    setSelectedBooking({
                      ...selectedBooking,
                      status: e.target.value,
                    })
                  }
                  className="border p-2 rounded w-full mb-2">
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
                  value={selectedBooking.employeeDetails[0]?.employeeId || ""}
                  onChange={handleEmployeeChange}
                  className="border p-2 rounded w-full mb-2">
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
                <div>{selectedBooking.price} VND</div>
              </div>
              <div>
                <label>Quantity</label>
                <input
                  type="number"
                  value={selectedBooking.quantity}
                  onChange={handleQuantityChange} // Update quantity and total price
                  className="border p-2 rounded w-full mb-2"
                />
              </div>
              <div>
                <label>Total Price</label>
                <input
                  type="number"
                  value={selectedBooking.totalPrice}
                  className="border p-2 rounded w-full mb-2"
                  disabled // Optional: Disable total price field to prevent manual edits
                />
              </div>
              <button
                type="submit" // Submit the form
                className="bg-green-500 text-white p-2 rounded">
                Save Changes
              </button>
              <button
                type="button"
                onClick={() => {
                  setShowForm(false);
                  setSelectedBooking(null);
                  setUpdateError(null);
                }} // Hide the form and reset error
                className="bg-red-500 text-white p-2 rounded ml-2">
                Cancel
              </button>
            </div>
          )}
        </form>
      )}
    </div>
  );
};

export default Managebooking;
