export default {
  'brands/list/FETCH' (context, params) {
    return axios.get('brands' + params)
  },
}
