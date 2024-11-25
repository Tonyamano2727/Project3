import axios from "../axios";
export const apiGetServicesplan = (params) =>
  axios({
    url: "/servicesplan/",
    method: "get",
    params,
  });
export const apiGetDetailsServicesplan = (sid) =>
  axios({
    url: "/servicesplan/" + sid,
    method: "get",
  });
