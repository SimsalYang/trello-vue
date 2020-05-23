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

/**
 * 面板
 */

// 获取所有面板
export const getBoards = () => {
  return axios({
    method: 'get',
    url: '/board'
  });
}

// 获取一个面板
export const getBoard = (id) => {
  return axios({
    url: '/board/' + id
  })
}

// 创建新面板
export const postBoard = (data) => {
  return axios({
    method: 'post',
    url: '/board',
    data
  })
}

/**
 * 面板列表
 */
// 获取一个指定面板下的所有列表集合
export const getLists = boardId => {
  return axios({
    url: '/list',
    // axios 的 params 代表 queryString
    params: {
      boardId
    }
  })
}

// 添加一个新的列表
export const postList = data => {
  return axios({
    method: 'post',
    url: '/list',
    data
  })
}

// 编辑一个指定的列表
export const putList = data => {
  return axios({
    method: 'put',
    url: '/list/' + data.id,
    data: {
      boardId: data.boardId,
      name: data.name,
      order: data.order
    }
  })
}

/**
 * 卡片
 */

// 获取指定列表下所有卡片
export const getCards = (boardListId) => {
  return axios({
    url: '/card',
    params: {
      boardListId
    }
  })
}

// 添加一个卡片
export const postCard = (data) => {
  return axios({
    url: '/card',
    method: 'post',
    data
  })
}

// 编辑一个指定的卡片
export const putCard = data => {
  return axios({
    method: 'put',
    url: '/card/' + data.id,
    data: {
      boardListId: data.boardListId,
      name: data.name,
      description: data.description,
      order: data.order
    }
  })
}

// 上传附件
export const uploadAttachment = data => {
  let fd = new FormData();
  fd.append('boardListCardId', data.boardListCardId);
  fd.append('attachment', data.file);
  return axios({
    method: 'post',
    url: '/card/attachment',
    data: fd
  })
}

// 设置封面
export const setCover = data => {
  return axios({
    method: 'put',
    url: '/card/attachment/cover/' + data.id
  })
}

//移除封面
export const removeCover = data => {
  return axios({
    method: 'delete',
    url: '/card/attachment/cover/' + data.id
  })
}

// 删除附件
export const deleteAttachment = data => {
  return axios({
    method: 'delete',
    url: '/card/attachment/' + data.id
  })
}

// 获取评论
export const getComments = data => {
  return axios({
    method: 'get',
    url: '/comment',
    params: data
  })
}

// 添加评论
export const postComment = data => {
  return axios({
    method: 'post',
    url: '/comment',
    data
  })
}
