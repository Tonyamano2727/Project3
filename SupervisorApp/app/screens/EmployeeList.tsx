import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  FlatList,
  LayoutAnimation,
  UIManager,
  Platform,
  Alert,
  Modal,
  TextInput,
  ActivityIndicator,
  ImageBackground,
  Image,
} from "react-native";
import { apiGetEmployeeList, apiUpdateEmployee } from "../config/apiService";
import houseCleaningTools from '../../assets/images/house-cleaning-tools.jpg';

interface Employee {
  _id: string;
  name: string;
  email: string;
  job: string;
  mobile: string;
  avatar?: string;
  district: string;
  baseSalary?: number;
}

const EmployeeList = () => {
  const [employees, setEmployees] = useState<Employee[]>([]);
  const [expandedEmployeeId, setExpandedEmployeeId] = useState<string | null>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const [modalVisible, setModalVisible] = useState(false);
  const [currentEmployee, setCurrentEmployee] = useState<Employee | null>(null);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [mobile, setMobile] = useState("");
  const [baseSalary, setBaseSalary] = useState<string>("");

  useEffect(() => {
    if (Platform.OS === "android" && UIManager.setLayoutAnimationEnabledExperimental) {
      UIManager.setLayoutAnimationEnabledExperimental(true);
    }

    fetchEmployees();
  }, []);

  const fetchEmployees = async () => {
    setLoading(true);
    try {
      const response = await apiGetEmployeeList();
      if (response.status === 200 && response.data.success) {
        setEmployees(response.data.staff);
      } else {
        Alert.alert("Error", response.data.mes || "Failed to fetch employee list.");
      }
    } catch (error) {
      console.error("Error fetching employees:", error);
      Alert.alert("Error", "An error occurred while fetching employee list.");
    } finally {
      setLoading(false);
    }
  };

  const toggleDetails = (id: string) => {
    LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);
    setExpandedEmployeeId(expandedEmployeeId === id ? null : id);
  };

  const handleEditEmployee = (employee: Employee) => {
    setCurrentEmployee(employee);
    setName(employee.name);
    setEmail(employee.email);
    setMobile(employee.mobile);
    setBaseSalary(employee.baseSalary?.toString() || "");
    setModalVisible(true);
  };

  const handleUpdateEmployee = async () => {
    if (!currentEmployee) return;

    const updatedEmployee = {
      name,
      email,
      mobile,
      baseSalary: Number(baseSalary.replace(/,/g, "")),
    };

    try {
      const response = await apiUpdateEmployee(currentEmployee._id, updatedEmployee);
      if (response.status === 200 && response.data.success) {
        fetchEmployees();
        setModalVisible(false);
        Alert.alert("Success", "Employee updated successfully.");
      } else {
        Alert.alert("Error", "Failed to update employee.");
      }
    } catch (error) {
      Alert.alert("Error", "An error occurred while updating employee.");
    }
  };

  const renderItem = ({ item }: { item: Employee }) => {
    const isExpanded = expandedEmployeeId === item._id;

    return (
      <View style={styles.employeeItem}>
        <TouchableOpacity
          onPress={() => toggleDetails(item._id)}
          style={styles.employeeHeader}>
          {item.avatar ? (
            <Image source={{ uri: item.avatar }} style={styles.avatar} />
          ) : (
            <View style={styles.avatarPlaceholder} />
          )}
          <Text style={styles.employeeName}>{item.name}</Text>
        </TouchableOpacity>
        {isExpanded && (
          <View style={styles.employeeDetails}>
            <Text style={styles.detailText}>Email: {item.email}</Text>
            <Text style={styles.detailText}>Job: {item.job}</Text>
            <Text style={styles.detailText}>Mobile: {item.mobile}</Text>
            <Text style={styles.detailText}>District: {item.district}</Text>
            {item.baseSalary && (
              <Text style={styles.detailText}>
                Base Salary: {new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(item.baseSalary)}
              </Text>
            )}
            <TouchableOpacity onPress={() => handleEditEmployee(item)}>
              <Text style={styles.editButton}>Edit</Text>
            </TouchableOpacity>
          </View>
        )}
      </View>
    );
  };

  return (
    <ImageBackground source={houseCleaningTools} style={styles.container}>
      <Text style={styles.title}>Employee List</Text>
      {loading ? (
        <ActivityIndicator size="large" color="#007AFF" />
      ) : (
        <FlatList
          data={employees}
          keyExtractor={(item) => item._id}
          renderItem={renderItem}
          contentContainerStyle={styles.listContainer}
          ItemSeparatorComponent={() => <View style={styles.separator} />}
          ListEmptyComponent={
            <Text style={styles.emptyListText}>No employees found.</Text>
          }
        />
      )}

      <Modal
        visible={modalVisible}
        animationType="slide"
        onRequestClose={() => setModalVisible(false)}>
        <View style={styles.modalContainer}>
          <Text style={styles.modalTitle}>Edit Employee</Text>
          <TextInput
            style={styles.input}
            value={name}
            onChangeText={setName}
            placeholder="Name"
          />
          <TextInput
            style={styles.input}
            value={email}
            onChangeText={setEmail}
            placeholder="Email"
          />
          <TextInput
            style={styles.input}
            value={mobile}
            onChangeText={setMobile}
            placeholder="Mobile"
            keyboardType="phone-pad"
          />
          <TextInput
            style={styles.input}
            value={baseSalary.replace(/\B(?=(\d{3})+(?!\d))/g, ",")} // Format number with commas
            onChangeText={(text) => setBaseSalary(text.replace(/,/g, ""))} // Remove commas for raw input
            placeholder="Base Salary"
            keyboardType="numeric"
          />
          <TouchableOpacity
            style={styles.saveButton}
            onPress={handleUpdateEmployee}>
            <Text style={styles.saveButtonText}>Save</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[styles.saveButton, styles.cancelButton]}
            onPress={() => setModalVisible(false)}>
            <Text style={styles.saveButtonText}>Cancel</Text>
          </TouchableOpacity>
        </View>
      </Modal>
    </ImageBackground>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  title: {
    fontSize: 24,
    fontWeight: "700",
    textAlign: "center",
    marginVertical: 20,
    color: "#fff",
  },
  listContainer: {
    paddingBottom: 20,
    
  },
  employeeItem: {
    padding: 16,
    backgroundColor: "#ffffff",
    borderRadius: 12,
    marginBottom: 12,
    shadowColor: "#000",
    shadowOpacity: 0.1,
    shadowRadius: 6,
    elevation: 3,
    width: "100%",
    alignSelf: "center",
  },
  employeeHeader: {
    flexDirection: "column", 
    alignItems: "center", 
    width: "100%", 
  },
  avatar: {
    width: 200,
    height: 100,
    borderRadius: 25,
    marginBottom: 8, // Space between image and name
    alignSelf: "center", // Ensure avatar is centered
  },
  avatarPlaceholder: {
    width: 100,
    height: 50,
    backgroundColor: "#ccc",
    borderRadius: 25,
    marginBottom: 8, // Space between image and name
    alignSelf: "center", // Ensure placeholder is centered
  },
  employeeName: {
    fontSize: 18,
    fontWeight: "500",
    color: "#333",
    width:200, // Ensure name has the same width as avatar
    textAlign: "center", // Align text in the center
  },
  employeeDetails: {
    marginTop: 8,
    paddingLeft: 16,
  },
  detailText: {
    fontSize: 14,
    color: "#555",
    marginVertical: 2,
  },
  separator: {
    height: 8,
  },
  editButton: {
    marginTop: 10,
    fontSize: 14,
    color: "#007AFF",
    fontWeight: "600",
    textAlign: "center",
  },
  modalContainer: {
    flex: 1,
    justifyContent: "center",
    padding: 20,
    backgroundColor: "#fff",
  },
  modalTitle: {
    fontSize: 22,
    fontWeight: "bold",
    textAlign: "center",
    marginBottom: 20,
    color: "#333",
    width: "100%"
  },
  input: {
    borderWidth: 1,
    borderColor: "#ddd",
    padding: 12,
    marginVertical: 8,
    borderRadius: 8,
    backgroundColor: "#f9f9f9",
  },
  saveButton: {
    backgroundColor: "#007AFF",
    paddingVertical: 12,
    borderRadius: 8,
    alignItems: "center",
    marginTop: 10,
  },
  saveButtonText: {
    color: "#fff",
    fontWeight: "600",
  },
  cancelButton: {
    backgroundColor: "#FF3B30",
  },
  emptyListText: {
    textAlign: "center",
    fontSize: 16,
    color: "#888",
  },
});


export default EmployeeList;
