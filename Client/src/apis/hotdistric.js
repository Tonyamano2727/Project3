import axios from "../axios";

export const apicreatehotdistric = (data) =>
  axios({
    url: "/hotdistric/createhotdistric",
    method: "post",
    data,
  });

export const gethotdistric = () =>
  axios({
    url: "/hotdistric/",
    method: "get",
  });

export const updatehotdistric = (data, did) =>
  axios({
    url: "/hotdistric/updatehotdistric/" + did,
    method: "put",
    data,
  });
export const deletedhotdistric = ( did) =>
  axios({
    url: "/hotdistric/deletedhotdistric/" + did,
    method: "delete",
  });
