import axios from 'axios';
import VMessage from '../components/VMessage/VMessage.js';

axios.defaults.baseURL = process.env.VUE_APP_SERVER_API_PATH;
// 配置 axios 的请求拦截器
// 从 localStorage 中取出 user 信息，
// 并将其绑定到 headers 中
axios.interceptors.request.use(configs => {
  try {
    let data = JSON.parse(localStorage.getItem('user'));
    if (data.authorization) {
      configs.headers.common.authorization = data.authorization;
    }
  } catch (error) {

  }
  return configs;
})
// 错误统一处理
axios.interceptors.response.use(response => {
  return response;
}, error => {
  // console.dir(error);
  let { message, errorDetails } = error.response.data;
  if (errorDetails) {
    message += ' : ' + errorDetails;
  }
  // console.log(message);
  // 提示统一的错误信息
  VMessage.error(message);
  // 抛出错误
  throw error;
})

// 注册
export const register = data => {
  return axios({
    method: 'post',
    url: '/user/register',
    data
  })
}

// 登录
export const login = data => {
  return axios({
    method: 'post',
    url: '/user/login',
    data
  })
}
