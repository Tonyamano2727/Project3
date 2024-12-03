import React from 'react';
import { createStackNavigator } from '@react-navigation/stack';
import LoginScreen from '../screens/LoginScreen';
import HomePage from '../screens/HomePage';
import EmployeeList from '../screens/EmployeeList';

const Stack = createStackNavigator();

const Tabs = () => {
  return (
    <Stack.Navigator initialRouteName="Login">
      <Stack.Screen name="Login" component={LoginScreen} />
      <Stack.Screen name="HomePage" component={HomePage} />
      <Stack.Screen name="EmployeeList" component={EmployeeList} />
    </Stack.Navigator>
  );
};

export default Tabs;
