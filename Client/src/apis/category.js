import axios from "../axios";

export const apiGetCategory = (params) =>
  axios({
    url: "/productCategory/",
    method: "get",
    params,
  });