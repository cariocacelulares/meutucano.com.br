export default {
  'products/list/FETCH' (context, params) {
    return axios.get('produtos/list' + params)
  },
}
