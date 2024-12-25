import React, { useEffect, useState } from 'react';
import { View, Text, Button, TextInput, StyleSheet, Alert, ImageBackground } from 'react-native';
import axios from 'axios';
import { useNavigation } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import { RootStackParamList } from '../navigation/types';
import { apiLogin, setAuthToken, getAuthToken } from '../config/apiService';

type LoginScreenNavigationProp = StackNavigationProp<RootStackParamList, 'Login'>;

const LoginScreen = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const navigation = useNavigation<LoginScreenNavigationProp>();

  useEffect(() => {
    const checkLoginStatus = async () => {
      const token = await getAuthToken();
      if (token) {
        navigation.navigate('HomePage');
      }
    };
    checkLoginStatus();
  }, [navigation]);

  const handleLogin = async () => {

    try {
      const response = await apiLogin(email, password);
      console.log('Login response:', response.data);

      if (response.data.success) {
        console.log('Navigating to HomePage...');
        if (response.data.supervisor.role === "1969") { 
          const { accessToken } = response.data;
          setAuthToken(accessToken); 
          navigation.navigate('HomePage');
          console.log('Navigation complete.');
        } else {
          Alert.alert('Failed', 'You are not a Supervisor');
        }
      } else {
        Alert.alert('Failed', 'Invalid login credentials');
      }
    } catch (error: unknown) {
      console.error('Login failed:', error);

      if (axios.isAxiosError(error)) {
        console.error('Server response:', error.response?.data);
        Alert.alert('Error', error.response?.data?.message || 'An error occurred during login.');
      } else {
        Alert.alert('Error', 'An unknown error occurred.');
      }
    }
  };

  return (
    <ImageBackground
      source={require('../../assets/images/pngtree-simple-flat-cleaning-service-background-material-image_163841.jpg')}
      style={styles.background}
      resizeMode="cover"
    >
      <View style={styles.container}>
        <Text style={styles.title}>Supervisor Login</Text>

        <TextInput
          style={styles.input}
          placeholder="Email"
          value={email}
          onChangeText={setEmail}
        />

        <TextInput
          style={styles.input}
          placeholder="Password"
          value={password}
          onChangeText={setPassword}
          secureTextEntry
        />

        <Button title="Login as Supervisor" onPress={handleLogin} />
      </View>
    </ImageBackground>
  );
};

const styles = StyleSheet.create({
  background: {
    flex: 1,
  },
  container: {
    flex: 1,
    justifyContent: 'center',
    padding: 20,
    backgroundColor: 'rgba(255, 255, 255, 0.8)', 
    borderRadius: 10,
    margin: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
    textAlign: 'center',
  },
  input: {
    height: 40,
    borderColor: '#ccc',
    borderWidth: 1,
    borderRadius: 5,
    marginBottom: 15,
    paddingLeft: 10,
  },
});

export default LoginScreen;
