import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  TextInput,
  FlatList,
  Modal,
  Button,
  Alert as RNAlert,
} from 'react-native';
import { Picker } from '@react-native-picker/picker';
import { apiManageBooking, apiUpdateBooking, apiGetDetailBooking, apiGetEmployeeList } from '../config/apiService';

type Booking = {
  _id: string;
  customerName: string;
  category: string;
  email: string;
  phoneNumber: string;
  address: string;
  district: string;
  ward: string;
  status: string;
  price: number;
  quantity: number;
  totalPrice?: number;
  employeeDetails: { employeeId: string; name: string }[];
  date: string;
  timeSlot: string;
};

type Employee = {
  _id: string;
  name: string;
};

const ManageBooking = () => {
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [employees, setEmployees] = useState<Employee[]>([]);
  const [filteredBookings, setFilteredBookings] = useState<Booking[]>([]);
  const [selectedBooking, setSelectedBooking] = useState<Booking | null>(null);
  const [loading, setLoading] = useState(true);
  const [snackbarMessage, setSnackbarMessage] = useState('');
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [filterStatus, setFilterStatus] = useState('');
  const [openModal, setOpenModal] = useState(false);

  const formatCurrency = (value) => {
    return new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(value);
  };

  // Fetch bookings and employees
  const fetchBookings = async () => {
    try {
      const response = await apiManageBooking();
      if (response.data && response.data.success) {
        const sortedBookings = response.data.bookings.sort((a: Booking, b: Booking) => new Date(b.date).getTime() - new Date(a.date).getTime());
        setBookings(sortedBookings);
        setFilteredBookings(sortedBookings);
      } else {
        setSnackbarMessage('No bookings found');
        setSnackbarOpen(true);
      }
    } catch (error) {
      setSnackbarMessage('Error fetching bookings');
      setSnackbarOpen(true);
    }
  };

  const fetchEmployees = async () => {
    try {
      const response = await apiGetEmployeeList();
      if (response.data && response.data.success) {
        setEmployees(response.data.staff);
      } else {
        setSnackbarMessage('Failed to fetch employees');
        setSnackbarOpen(true);
      }
    } catch (error) {
      setSnackbarMessage('Error fetching employees');
      setSnackbarOpen(true);
    }
  };

  const fetchBookingDetails = async (bookingId: string) => {
    try {
      const response = await apiGetDetailBooking(bookingId);
      if (response.data && response.data.success) {
        setSelectedBooking(response.data.data);
      } else {
        setSnackbarMessage('Failed to fetch booking details');
        setSnackbarOpen(true);
      }
    } catch (error) {
      setSnackbarMessage('Error fetching booking details');
      setSnackbarOpen(true);
    }
  };

  const handleOpenModal = (bookingId: string) => {
    const booking = bookings.find((b: Booking) => b._id === bookingId);
    if (booking?.status === 'Completed' || booking?.status === 'Canceled') {
      setSnackbarMessage('Cannot update COMPLETED/CANCELED booking.');
      setSnackbarOpen(true);
      return;
    }
    fetchBookingDetails(bookingId);
    setOpenModal(true);
  };

  const handleCloseModal = () => {
    setOpenModal(false);
    setSelectedBooking(null);
  };

  const handleSubmitUpdate = async () => {
    if (!selectedBooking) return;

    try {
      const response = await apiUpdateBooking(selectedBooking, selectedBooking._id);
      if (response.data && response.data.success) {
        setBookings(prev => prev.map(booking =>
          booking._id === selectedBooking._id ? { ...booking, ...selectedBooking } : booking
        ));
        setFilteredBookings(prev => prev.map(booking =>
          booking._id === selectedBooking._id ? { ...booking, ...selectedBooking } : booking
        ));
        setOpenModal(false);
        setSelectedBooking(null);
        setSnackbarMessage('Booking updated successfully!');
        setSnackbarOpen(true);
      } else {
        setSnackbarMessage('Failed to update booking');
        setSnackbarOpen(true);
      }
    } catch (error) {
      setSnackbarMessage('Error updating booking');
      setSnackbarOpen(true);
    }
  };

  const handleFilterChange = (status: string) => {
    setFilterStatus(status);
    if (status === '') {
      setFilteredBookings(bookings);
    } else {
      const filtered = bookings.filter((booking: Booking) => booking.status === status);
      setFilteredBookings(filtered);
    }
  };

  const handleSnackbarClose = () => {
    setSnackbarOpen(false);
  };

  useEffect(() => {
    fetchBookings();
    fetchEmployees();
  }, []);

  return (
    <View style={{ flex: 1, padding: 20, backgroundColor: '#f1f1f1' }}>
      <Text style={{ fontSize: 24, fontWeight: 'bold', marginBottom: 10 }}>Manage Bookings</Text>

      {/* Filter */}
      <View style={{ marginBottom: 20 }}>
        <Picker
          selectedValue={filterStatus}
          onValueChange={(itemValue) => handleFilterChange(itemValue)}
        >
          <Picker.Item label="All Status" value="" />
          <Picker.Item label="Pending" value="Pending" />
          <Picker.Item label="Confirmed" value="Confirmed" />
          <Picker.Item label="In-progress" value="In-progress" />
          <Picker.Item label="Completed" value="Completed" />
          <Picker.Item label="Canceled" value="Canceled" />
        </Picker>
      </View>

      {/* Bookings List */}
      <FlatList
        data={filteredBookings}
        keyExtractor={(item: Booking) => item._id}
        renderItem={({ item }) => (
          <View style={{ padding: 10, backgroundColor: '#fff', marginBottom: 10, borderRadius: 8 }}>
            <Text>{item.customerName}</Text>
            <Text>{item.category}</Text>
            <Text>{item.email}</Text>
            <Text>{item.phoneNumber}</Text>
            <Text>{item.address}, {item.district}, {item.ward}</Text>
            <Text>{new Date(item.date).toLocaleDateString()}</Text>
            <Text>{item.timeSlot}</Text>
            <View>
              {item.employeeDetails.map((employee) => (
                <Text key={employee.employeeId}>{employee.name}</Text>
              ))}
            </View>
            <Text>{item.status}</Text>
            <Text>{item.totalPrice?.toLocaleString()} VND</Text>

            <TouchableOpacity
              style={{ backgroundColor: '#007bff', padding: 10, marginTop: 10, borderRadius: 5 }}
              onPress={() => handleOpenModal(item._id)}
            >
              <Text style={{ color: '#fff' }}>Update</Text>
            </TouchableOpacity>
          </View>
        )}
      />

      {/* Modal */}
      <Modal visible={openModal} onRequestClose={handleCloseModal}>
  <View style={{ padding: 20 }}>
    <View style={{ marginVertical: 10 }}>
      <Text style={{ fontSize: 20 }}>Status</Text>
      <View style={{ borderWidth: 1, borderColor: '#ccc', borderRadius: 20, overflow: 'hidden', marginTop: 15 }}>
        <Picker
          selectedValue={selectedBooking?.status || ''}
          onValueChange={(itemValue) =>
            setSelectedBooking((prev) => (prev ? { ...prev, status: itemValue } : prev))
          }
        >
          <Picker.Item label="Pending" value="Pending" />
          <Picker.Item label="Confirmed" value="Confirmed" />
          <Picker.Item label="In-progress" value="In-progress" />
          <Picker.Item label="Completed" value="Completed" />
          <Picker.Item label="Canceled" value="Canceled" />
        </Picker>
      </View>
    </View>

    <View style={{ marginVertical: 10 }}>
      <Text style={{ fontSize: 20 }}>Employee</Text>
      <View style={{ borderWidth: 1, borderColor: '#ccc', borderRadius: 20, overflow: 'hidden', marginTop: 15 }}>
        <Picker
          selectedValue={selectedBooking?.employeeDetails[0]?.employeeId || ''}
          onValueChange={(itemValue) => {
            const selectedEmployee = employees.find((e: Employee) => e._id === itemValue);
            setSelectedBooking((prev) =>
              prev
                ? {
                    ...prev,
                    employeeDetails: [
                      { employeeId: itemValue, name: selectedEmployee?.name || '' },
                    ],
                  }
                : prev
            );
          }}
        >
          {employees.map((employee: Employee) => (
            <Picker.Item key={employee._id} label={employee.name} value={employee._id} />
          ))}
        </Picker>
      </View>
    </View>

    <View style={{ marginVertical: 10 }}>
    <Text style={{ fontSize: 20 }}>
      Price: {formatCurrency(selectedBooking?.price || 0)}
    </Text>
      <Text style={{ fontSize: 20, marginTop: 15 }}>Quantity</Text>
      <TextInput
        style={{
          borderWidth: 1,
          borderColor: '#ccc',
          borderRadius: 20,
          paddingHorizontal: 10,
          height: 40,
          fontSize: 15,
          marginTop: 15,
        }}
        keyboardType="numeric"
        value={selectedBooking?.quantity?.toString() || ''}
        onChangeText={(text) =>
          setSelectedBooking((prev) =>
            prev ? { ...prev, quantity: parseInt(text) } : prev
          )
        }
      />
    </View>

  <View style={{ justifyContent: 'space-between', padding: 20 }}>
    {/* Nút Save */}
    <TouchableOpacity
      style={{
        backgroundColor: '#007bff', // Màu nền của nút
        borderRadius: 10, // Bo góc
        padding: 10,
        alignItems: 'center',
      }}
      onPress={handleSubmitUpdate}
    >
      <Text style={{ color: 'white', fontSize: 16 }}>Save</Text>
    </TouchableOpacity>

    <View style={{ height: 15 }} />

      {/* Nút Close */}
      <TouchableOpacity
        style={{
          backgroundColor: '#ff5733', 
          borderRadius: 10, 
          padding: 10,
          alignItems: 'center',
        }}
        onPress={handleCloseModal}
      >
        <Text style={{ color: 'white', fontSize: 16 }}>Close</Text>
      </TouchableOpacity>
    </View>
  </View>
</Modal>


      {/* Snackbar */}
      {snackbarOpen && (
        <View style={{ backgroundColor: 'black', padding: 10, position: 'absolute', bottom: 0, left: 0, right: 0 }}>
          <Text style={{ color: 'white' }}>{snackbarMessage}</Text>
          <Button title="Close" onPress={handleSnackbarClose} />
        </View>
      )}
    </View>
  );
};

export default ManageBooking;
