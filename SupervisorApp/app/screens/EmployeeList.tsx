import React, { useEffect, useState } from 'react';
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
  Button 
} from 'react-native';
import { apiGetEmployeeList, apiUpdateEmployee } from '../config/apiService';

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
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [mobile, setMobile] = useState('');
  const [baseSalary, setBaseSalary] = useState<number | undefined>(undefined);

  useEffect(() => {
    if (Platform.OS === 'android' && UIManager.setLayoutAnimationEnabledExperimental) {
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
        Alert.alert('Error', response.data.mes || 'Failed to fetch employee list.');
      }
    } catch (error: any) {
      console.error('Error fetching employees:', error);
      Alert.alert('Error', 'An error occurred while fetching employee list.');
    } finally {
      setLoading(false);
    }
  };

  const toggleDetails = (id: string) => {
    LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);
    if (expandedEmployeeId === id) {
      setExpandedEmployeeId(null);
    } else {
      setExpandedEmployeeId(id);
    }
  };

  const handleEditEmployee = (employee: Employee) => {
    setCurrentEmployee(employee);
    setName(employee.name);
    setEmail(employee.email);
    setMobile(employee.mobile);
    setBaseSalary(employee.baseSalary);
    setModalVisible(true);
  };

  const handleUpdateEmployee = async () => {
    if (currentEmployee) {
      const updatedEmployee = {
        name,
        email,
        mobile,
        baseSalary,
      };

      try {
        const response = await apiUpdateEmployee(currentEmployee._id, updatedEmployee);
        if (response.status === 200 && response.data.success) {
          fetchEmployees(); 
          setModalVisible(false);
          Alert.alert('Success', 'Employee updated successfully.');
        } else {
          Alert.alert('Error', 'Failed to update employee.');
        }
      } catch (error) {
        Alert.alert('Error', 'An error occurred while updating employee.');
      }
    }
  };

  const renderItem = ({ item }: { item: Employee }) => {
    const isExpanded = expandedEmployeeId === item._id;
    return (
      <View style={styles.employeeItem}>
        <TouchableOpacity onPress={() => toggleDetails(item._id)}>
          <Text style={styles.employeeName}>{item.name}</Text>
        </TouchableOpacity>
        {isExpanded && (
          <View style={styles.employeeDetails}>
            <Text style={styles.detailText}>Email: {item.email}</Text>
            <Text style={styles.detailText}>Job: {item.job}</Text>
            <Text style={styles.detailText}>Mobile: {item.mobile}</Text>
            <Text style={styles.detailText}>District: {item.district}</Text>
            {item.baseSalary !== undefined && (
              <Text style={styles.detailText}>Base Salary: ${item.baseSalary}</Text>
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
    <View style={styles.container}>
      <Text style={styles.title}>Employee List</Text>
      {loading ? (
        <Text>Loading...</Text>
      ) : (
        <FlatList
          data={employees}
          keyExtractor={(item) => item._id}
          renderItem={renderItem}
          contentContainerStyle={styles.listContainer}
          ItemSeparatorComponent={() => <View style={styles.separator} />}
          ListEmptyComponent={() => <Text>No employees found.</Text>}
        />
      )}

      {/* Modal for editing employee */}
      <Modal
        visible={modalVisible}
        animationType="slide"
        onRequestClose={() => setModalVisible(false)}
      >
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
            value={baseSalary?.toString()}
            onChangeText={(text) => setBaseSalary(Number(text))}
            placeholder="Base Salary"
            keyboardType="numeric"
          />
          <Button title="Save" onPress={handleUpdateEmployee} />
          <View style={styles.buttonSpacing} />
          <Button title="Cancel" onPress={() => setModalVisible(false)} />
        </View>
      </Modal>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
    backgroundColor: '#fff',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
    textAlign: 'center',
  },
  listContainer: {
    paddingBottom: 20,
  },
  employeeItem: {
    paddingVertical: 12,
    paddingHorizontal: 16,
    backgroundColor: '#f2f2f2',
    borderRadius: 8,
  },
  employeeName: {
    fontSize: 18,
    color: '#007AFF',
  },
  employeeDetails: {
    marginTop: 10,
  },
  detailText: {
    fontSize: 14,
    color: '#333',
    marginBottom: 4,
  },
  separator: {
    height: 10,
  },
  editButton: {
    fontSize: 14,
    color: '#007AFF',
    marginTop: 10,
  },
  modalContainer: {
    flex: 1,
    padding: 20,
    justifyContent: 'center',
    backgroundColor: 'white',
  },
  modalTitle: {
    fontSize: 22,
    fontWeight: 'bold',
    marginBottom: 20,
    textAlign: 'center',
  },
  input: {
    borderWidth: 1,
    borderColor: '#ccc',
    padding: 10,
    marginBottom: 12,
    borderRadius: 5,
  },
  buttonSpacing: {
    marginVertical: 10,  
  },
});

export default EmployeeList;
