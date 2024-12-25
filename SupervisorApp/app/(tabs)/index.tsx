import React, { useEffect, useState } from 'react';
import { createStackNavigator } from '@react-navigation/stack';
import LoginScreen from '../screens/LoginScreen';
import HomePage from '../screens/HomePage';
import EmployeeList from '../screens/EmployeeList';
import CreateEmployee from '../screens/CreateEmployee';
import Salary from '../screens/Salary';
import { NavigationContainer } from '@react-navigation/native';
import ManageBooking from '../screens/ManageBooking';
import { getAuthToken, initializeAuthToken } from '../config/apiService';
import { ActivityIndicator, View, StyleSheet } from 'react-native';

const Stack = createStackNavigator();



const Tabs = () => {

  const [isLoading, setIsLoading] = useState(true);
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  useEffect(() => {
    const checkLoginStatus = async () => {
      await initializeAuthToken();
      const token = await getAuthToken();

      setIsLoggedIn(!!token);
      setIsLoading(false);
    };

    checkLoginStatus();
  }, []);

  if (isLoading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#007AFF" />
      </View>
    );
  }
  return (
    <Stack.Navigator initialRouteName="Login">
      <Stack.Screen name="Login" component={LoginScreen} />
      <Stack.Screen name="HomePage" component={HomePage} />
      <Stack.Screen name="EmployeeList" component={EmployeeList} />
      <Stack.Screen name="CreateEmployee" component={CreateEmployee} />
      <Stack.Screen name="Salary" component={Salary}/>
      <Stack.Screen name="ManageBooking" component={ManageBooking}/>
    </Stack.Navigator>
  );
};

const styles = StyleSheet.create({
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
});

export default Tabs;
