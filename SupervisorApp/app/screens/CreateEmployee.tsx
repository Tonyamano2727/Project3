import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  TextInput,
  Button,
  Alert,
  ScrollView,
  TouchableOpacity,
  ImageBackground,
  StyleSheet,
} from "react-native";
import { Picker } from "@react-native-picker/picker";
import * as ImagePicker from "expo-image-picker";
import * as FileSystem from "expo-file-system";
import { useForm, Controller } from "react-hook-form";
import { apiCreateEmployee, apiGetSupervisorDistrict, apiGetServiceCategory } from "../config/apiService";
import houseCleaningTools from '../../assets/images/house-cleaning-tools.jpg'; 

const CreateEmployee = () => {
  const { control, handleSubmit, reset } = useForm();
  const [jobCategories, setJobCategories] = useState<{ id: string; value: string }[]>([]);
  const [districts, setDistricts] = useState<{ id: string; value: string }[]>([]);
  const [district, setDistrict] = useState<string>("");
  const [job, setJob] = useState<string>("");
  const [avatarFile, setAvatarFile] = useState<{
    uri: string;
    name: string;
    type: string
  } | null>(null);
  const [loadingStatus, setLoadingStatus] = useState<string | null>(null);

  useEffect(() => {
    const fetchDistricts = async () => {
      try {
        const response = await apiGetSupervisorDistrict();
        if (response.data.success) {
          setDistricts(
            response.data.districts.map((dist: string) => ({
              id: dist,
              value: dist,
            }))
          );
        } else {
          Alert.alert("Error", "Failed to load districts.");
        }
      } catch (error) {
        Alert.alert("Error", "An error occurred while fetching districts.");
      }
    };

    const fetchJobCategories = async () => {
      try {
        const response = await apiGetServiceCategory();
        const data = response.data; 

        if (data.success) {
          setJobCategories(
            data.categories.map((job: any) => ({
              id: job._id,
              value: job.title,
            }))
          );
        } else {
          Alert.alert("Error", "Failed to fetch job categories.");
        }
      } catch (error) {
        Alert.alert("Error", "An error occurred while fetching job categories.");
        console.error("API Error:", error);
      }
    };

    fetchDistricts();
    fetchJobCategories();
  }, []);

  const pickAvatar = async () => {
    try {
      const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
      if (status !== "granted") {
        Alert.alert("Permission required", "You need to grant permission to access the camera roll.");
        return;
      }

      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        allowsEditing: true,
        aspect: [1, 1],
        quality: 1,
      });

      if (result.canceled) {
        Alert.alert("Cancelled", "You cancelled the image picker.");
        return;
      }

      if (result.assets && result.assets.length > 0) {
        const file = result.assets[0];
        const fileInfo = await FileSystem.getInfoAsync(file.uri);

        if (!fileInfo.exists) {
          Alert.alert("Error", "File does not exist.");
          return;
        }

        setAvatarFile({
          uri: file.uri,
          name: file.fileName || "avatar.jpg",
          type: file.mimeType || "image/jpeg",
        });
      } else {
        Alert.alert("Error", "No file selected.");
      }
    } catch (error) {
      console.error("Picker Error:", error);
      Alert.alert("Error", "An unexpected error occurred.");
    }
  };

  const onSubmit = async (data: any) => {
    // Validate email
    const emailRegex = /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|.(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    if (!emailRegex.test(data.email)) {
      Alert.alert("Validation Error", "Please enter a valid email address.");
      return;
    }
  
    // Validate phone
    const phoneRegex = /^\d{10,11}$/;
    if (!phoneRegex.test(data.mobile)) {
      Alert.alert("Validation Error", "Phone number must be 10 or 11 digits.");
      return;
    }
  
    // Validate base salary
    const salary = Number(data.baseSalary.replace(/\D/g, ""));
    if (isNaN(salary) || salary <= 0) {
      Alert.alert("Validation Error", "Base salary must be a positive number.");
      return;
    }
  
    // Set loading status
    setLoadingStatus("Loading");
    let dots = 0;
    const interval = setInterval(() => {
      dots = (dots + 1) % 4; 
      setLoadingStatus(`Loading${'.'.repeat(dots)}`);
    }, 100);
  
    try {
      const payload = {
        name: data.name,
        email: data.email,
        mobile: data.mobile,
        baseSalary: String(salary),
        district,
        job,
        avatar: avatarFile || null,
      };
  
      const response = await apiCreateEmployee(payload);
      if (response.data.success) {
        clearInterval(interval);
        setLoadingStatus("Success!");
        setTimeout(() => setLoadingStatus(null), 2000); 
        reset();
        setDistrict("");
        setJob("");
        setAvatarFile(null);
      } else {
        clearInterval(interval);
        setLoadingStatus(null);
      }
    } catch (error) {
      clearInterval(interval);
      setLoadingStatus(null);
      Alert.alert("Error", "An unexpected error occurred.");
    }
  };

  return (
    <ImageBackground
      source={houseCleaningTools} 
      style={{ flex: 1, padding: 16 }} 
    >
      <ScrollView contentContainerStyle={{ padding: 16 }}>
        <Text style={{ fontSize: 24, textAlign: "center", marginBottom: 20, color: 'white' }}>
          Create Employee
        </Text>

        <Text style={{ color: 'white' }}>Name</Text>
        <Controller
          control={control}
          name="name"
          rules={{ required: "Name is required" }}
          render={({ field: { onChange, value } }) => (
            <TextInput
              style={styles.inputStyle} 
              placeholder="Name Employee"
              value={value}
              onChangeText={onChange}
            />
          )}
        />

        <Text style={{ color: 'white' }}>Email</Text>
        <Controller
          control={control}
          name="email"
          rules={{ required: "Email is required" }}
          render={({ field: { onChange, value } }) => (
            <TextInput
              style={styles.inputStyle} 
              placeholder="Email Employee"
              keyboardType="email-address"
              value={value}
              onChangeText={onChange}
            />
          )}
        />

        <Text style={{ color: 'white' }}>Mobile</Text>
        <Controller
          control={control}
          name="mobile"
          rules={{ required: "Mobile is required" }}
          render={({ field: { onChange, value } }) => (
            <TextInput
              style={styles.inputStyle} 
              placeholder="Mobile Employee"
              keyboardType="phone-pad"
              value={value}
              onChangeText={onChange}
            />
          )}
        />

        <Text style={{ color: 'white' }}>Base Salary</Text>
        <Controller
          control={control}
          name="baseSalary"
          rules={{ required: "Base Salary is required" }}
          render={({ field: { onChange, value } }) => (
            <TextInput
              style={styles.inputStyle}
              placeholder="Base Salary Employee"
              keyboardType="numeric"
              value={value ? new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(Number(value.replace(/\D/g, ""))) : ""}
              onChangeText={(text) => onChange(text.replace(/\D/g, ""))} 
            />
          )}
        />

        <Text style={{ color: 'white' }}>District</Text>
        <Picker
          selectedValue={district}
          onValueChange={(itemValue: string) => setDistrict(itemValue)}
          style={styles.selectStyle} 
        >
          <Picker.Item label="Select District" value="" />
          {districts.map((dist) => (
            <Picker.Item key={dist.id} label={dist.value} value={dist.value} />
          ))}
        </Picker>

        <Text style={{ color: 'white' }}>Job Category</Text>
        <Picker
          selectedValue={job}
          onValueChange={(itemValue: string) => setJob(itemValue)}
          style={styles.selectStyle} 
        >
          <Picker.Item label="Select Job Category" value="" />
          {jobCategories.map((job) => (
            <Picker.Item key={job.id} label={job.value} value={job.value} />
          ))}
        </Picker>

        <Text style={{ color: 'white' }}>Avatar</Text>
        <TouchableOpacity
          style={{
            backgroundColor: "#007AFF",
            padding: 10,
            marginBottom: 10,
            borderRadius: 5,
          }}
          onPress={pickAvatar}
        >
          <Text style={{ color: "#fff", textAlign: "center" }}>
            {avatarFile ? "Change Avatar" : "Choose Avatar"}
          </Text>
        </TouchableOpacity>
        {avatarFile && <Text style={{ color: 'white' }}>Selected File: {avatarFile.name}</Text>}

        {/* Hiển thị trạng thái loading */}
        {loadingStatus && (
          <View style={styles.overlay}>
            <Text style={styles.overlayText}>{loadingStatus}</Text>
          </View>
        )}

        <Button title="Create Employee" onPress={handleSubmit(onSubmit)} />
      </ScrollView>
    </ImageBackground>
  );
};

const styles = StyleSheet.create({
  overlay: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(0, 0, 0, 0.5)", 
    zIndex: 10,
  },
  overlayText: {
    fontSize: 20,
    fontWeight: "bold",
    color: "#fff",
  },
  inputStyle : {
    borderWidth: 1,
    borderColor: "#ddd",
    padding: 12,
    marginVertical: 8,
    borderRadius: 8,
    backgroundColor: "#f9f9f9",
  },
  selectStyle : {
    borderWidth: 1,
    borderColor: "#ddd",
    padding: 12,
    marginVertical: 8,
    borderRadius: 8,
    backgroundColor: "#f9f9f9",
    height: 48,
  },
});

export default CreateEmployee;
