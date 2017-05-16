import axios from 'axios'
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
    const token = localStorage.getItem('auth_token')

    if (!isEmpty(token)) {
      config.headers.Authorization = `Bearer ${token}`
    }

    return config
  },
  (error) => {
    return Promise.reject(error)
  }
)
