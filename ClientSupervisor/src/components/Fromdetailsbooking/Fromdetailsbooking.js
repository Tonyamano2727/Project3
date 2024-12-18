import React from "react";

const Fromdetailsbooking = ({ booking, onClose }) => {
  if (!booking) {
    return (
      <div className="p-4 text-sm">
        <div className="flex justify-end w-full">
          <button
            onClick={onClose}
            className="bg-gray-300 text-gray-700 px-4 py-2 rounded hover:bg-gray-400"
          >
            Close
          </button>
        </div>
        <p>Loading booking details...</p>
      </div>
    );
  }

  return (
    <div className="p-4 text-sm">
      <div className="flex justify-end w-full">
        <button
          onClick={onClose}
          className="bg-gray-300 text-gray-700 px-4 py-2 rounded hover:bg-gray-400"
        >
          Close
        </button>
      </div>
      <h2 className="text-sm font-bold mb-4">Booking Details</h2>
      <p>
        <strong>Name:</strong> {booking.customerName}
      </p>
      <p>
        <strong>Email:</strong> {booking.email || "N/A"}
      </p>
      <p>
        <strong>Phone:</strong> {booking.phoneNumber || "N/A"}
      </p>
      <p>
        <strong>Address:</strong> {booking.address || "N/A"}
      </p>
      <p>
        <strong>Date:</strong> {booking.date || "N/A"}
      </p>
      <p>
        <strong>Time Slot:</strong> {booking.timeSlot || "N/A"}
      </p>
      <p>
        <strong>Status:</strong> {booking.status || "N/A"}
      </p>
      <p>
        <strong>Employee:</strong>{" "}
        {booking.employeeDetails?.map((e) => e.name).join(", ") || "N/A"}
      </p>
      <p>
        <strong>Total Price:</strong>{" "}
        {booking.totalPrice
          ? `${booking.totalPrice.toLocaleString()} VND`
          : "N/A"}
      </p>
    </div>
  );
};

export default Fromdetailsbooking;
