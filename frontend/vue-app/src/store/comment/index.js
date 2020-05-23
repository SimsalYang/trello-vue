import * as api from '@/api';

export default {
  namespaced: true,

  state: {

  },

  mutations: {

  },

  actions: {
    getComments: async ({ }, data) => {
      return api.getComments(data);
    },

    postComment: async ({ }, data) => {
      return api.postComment(data);
    }
  }
}