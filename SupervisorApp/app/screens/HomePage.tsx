import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  TouchableWithoutFeedback,
  ImageBackground,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import { RootStackParamList } from '../navigation/types';
import houseCleaningTools from '../../assets/images/house-cleaning-tools.jpg';

type HomePageNavigationProp = StackNavigationProp<RootStackParamList, 'HomePage'>;

const HomePage = () => {
  const navigation = useNavigation<HomePageNavigationProp>();

  const handleNavigate = (screen: keyof RootStackParamList) => {
    navigation.navigate(screen);
  };

  return (
    <TouchableWithoutFeedback onPress={() => {}}>
      <ImageBackground source={houseCleaningTools} style={styles.container}>
        <View style={styles.overlay}>
          {/* Manage Employee Buttons */}
          <TouchableOpacity
            style={styles.mainButton}
            onPress={() => handleNavigate('EmployeeList')}
          >
            <Text style={styles.buttonText}>Employee List</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.mainButton}
            onPress={() => handleNavigate('CreateEmployee')}
          >
            <Text style={styles.buttonText}>Create Employee</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.mainButton}
            onPress={() => handleNavigate('Salary')}
          >
            <Text style={styles.buttonText}>Salary</Text>
          </TouchableOpacity>

          {/* Manage Booking Button */}
          <TouchableOpacity
            style={styles.mainButton}
            onPress={() => handleNavigate('ManageBooking')}
          >
            <Text style={styles.buttonText}>Manage Booking</Text>
          </TouchableOpacity>
        </View>
      </ImageBackground>
    </TouchableWithoutFeedback>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  overlay: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)', 
    width: '100%',
    height: '100%',
  },
  mainButton: {
    backgroundColor: '#ffc703',
    paddingVertical: 12,
    paddingHorizontal: 25,
    borderRadius: 20,
    marginBottom: 14,
    width: '50%', 
  },
  buttonText: {
    color: '#fff',
    fontSize: 14,
    
    textAlign: 'center', 
  },
});

export default HomePage;
