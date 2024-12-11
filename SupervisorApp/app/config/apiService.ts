import axios from 'axios';
import API_CONFIG from './apiConfig';

// Cấu hình một instance của Axios với baseURL đã định nghĩa
export const axiosInstance = axios.create({
    baseURL: API_CONFIG.BASE_URL,
  });

// Hàm để thiết lập token
export const setAuthToken = (token: string) => {
    axiosInstance.defaults.headers.common['Authorization'] = `Bearer ${token}`;
    console.log('Authorization Header Set:', axiosInstance.defaults.headers.common['Authorization']); 
  };

// Hàm đăng nhập
export const apiLogin = (email: string, password: string) => {
  const url = `${API_CONFIG.ENDPOINTS.LOGIN}`;
  return axiosInstance.post(url, { email, password });
};

// Hàm lấy danh sách nhân viên
export const apiGetEmployeeList = () => {
    const url = `${API_CONFIG.ENDPOINTS.EMPLOYEE_LIST}`;
    return axiosInstance.get(url);
  };

// Hàm tạo nhân viên mới
export const apiCreateEmployee = async (employeeData: any) => {
  const url = `${API_CONFIG.BASE_URL}${API_CONFIG.ENDPOINTS.CREATE_EMPLOYEE}`;
  
  try {
    console.log("Sending request to:", url);
    console.log("Request Data:", employeeData);

    const formData = TransferToFormData(employeeData)

    const response = await axiosInstance.post(url, formData, {
      headers: {
        'Content-Type': 'multipart/form-data', 
        'Accept': 'application/json',
      },
    });

    console.log("Response:", response.data); 
    return response;
  } catch (error) {
    console.error("Error during employee creation:", error);
    if (axios.isAxiosError(error)) {
      console.error("Axios error details:", error.response?.data);
    }
    throw error;
  }
};

export const apiGetServiceCategory = () => {
  const url = `${API_CONFIG.ENDPOINTS.GET_SERVICECATEGORY}`;
  return axiosInstance.get(url);
}

// Hàm cập nhật thông tin nhân viên
export const apiUpdateEmployee = (eid: string, data: any) => {
  const url = `${API_CONFIG.ENDPOINTS.UPDATE_EMPLOYEE}/${eid}`;
  return axiosInstance.put(url, data);
};

// Hàm lấy thông tin lương
export const apiGetSalary = () => {
  const url = `${API_CONFIG.ENDPOINTS.SALARY}`;
  return axiosInstance.get(url);
};

// Hàm quản lý đặt chỗ (lấy danh sách đặt chỗ)
export const apiManageBooking = () => {
  const url = `${API_CONFIG.ENDPOINTS.MANAGE_BOOKING}`;
  return axiosInstance.get(url);
};

// Hàm cập nhật đặt chỗ
export const apiUpdateBooking = (data: any, bkid: string) => {
  const url = `${API_CONFIG.ENDPOINTS.UPDATE_BOOKING}/${bkid}`;
  return axiosInstance.put(url, data);
};

// Hàm lấy chi tiết đặt chỗ
export const apiGetDetailBooking = (bkid: string) => {
  const url = `${API_CONFIG.ENDPOINTS.GET_DETAIL_BOOKING}/${bkid}`;
  return axiosInstance.get(url);
};

// Hàm lấy địa chỉ của giám sát
export const apiGetSupervisorDistrict = () => {
  const url = `${API_CONFIG.ENDPOINTS.GET_SUPERVISOR_DISTRICT}`;
  return axiosInstance.get(url)
}

export const TransferToFormData = (data: any) => {
  const formData = new FormData();

  for (const key in data) {
    if (data[key] === undefined) {
      continue;
    } else if (Array.isArray(data[key])) {
      data[key].forEach((item: any) => {
        formData.append(key, item as any);
      });
    } else {
      formData.append(key, data[key] as any);
    }
  }

  return formData;
}