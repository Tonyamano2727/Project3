import axios from "../axios";

export const getallbooking = (params) =>
  axios({
    url: "/booking/getallbooking",
    method: "get",
    params,
  });

  export const createbooking = (data) =>
    axios({
      url: "/booking/createbooking",
      method: "post",
      data,
    });
