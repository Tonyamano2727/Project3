import React from 'react';
import { createStackNavigator } from '@react-navigation/stack';
import LoginScreen from '../screens/LoginScreen';
import HomePage from '../screens/HomePage';
import EmployeeList from '../screens/EmployeeList';
import CreateEmployee from '../screens/CreateEmployee';
import { NavigationContainer } from '@react-navigation/native';

const Stack = createStackNavigator();

const Tabs = () => {
  return (
    <NavigationContainer>
    <Stack.Navigator initialRouteName="Login">
      <Stack.Screen name="Login" component={LoginScreen} />
      <Stack.Screen name="HomePage" component={HomePage} />
      <Stack.Screen name="EmployeeList" component={EmployeeList} />
      <Stack.Screen name="CreateEmployee" component={CreateEmployee} />
    </Stack.Navigator>
    </NavigationContainer>
  );
};

export default Tabs;
