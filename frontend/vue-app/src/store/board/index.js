import * as api from '@/api';

export default {
  namespaced: true,

  state: {
    // 是否初始化过标识，用于从面板页返回首页进行面板列表渲染
    inited: false,
    // boards 设置为 null，方便判断当前是首次获取还是获取到的是空数据
    boards: null
  },

  getters: {
    getBoard: ({ boards }) => id => Array.isArray(boards) ? boards.find(board => board.id == id) : null
  },

  mutations: {
    updateBoards: (state, data) => {
      state.boards = data;
      // 拿到数据后，更新初始化标识
      state.inited = true;
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
      } catch (e) { }
    },
    getBoard: async ({ commit }, id) => {
      try {
        let rs = await api.getBoard(id);
        commit('addBoard', rs.data);
        return rs;
      } catch (e) { }
    }
  }
}

