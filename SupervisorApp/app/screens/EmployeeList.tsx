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
  RefreshControl
} from "react-native";
import { apiGetEmployeeList, apiUpdateEmployee } from "../config/apiService";
import * as ImagePicker from 'expo-image-picker';
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
  const [avatar, setAvatar] = useState<string | null>(null);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [savingStatus, setSavingStatus] = useState<string | null>(null);
  const [errors, setErrors] = useState<{ [key: string]: string | null }>({
    email: null,
    mobile: null,
    baseSalary: null,
  });

  useEffect(() => {
    if (Platform.OS === "android" && UIManager.setLayoutAnimationEnabledExperimental) {
      UIManager.setLayoutAnimationEnabledExperimental(true);
    }

    fetchEmployees();
  }, []);

  useEffect(() => {
    if (savingStatus === 'Saving') {
      let dots = 0;
      const interval = setInterval(() => {
        dots = (dots + 1) % 4; 
        setSavingStatus(`Saving${'.'.repeat(dots)}`);
      }, 100);
  
      return () => clearInterval(interval); 
    }
  }, [savingStatus]);

  const onRefresh = async () => {
    setIsRefreshing(true); 
    await fetchEmployees(); 
    setIsRefreshing(false); 
  };

  const handlePickAvatar = async () => {
    const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (status !== 'granted') {
      Alert.alert('Permission Denied', 'Camera roll permissions are required to select an avatar.');
      return;
    }
  
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [1, 1],
      quality: 1,
    });
  
    if (!result.canceled && result.assets && result.assets.length > 0) {
      const selectedImage = result.assets[0];
      setAvatar(selectedImage.uri); 
    }
  };
  
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
    setAvatar(null);
    setModalVisible(true);
  };

  const handleUpdateEmployee = async () => {
    if (!currentEmployee) return;

      // Validate email
    const emailRegex = /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|.(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    if (!emailRegex.test(email)) {
      Alert.alert("Validation Error", "Please enter a valid email address.");
      return;
    }

    // Validate phone
    const phoneRegex = /^\d{10,11}$/;
    if (!phoneRegex.test(mobile)) {
      Alert.alert("Validation Error", "Phone number must be 10 or 11 digits.");
      return;
    }

    // Validate base salary
    const salary = Number(baseSalary.replace(/,/g, ""));
    if (isNaN(salary) || salary <= 0) {
      Alert.alert("Validation Error", "Base salary must be a positive number.");
      return;
    }
  
    const formData = new FormData();
    formData.append('name', name);
    formData.append('email', email);
    formData.append('mobile', mobile);
    formData.append('baseSalary', baseSalary.replace(/,/g, ""));
    if (avatar) {
      formData.append('avatar', {
        uri: avatar,
        name: 'avatar.jpg', 
        type: 'image/jpeg', 
      });
    }
  
    setSavingStatus('Saving');
    try {
      const response = await apiUpdateEmployee(currentEmployee._id, formData);
      if (response.status === 200 && response.data.success) {
        fetchEmployees();
        setSavingStatus('Saved!');
        setTimeout(() => setSavingStatus(null), 2000); 
        setModalVisible(false);
      } else {
        setSavingStatus(null);
        Alert.alert("Error", response.data.message || "Failed to update employee.");
      }
    } catch (error) {
      console.error("Error updating employee:", error);
      setSavingStatus(null);
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
          refreshControl={
            <RefreshControl refreshing={isRefreshing} onRefresh={onRefresh} />
          }
        />
      )}

      <Modal
        visible={modalVisible}
        animationType="slide"
        onRequestClose={() => setModalVisible(false)}
      >
        <View style={styles.modalContainer}>
          <Text style={styles.modalTitle}>Edit Employee</Text>

          {savingStatus && (
            <Text style={styles.savingStatus}>{savingStatus}</Text>
          )}

          {/* Hiển thị Avatar */}
          {avatar ? (
            <Image source={{ uri: avatar }} style={styles.avatarPreview} />
          ) : currentEmployee?.avatar ? (
            <Image source={{ uri: currentEmployee.avatar }} style={styles.avatarPreview} />
          ) : (
            <View style={styles.avatarPlaceholder} />
          )}

          {/* Nút Chọn Ảnh */}
          <TouchableOpacity style={styles.saveButton} onPress={handlePickAvatar}>
            <Text style={styles.saveButtonText}>Choose Avatar</Text>
          </TouchableOpacity>

          {/* Các trường thông tin khác */}
          <TextInput
            style={styles.input}
            value={name}
            onChangeText={setName}
            placeholder="Name"
          />
          <TextInput
            style={styles.input}
            value={email}
            onChangeText={(text) => {
              setEmail(text);
              setErrors((prev) => ({ ...prev, email: null }));
            }}
            placeholder="Email"
          />
          {errors.email && <Text style={styles.errorText}>{errors.email}</Text>}

          <TextInput
            style={styles.input}
            value={mobile}
            onChangeText={(text) => {
              setMobile(text);
              setErrors((prev) => ({ ...prev, mobile: null }));
            }}
            placeholder="Mobile"
            keyboardType="phone-pad"
          />
          {errors.mobile && <Text style={styles.errorText}>{errors.mobile}</Text>}

          <TextInput
            style={styles.input}
            value={baseSalary.replace(/\B(?=(\d{3})+(?!\d))/g, ",")}
            onChangeText={(text) => {
              setBaseSalary(text.replace(/,/g, ""));
              setErrors((prev) => ({ ...prev, baseSalary: null }));
            }}
            placeholder="Base Salary"
            keyboardType="numeric"
          />
          {errors.baseSalary && <Text style={styles.errorText}>{errors.baseSalary}</Text>}

          {/* Nút Lưu */}
          <TouchableOpacity style={styles.saveButton} onPress={handleUpdateEmployee}>
            <Text style={styles.saveButtonText}>Save</Text>
          </TouchableOpacity>

          {/* Nút Hủy */}
          <TouchableOpacity
            style={[styles.saveButton, styles.cancelButton]}
            onPress={() => setModalVisible(false)}
          >
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
    marginBottom: 8, 
    alignSelf: "center", 
  },
  avatarPlaceholder: {
    width: 100,
    height: 50,
    backgroundColor: "#ccc",
    borderRadius: 25,
    marginBottom: 8, 
    alignSelf: "center", 
  },
  employeeName: {
    fontSize: 18,
    fontWeight: "500",
    color: "#333",
    width:200, 
    textAlign: "center", 
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
  avatarPreview: {
    width: 100,
    height: 100,
    borderRadius: 50,
    alignSelf: "center",
    marginBottom: 10,
  },
  savingStatus: {
    textAlign: 'center',
    fontSize: 16,
    color: '#007AFF',
    marginBottom: 10,
    fontWeight: 'bold',
  },
  errorText: {
    color: "red",
    fontSize: 12,
    marginTop: -8,
    marginBottom: 8,
  },
});


export default EmployeeList;
