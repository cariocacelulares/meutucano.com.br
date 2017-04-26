import { isEmpty } from 'lodash'

export default {
  getList (params) {
    return axios.get('produtos/list' + params)
  }
}
