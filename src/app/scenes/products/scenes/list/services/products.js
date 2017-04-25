export default {
  getList (page) {
    if (page > 1) {
      page = '?page=' + page
    } else {
      page = ''
    }

    return axios.get('produtos/list' + page)
  }
}
