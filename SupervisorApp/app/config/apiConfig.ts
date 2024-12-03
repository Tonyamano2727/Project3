const API_CONFIG = {
    BASE_URL: 'http://192.168.2.243:5000/api',
    ENDPOINTS: {
      LOGIN: '/supervisor/login',
      EMPLOYEE_LIST: '/employee/getallwithrole',
      CREATE_EMPLOYEE: '/employee/registeremployee',
      UPDATE_EMPLOYEE: '/employee/updateemployee',
      SALARY: '/salary',
      MANAGE_BOOKING: '/booking/getbooking',
      UPDATE_BOOKING: '/booking/updatebooking',
      GET_DETAIL_BOOKING: '/booking/getbooking',
    },
  };
  
  export default API_CONFIG;