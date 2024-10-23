import axios from "../axios";

export const getallblogs = (params) =>
  axios({
    url: "/blog/",
    method: "get",
    params,
  });
export const getdetailsblogs = (bid) =>
  axios({
    url: "/blog/getoneblogs/" + bid,
    method: "get",
  });

export const apiCreateBlogs = (data) =>
    axios({
      url: "/blog/createblog",
      method: "post",
      data,
});

export const apiDeleteBlog = (bid) =>
  axios({
    url: "/blog/" + bid,
    method: "delete",
  });
export const createComment = (bid , data) =>
    axios({
      url: "/blog/createcommentblog/" + bid,
      method: "post",
      data
});
export const likeBlog = (bid , data) =>
  axios({
    url: "/blog/likes/" + bid,
    method: "put",
    data
});

export const dislikeBlog  = (bid , data) =>
  axios({
    url: "/blog/dislikes/" + bid,
    method: "put",
    data
});

export const apiUpdateblogs = (data, bid) =>
  axios({
    url: `blog/updateblog/` + bid,
    method: "put",
    data,
  });
