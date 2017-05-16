export default {
  'products/detail/depots/CURRENT' (context, depot) {
    context.commit('products/detail/depots/RECEIVED', depot)
  },

  'products/detail/depots/serials/FETCH' (context, params) {
    const depotId = context.getters['products/detail/depots/GET'].id

    return axios.get(`products/serials/from/${depotId}` + params)
  },
}
