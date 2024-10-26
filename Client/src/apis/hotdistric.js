import axios from "../axios";

export const gethotdistric = () =>
  axios({
    url: "/hotdistric/",
    method: "get",
  });

export const updatehotdistric = (data, did) =>
  axios({
    url: "/hotdistric/updatehotdistric/" + did ,
    method: "put",
    data
  });
