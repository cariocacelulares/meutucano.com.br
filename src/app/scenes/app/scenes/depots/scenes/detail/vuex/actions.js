export default {
  'depots/detail/products/SET_DEPOT' (context, depot) {
    context.commit('depots/detail/products/DEPOT_RECEIVED', depot)
  },

  'depots/detail/products/FETCH' (context, params) {
    const depot = context.getters['depots/detail/products/GET_DEPOT']

    return axios.get(`depots/products/from/depot/${depot}` + params)
  },
}
