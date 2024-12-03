// app/screens/HomePage.tsx
import React from 'react';
import { View, Text, Button, StyleSheet } from 'react-native';

const HomePage = () => {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Welcome to HomePage</Text>
      <Button title="Manage Employee" onPress={() => { /* Navigate to Employee Management */ }} />
      <Button title="Manage Booking" onPress={() => { /* Navigate to Booking Management */ }} />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
  },
});

export default HomePage;
