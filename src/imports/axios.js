import axios from 'axios'
import store from 'common/vuex'
import { isEmpty } from 'lodash'

window.axios = axios.create({
  baseURL: 'http://localhost/meutucano.com.br/public/api',
  timeout: 3000,
  transformRequest: [(data) => JSON.stringify(data)],
  headers: {
    'Accept': 'application/json',
    'Content-Type': 'application/json',
  },
  responseType: 'json'
})

window.axios.interceptors.request.use(
  (config) => {
    let token = localStorage.getItem('auth_token')

    if (!isEmpty(token)) {
      let parsedToken = token.split('.')[1].replace('-', '+').replace('_', '/')
      parsedToken = JSON.parse(window.atob(parsedToken))

      if (parsedToken.exp < Date.now() / 1000 && config.url.search('/token') < 0) { // expired
        store.dispatch('global/REFRESH_TOKEN').then(
          (response) => {
            token = localStorage.getItem('auth_token')
          }
        )
      }

      config.headers.Authorization = `Bearer ${token}`
    }

    return config
  },
  (error) => {
    return Promise.reject(error)
  }
)
