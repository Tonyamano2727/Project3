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
} from "react-native";
import { Picker } from "@react-native-picker/picker";
import * as ImagePicker from "expo-image-picker";
import * as FileSystem from "expo-file-system";
import { useForm, Controller } from "react-hook-form";
import { apiCreateEmployee, apiGetSupervisorDistrict, apiGetServiceCategory } from "../config/apiService";
import houseCleaningTools from '../../assets/images/house-cleaning-tools.jpg'; // Đường dẫn đến ảnh nền

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
    try {
      const payload = {
        name: data.name,
        email: data.email,
        mobile: data.mobile,
        baseSalary: String(Number(data.baseSalary)),
        district,
        job,
        avatar: avatarFile || null, // Sử dụng base64
      };

      console.log("Payload Content:", payload);

      const response = await apiCreateEmployee(payload);
      console.log("Response:", response.data);

      if (response.data.success) {
        Alert.alert("Success", "Employee created successfully!");
        reset();
        setDistrict("");
        setJob("");
        setAvatarFile(null);
      } else {
        Alert.alert("Error", response.data.mes || "Failed to create employee.");
      }
    } catch (error) {
      console.error("Error:", error);
    }
  };

  const inputStyle = {
    borderWidth: 1,
    borderColor: "#ddd",
    padding: 12,
    marginVertical: 8,
    borderRadius: 8,
    backgroundColor: "#f9f9f9",
  };

  const selectStyle = {
    borderWidth: 1,
    borderColor: "#ddd",
    padding: 12,
    marginVertical: 8,
    borderRadius: 8,
    backgroundColor: "#f9f9f9",
    height: 48,
  };

  return (
    <ImageBackground
      source={houseCleaningTools} // Sử dụng hình nền từ assets
      style={{ flex: 1, padding: 16 }} // Đảm bảo bao phủ toàn bộ màn hình
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
              style={inputStyle} // Sử dụng inputStyle
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
              style={inputStyle} // Sử dụng inputStyle
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
              style={inputStyle} // Sử dụng inputStyle
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
              style={inputStyle} // Sử dụng inputStyle
              placeholder="Base Salary Employee"
              keyboardType="numeric"
              value={value}
              onChangeText={onChange}
            />
          )}
        />

        <Text style={{ color: 'white' }}>District</Text>
        <Picker
          selectedValue={district}
          onValueChange={(itemValue: string) => setDistrict(itemValue)}
          style={selectStyle} // Sử dụng selectStyle
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
          style={selectStyle} // Sử dụng selectStyle
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

        <Button title="Create Employee" onPress={handleSubmit(onSubmit)} />
      </ScrollView>
    </ImageBackground>
  );
};

export default CreateEmployee;
