import axios from "../axios";

export const apiGetEmployee = () =>
  axios({
    url: "/employee/getall",
    method: "get",
  });