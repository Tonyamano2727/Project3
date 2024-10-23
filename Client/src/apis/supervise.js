import axios from "../axios";

export const apiGetsupervise = (params) =>
  axios({
    url: "/supervisor/getallsupervisor",
    method: "get",
    params,
  });

export const apiCreatesupervise = (data) =>
  axios({
    url: "/supervisor/registersup",
    method: "post",
    data,
  });
export const apiDeletesupervise = (spid) =>
  axios({
    url: "/supervisor/deletedsupervisor/" + spid,
    method: "delete",
  });
