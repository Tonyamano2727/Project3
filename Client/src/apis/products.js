import axios from "../axios";

export const apiGetProducts = (params) =>
  axios({
    url: "/products/",
    method: "get",
    params,
  });
export const apiGetProduct = (pid) =>
  axios({
    url: "/products/" + pid,
    method: "get",
  });

export const apiCreateProduct = (data) =>
  axios({
    url: "/products/createdmanyproducts",
    method: "post",
    data,
  });

export const apiUpdateproduct = (data, pid) =>
  axios({
    url: "/products/" + pid,
    method: "put",
    data,
  });

export const apiDeleteproduct = (pid) =>
  axios({
    url: "/products/" + pid,
    method: "delete",
  });

export const apiRateProduct = ({ star, comment, pid }) =>
  axios({
    url: "products/ratings/",
    method: "put",
    data: { star, comment, pid },
});


export const apiImportProductsFromExcel = (formData) =>
  axios({
    url: "/products/import-excel",
    method: "post",
    data: formData,
    headers: { "Content-Type": "multipart/form-data" },
  });

