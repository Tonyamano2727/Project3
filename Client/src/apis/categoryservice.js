import axios from "../axios";

export const apicreatecategoryservice = (data) =>
  axios({
    url: "/categoryservice/createcategoryservice",
    method: "post",
    data,
  });
export const apigetallcategoryservice = (params) =>
  axios({
    url: "/categoryservice/",
    method: "get",
    params,
  });
  export const apideletecategoryservice = (id) =>
    axios({
      url: "/categoryservice/deletecategoryservices/" + id,
      method: "delete",
    });