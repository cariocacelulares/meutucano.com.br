export default {
  'lines/list/FETCH' (context, params) {
    return axios.get('lines' + params)
  },
}
