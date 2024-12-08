import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  TextInput,
  Button,
  Alert,
  ScrollView,
  TouchableOpacity,
} from "react-native";
import { Picker } from "@react-native-picker/picker";
import * as ImagePicker from "expo-image-picker";
import { useForm, Controller } from "react-hook-form";
import { apiCreateEmployee, apiGetSupervisorDistrict } from "../config/apiService";

const CreateEmployee = () => {
  const { control, handleSubmit, reset } = useForm();
  const [jobCategories, setJobCategories] = useState<{ id: string; value: string }[]>([]);
  const [districts, setDistricts] = useState<{ id: string; value: string }[]>([]);
  const [district, setDistrict] = useState<string>("");
  const [job, setJob] = useState<string>("");
  const [avatarFile, setAvatarFile] = useState<{ uri: string; name: string; type: string } | null>(null);

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
        const response = await fetch("http://192.168.2.243:5000/api/categoryservice");
        const data = await response.json();
        if (data.success) {
          setJobCategories(
            data.categories.map((job: any) => ({
              id: job._id,
              value: job.title,
            }))
          );
        }
      } catch (error) {
        Alert.alert("Error", "An error occurred while fetching job categories.");
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

      console.log("Picker Result:", result);

      if (result.canceled) { 
        Alert.alert("Cancelled", "You cancelled the image picker.");
        return;
      }

      if (result.assets && result.assets.length > 0) {
        const file = result.assets[0];
        setAvatarFile({
          uri: file.uri,
          name: file.fileName || "avatar.jpg",
          type: file.type || "image/jpeg",
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
    try {
      const formData = new FormData();
      formData.append("name", data.name);
      formData.append("email", data.email);
      formData.append("mobile", data.mobile);
      formData.append("baseSalary", String(Number(data.baseSalary)));
      formData.append("district", district);
      formData.append("job", job);
  
      if (avatarFile) {
        const avatarBlob = await fetch(avatarFile.uri)
          .then((res) => res.blob())
          .then((blob) => blob);
  
        formData.append("avatar", avatarBlob, avatarFile.name);
      }
  
      console.log("Form Data Sent to API:", {
        name: data.name,
        email: data.email,
        mobile: data.mobile,
        baseSalary: Number(data.baseSalary),
        district,
        job,
        avatar: avatarFile,
      });
  
      const response = await apiCreateEmployee(formData);
  
      if (response.data.success) {
        Alert.alert("Success", "Employee created successfully!");
        reset();
        setDistrict("");
        setJob("");
        setAvatarFile(null);
      } else {
        Alert.alert("Error", response.data.mes || "Failed to create employee.");
        console.log("API Response Error:", response.data);
      }
    } catch (error: any) {
      Alert.alert("Error", "An error occurred while creating the employee.");
      console.log("API Error Details:", {
        message: error.message,
        response: error.response?.data,
        status: error.response?.status,
      });
    }
  };
  
  
  return (
    <ScrollView contentContainerStyle={{ padding: 16 }}>
      <Text style={{ fontSize: 24, textAlign: "center", marginBottom: 20 }}>
        Create Employee
      </Text>

      <Text>Name</Text>
      <Controller
        control={control}
        name="name"
        rules={{ required: "Name is required" }}
        render={({ field: { onChange, value } }) => (
          <TextInput
            style={{ borderWidth: 1, marginBottom: 10, padding: 8 }}
            placeholder="Name Employee"
            value={value}
            onChangeText={onChange}
          />
        )}
      />

      {/* Email Input */}
      <Text>Email</Text>
      <Controller
        control={control}
        name="email"
        rules={{ required: "Email is required" }}
        render={({ field: { onChange, value } }) => (
          <TextInput
            style={{ borderWidth: 1, marginBottom: 10, padding: 8 }}
            placeholder="Email Employee"
            keyboardType="email-address"
            value={value}
            onChangeText={onChange}
          />
        )}
      />

      {/* Mobile Input */}
      <Text>Mobile</Text>
      <Controller
        control={control}
        name="mobile"
        rules={{ required: "Mobile is required" }}
        render={({ field: { onChange, value } }) => (
          <TextInput
            style={{ borderWidth: 1, marginBottom: 10, padding: 8 }}
            placeholder="Mobile Employee"
            keyboardType="phone-pad"
            value={value}
            onChangeText={onChange}
          />
        )}
      />

      {/* Base Salary Input */}
      <Text>Base Salary</Text>
      <Controller
        control={control}
        name="baseSalary"
        rules={{ required: "Base Salary is required" }}
        render={({ field: { onChange, value } }) => (
          <TextInput
            style={{ borderWidth: 1, marginBottom: 10, padding: 8 }}
            placeholder="Base Salary Employee"
            keyboardType="numeric"
            value={value}
            onChangeText={onChange}
          />
        )}
      />

      {/* District Picker */}
      <Text>District</Text>
      <Picker
        selectedValue={district}
        onValueChange={(itemValue: string) => setDistrict(itemValue)}
        style={{ borderWidth: 1, marginBottom: 10 }}
      >
        <Picker.Item label="Select District" value="" />
        {districts.map((dist) => (
          <Picker.Item key={dist.id} label={dist.value} value={dist.value} />
        ))}
      </Picker>

      {/* Job Category Picker */}
      <Text>Job Category</Text>
      <Picker
        selectedValue={job}
        onValueChange={(itemValue: string) => setJob(itemValue)}
        style={{ borderWidth: 1, marginBottom: 10 }}
      >
        <Picker.Item label="Select Job Category" value="" />
        {jobCategories.map((job) => (
          <Picker.Item key={job.id} label={job.value} value={job.value} />
        ))}
      </Picker>

      {/* Avatar Picker */}
      <Text>Avatar</Text>
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
      {avatarFile && <Text>Selected File: {avatarFile.name}</Text>}

      {/* Submit Button */}
      <Button title="Create Employee" onPress={handleSubmit(onSubmit)} />
    </ScrollView>
  );
};

export default CreateEmployee;
