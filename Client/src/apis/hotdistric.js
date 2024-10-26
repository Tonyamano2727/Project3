import axios from "../axios";

export const gethotdistric = () =>
  axios({
    url: "/hotdistric/",
    method: "get",
  });
