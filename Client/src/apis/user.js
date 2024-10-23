import axios from "../axios";
export const apiRegister = (data) => axios({
    url: '/user/register',
    method: 'post',
    data : data
})
export const apiLogin = (data) => axios({
    url: '/user/login',
    method: 'post',
    data : data
})
export const apiForgotPassword = (data) => axios({
    url: '/user/forgotpassword',
    method: 'post',
    data : data
})

export const apiResetPassword = (data) => axios({
    url: '/user/resetpassword',
    method: 'put',
    data : data
})

export const apigetcurrent = () => axios({
    url: '/user/current',
    method: 'get',
})

export const apigetuser = (params) => axios({
    url: '/user/',
    method: 'get',
    params
})
export const apiupdateUserbyadmin = (data , uid) => axios({
    url: '/user/' + uid,
    method: 'put',
    data
})
export const apideleteUser = (uid) => axios({
    url: '/user/' + uid,
    method: 'delete',
})
export const apiupdateUser = (data) => axios({
    url: '/user/current',
    method: 'put',
    data
})
export const apiupdatecart = (data) => axios({
    url: '/user/cart',
    method: 'put',
    data
})
export const apiremovecart = (pid) => axios({
    url: '/user/remove-cart/' + pid,
    method: 'delete',
})

export const apicreateorder = (data) => axios({
    url: '/order/',
    method: 'post',
    data
})

export const apigetorder = (params) => axios({
    url: '/order/getorderadmin',
    method: 'get',
    params
})
export const apiupdatestatusorder = (data , oid) => axios({
    url: '/order/status/' +oid,
    method: 'put',
    data
})
export const apigetorderyuser = (params) => axios({
    url: '/order/',
    method: 'get',
    params
})

export const apiupdatewhislist = (pid) => axios({
    url: '/user/whistlist/' + pid,
    method: 'put',

})