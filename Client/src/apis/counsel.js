import axios from "../axios";

export const createcounsel = (data) =>
  axios({
    url: "/counsel/createcounsel",
    method: "post",
    data
  });

