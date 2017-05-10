export default {
  'products/detail/depots/serials/FETCH' (context, params) {
    return axios.get('serials/list' + params)
  },
}
