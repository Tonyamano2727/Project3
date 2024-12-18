const API_CONFIG = {
    BASE_URL: 'http://192.168.20.68:5000/api',
    ENDPOINTS: {
      LOGIN: '/supervisor/login',
      EMPLOYEE_LIST: '/employee/getallwithrole',
      CREATE_EMPLOYEE: '/employee/registeremployee',
      UPDATE_EMPLOYEE: '/employee/updateemployee',
      SALARY: '/salary',
      MANAGE_BOOKING: '/booking/getbooking',
      UPDATE_BOOKING: '/booking/updatebooking',
      GET_DETAIL_BOOKING: '/booking/getbooking',
      GET_SUPERVISOR_DISTRICT: '/supervisor/districts',
      GET_SERVICECATEGORY: '/categoryservice',
    },
  };
  
  export default API_CONFIG;