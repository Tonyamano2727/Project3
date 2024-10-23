import axios from "axios";

const instance = axios.create({
  baseURL: process.env.REACT_APP_API_URI,
});

// Request interceptor to add Authorization header
instance.interceptors.request.use(
  function (config) {
    const accessToken = localStorage.getItem("accessToken"); // Use the correct key
    if (accessToken) {
      config.headers.Authorization = `Bearer ${accessToken}`;
    }
    return config;
  },
  function (error) {
    return Promise.reject(error);
  }
);

// Response interceptor to handle responses
instance.interceptors.response.use(
  function (response) {
    return response.data; // Return the response data
  },
  function (error) {
    return Promise.reject(error.response.data); // Return error response
  }
);

export default instance;
