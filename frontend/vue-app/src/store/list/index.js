import * as api from '@/api';

export default {
  namespaced: true,

  state: {
    lists: []
  },

  getters: {
    // lists 进行 filter 处理可能返回 null 或 空数组，需要进行处理
    getLists: ({ lists }) => boardId => lists.filter(list => list.boardId == boardId)
  },

  mutations: {
    updateLists: (state, datas) => {
      // 这里获取的是所有面板的列表，需要进行处理
      state.lists = [...state.lists, ...datas];
    },
    addList: (state, data) => {
      state.lists = [...state.lists, data];
    },
    updateList: (state, data) => {
      state.lists = state.lists.map(list => {
        if (list.id === data.id) {
          return { ...list, ...data };
        }
        return list;
      })
    }
  },

  actions: {
    getLists: async ({ commit }, boardId) => {
      try {
        let rs = await api.getLists(boardId);
        commit('updateLists', rs.data);
        return rs;
      } catch (error) {
        throw error;
      }
    },
    postList: async ({ commit }, data) => {
      try {
        let rs = await api.postList(data);
        commit('addList', rs.data);
        return rs;
      } catch (error) {
        throw error;
      }
    },
    editList: async ({ commit }, data) => {
      try {
        let rs = await api.putList(data);
        commit('updateList', rs.data);
        return rs;
      } catch (error) {
        throw error;
      }
    }
  }
}