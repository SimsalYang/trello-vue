import * as api from '@/api';

export default {
  namespaced: true,

  state: {
    // boards 设置为 null，方便判断当前是首次获取还是获取到的是空数据
    boards: null
  },

  mutations: {
    updateBoards: (state, data) => {
      state.boards = data;
    },
    addBoard: (state, data) => {
      if (state.boards === null) {
        state.boards = [];
      }
      state.boards = [...state.boards, data];
    }
  },

  actions: {
    getBoards: async ({ commit }) => {
      try {
        let rs = await api.getBoards();
        commit('updateBoards', rs.data);
        return rs;
      } catch (e) { }
    },

    postBoard: async ({ commit }, data) => {
      try {
        let rs = await api.postBoard(data);
        commit('addBoard', rs.data);
        return rs;
      } catch (e) {

      }
    }
  }
}

