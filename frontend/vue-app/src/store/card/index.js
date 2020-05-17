import * as api from '@/api';
export default {
  namespaced: true,

  state: {
    cards: []
  },

  getters: {
    getCards: ({ cards }) => boardListId => cards.filter(card => card.boardListId == boardListId)
  },

  mutations: {
    updateCards: (state, datas) => {
      state.cards = [...state.cards, ...datas];
    },
    addCard: (state, data) => {
      state.cards = [...state.cards, data];
    }
  },

  actions: {
    getCards: async ({ commit }, boardListId) => {
      try {
        let rs = await api.getCards(boardListId);

        commit('updateCards', rs.data);

        return rs;
      } catch (error) {
        throw error;
      }
    },
    postCard: async ({ commit }, data) => {
      try {
        let rs = await api.postCard(data);
        commit('addCard', rs.data);
        return rs;
      } catch (error) {
        throw error;
      }
    }
  }
}