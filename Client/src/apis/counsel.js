import axios from "../axios";

export const createcounsel = (data) =>
  axios({
    url: "/counsel/createcounsel",
    method: "post",
    data,
  });
export const getallcounsel = (params) =>
  axios({
    url: "/counsel/getallcounsel",
    method: "get",
    params,
  });

  export const apiUpdatecounsel = (data, cid) =>
    axios({
      url: "/counsel/updatecounsel/" + cid,
      method: "put",
      data,
    });
