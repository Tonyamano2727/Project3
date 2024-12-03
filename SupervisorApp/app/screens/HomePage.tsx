import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, TouchableWithoutFeedback } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import { RootStackParamList } from '../navigation/types';

type HomePageNavigationProp = StackNavigationProp<RootStackParamList, 'HomePage'>;
const HomePage = () => {
  const [isEmployeeMenuOpen, setIsEmployeeMenuOpen] = useState(false);
  const navigation = useNavigation<HomePageNavigationProp>();

  const toggleEmployeeMenu = () => {
    setIsEmployeeMenuOpen(!isEmployeeMenuOpen);
  };

  const closeEmployeeMenu = () => {
    setIsEmployeeMenuOpen(false);
  };

  const handleNavigate = (screen: keyof RootStackParamList) => {
    navigation.navigate(screen);
    setIsEmployeeMenuOpen(false); 
  };

  return (
    <TouchableWithoutFeedback onPress={closeEmployeeMenu}>
      <View style={styles.container}>
        
        <View style={styles.dropdownContainer}>
          <TouchableOpacity style={styles.mainButton} onPress={toggleEmployeeMenu}>
            <Text style={styles.buttonText}>Manage Employee</Text>
          </TouchableOpacity>
          
          {isEmployeeMenuOpen && (
            <View style={styles.dropdown}>
              <TouchableOpacity
                style={styles.dropdownButton}
                onPress={() => handleNavigate('EmployeeList')}
              >
                <Text style={styles.dropdownButtonText}>Employee List</Text>
              </TouchableOpacity>
              <TouchableOpacity style={styles.dropdownButton} onPress={() => {}}>
                <Text style={styles.dropdownButtonText}>Create Employee</Text>
              </TouchableOpacity>
              <TouchableOpacity style={styles.dropdownButton} onPress={() => {}}>
                <Text style={styles.dropdownButtonText}>Salary</Text>
              </TouchableOpacity>
            </View>
          )}
        </View>

        <TouchableOpacity style={styles.mainButton} onPress={() => {}}>
          <Text style={styles.buttonText}>Manage Booking</Text>
        </TouchableOpacity>
      </View>
    </TouchableWithoutFeedback>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 16,
    backgroundColor: '#fff', 
  },
  dropdownContainer: {
    width: '80%',
    alignItems: 'center',
    marginBottom: 20,
  },
  mainButton: {
    backgroundColor: '#007AFF',
    paddingVertical: 12,
    paddingHorizontal: 25,
    borderRadius: 5,
    marginBottom: 10,
  },
  buttonText: {
    color: '#fff',
    fontSize: 16,
  },
  dropdown: {
    width: '100%',
    backgroundColor: '#f9f9f9',
    borderRadius: 5,
    marginTop: 10,
    elevation: 5, 
    shadowColor: '#000', 
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
  },
  dropdownButton: {
    paddingVertical: 12,
    paddingHorizontal: 20,
    borderBottomWidth: 1,
    borderBottomColor: '#ddd',
  },
  dropdownButtonText: {
    fontSize: 16,
    color: '#007AFF',
  },
});

export default HomePage;
