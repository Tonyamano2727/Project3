import axios from "../axios";

export const apiGetServices = (params) =>
  axios({
    url: "/service/",
    method: "get",
    params,
  });
export const apiCreateServices = (data) =>
  axios({
    url: "/service/createservice",
    method: "post",
    data,
  });
export const apiGetDetailsServices = (sid) =>
  axios({
    url: "/service/" + sid,
    method: "get",
  });
export const apiUpdateServices = (data, sid) =>
  axios({
    url: "/service/updateservice/" + sid,
    method: "put",
    data
  });
  export const apiDeleteService = (sid) =>
    axios({
      url: "/service/deletedservice/" + sid,
      method: "delete",
    });
