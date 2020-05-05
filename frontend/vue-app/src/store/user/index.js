import { register, login } from '@/api';
export default {
  // 让模块之间互不干扰
  namespaced: true,
  state: {
    // 用户登录信息
    info: null
  },
  mutations: {
    // 初次打开链接或刷新的时候从 localStorage 中获取 token
    initUserInfo: state => {
      try {
        let data = JSON.parse(localStorage.getItem('user'));
        state.info = data;
      } catch (error) { }
    },
    updateUserInfo: (state, data) => {
      state.info = data;

      // 存储用户信息
      localStorage.setItem('user', JSON.stringify(data));
    },
    removeUserInfo: (state, data) => {
      // 清空用户信息
      state.info = null;
      // 删除 localStorage 中的用户条目
      localStorage.removeItem('user');
    }
  },
  actions: {
    register: async ({ }, data) => {
      return register(data);
    },
    login: async ({ commit }, data) => {
      try {
        let rs = await login(data);
        commit('updateUserInfo', {
          id: rs.data.id,
          name: rs.data.name,
          authorization: rs.headers.authorization
        })
        return rs;
      } catch (error) { }
    },
    logout: async ({ commit }) => {
      commit('removeUserInfo');
    }
  }
}