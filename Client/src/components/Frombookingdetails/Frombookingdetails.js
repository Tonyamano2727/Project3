import React from "react";

const Frombookingdetails = ({ booking, onClose }) => {
  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center">
      <div className="bg-white rounded-lg p-6 w-[70%] from">
      <div className="flex justify-end">
      <button
          className=""
          onClick={onClose}>
          Close
        </button>
      </div>
        <h2 className="text-xl font-bold mb-4">Booking Details</h2>
        <p>
          <strong>Customer Name:</strong> {booking.customerName}
        </p>
        <p>
          <strong>Service:</strong> {booking.category}
        </p>
        <p>
          <strong>Email:</strong> {booking.email}
        </p>
        <p>
          <strong>Phone:</strong> {booking.phoneNumber}
        </p>
        <p>
          <strong>Address:</strong> {booking.address}
        </p>
        <p>
          <strong>Date:</strong> {booking.date}
        </p>
        <p>
          <strong>Time Slot:</strong> {booking.timeSlot}
        </p>
        <p>
          <strong>Status:</strong> {booking.status}
        </p>
        <p>
          <strong>Total Price:</strong> {booking.totalPrice.toLocaleString()}{" "}
          VND
        </p>
      </div>
    </div>
  );
};

export default Frombookingdetails;
