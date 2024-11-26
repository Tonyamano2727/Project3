import axios from "../axios";

export const apiGetEmployee = (params) =>
  axios({
    url: "/employee/getall",
    method: "get",
    params
  });