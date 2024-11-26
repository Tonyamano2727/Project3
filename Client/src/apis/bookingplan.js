import axios from "../axios";

export const createbookingplan = (data) =>
  axios({
    url: "/bookingplan/createbookingplan",
    method: "post",
    data,
  });
