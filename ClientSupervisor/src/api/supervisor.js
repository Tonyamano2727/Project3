import axios from "../axios";

export const apiLoginSuperVisor = (data) =>
  axios({
    url: "/supervisor/login",
    method: "post",
    data: data,
  });

export const apiGetemployee = (data) =>
  axios({
    url: "/employee/getallwithrole",
    method: "get",
    data,
  });

export const apiGetbooking = (data) =>
  axios({
    url: "/booking/getbooking",
    method: "get",
    data,
  });

export const apiupdatebooking = (data, bkid) =>
  axios({
    url: "/booking/updatebooking/" + bkid,
    method: "put",
    data,
  });

export const apigetdetailbooking = (bkid) =>
  axios({
    url: "/booking/getbooking/" + bkid,
    method: "get",
  });

export const apiUpdateEmployee = (eid, data) =>
  axios({
    url: `/employee/updateemployee/${eid}`,
    method: "put",
    data,
  });
