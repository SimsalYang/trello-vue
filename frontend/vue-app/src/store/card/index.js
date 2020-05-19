import * as api from '@/api';
export default {
  namespaced: true,

  state: {
    cards: []
  },

  getters: {
    getCards: ({ cards }) => boardListId => cards.filter(card => card.boardListId == boardListId),
    getCard: ({ cards }) => cardId => cards.find(card => card.id == cardId)
  },

  mutations: {
    updateCards: (state, datas) => {
      state.cards = [...state.cards, ...datas];
    },
    addCard: (state, data) => {
      state.cards = [...state.cards, data];
    },
    updateCard: (state, data) => {
      state.cards = state.cards.map(card => {
        if (card.id === data.id) {
          return { ...card, ...data };
        }
        return card;
      })
    },
    addAttachment: (state, data) => {
      state.cards = state.cards.map(card => {
        if (card.id == data.boardListCardId) {
          return {
            ...card,
            attachments: [...card.attachments, data]
          }
        }
        return card;
      })
    },
    setCover: (state, data) => {
      state.cards = state.cards.map(card => {
        // 找到对应的卡片
        if (card.id == data.cardId) {
          return {
            ...card,
            coverPath: card.attachments.filter(attachment => attachment.id == data.id)[0].path,
            attachments: card.attachments.map(attachment => {
              // 将当前卡片下的附件设置为封面
              return {
                ...attachment,
                isCover: attachment.id == data.id
              }
            })
          }
        }
        return card;
      })
    },
    removeCover: (state, data) => {
      state.cards = state.cards.map(card => {
        // 找到对应的卡片
        if (card.id == data.cardId) {
          return {
            ...card,
            coverPath: '',
            attachments: card.attachments.map(attachment => {
              // 将当前卡片下的所有附件设为 false
              return {
                ...attachment,
                isCover: false
              }
            })
          }
        }
        return card;
      })
    },
    deleteAttachment: (state, data) => {
      state.cards = state.cards.map(card => {
        if (card.id == data.cardId) {
          return {
            ...card,
            attachments: card.attachments.filter(attachment => attachment.id != data.id)
          }
        }
        return card;
      })
    },
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
    },
    editCard: async ({ commit }, data) => {
      try {
        let rs = await api.putCard(data);
        // 直接用现有数据更新
        commit('updateCard', data);
        return rs;
      } catch (error) {
        throw error;
      }
    },
    uploadAttachment: async ({ commit }, data) => {
      try {
        let rs = await api.uploadAttachment(data);
        commit('addAttachment', rs.data);
        return rs;
      } catch (error) {
        throw error;
      }
    },
    setCover: async ({ commit }, data) => {
      try {
        let rs = await api.setCover(data);
        commit('setCover', data);
        return rs;
      } catch (error) {
        throw error
      }
    },
    removeCover: async ({ commit }, data) => {
      try {
        let rs = await api.removeCover(data);
        commit('removeCover', data);
        return rs;
      } catch (error) {
        throw error
      }
    },

    deleteAttachment: async ({ commit }, data) => {
      try {
        let rs = await api.deleteAttachment(data);
        commit('deleteAttachment', data);
        return rs;
      } catch (error) {
        throw error
      }
    }
  }
}