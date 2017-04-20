import axios from 'axios'

window.axios = axios.create({
  baseURL: 'http://localhost/meutucano.com.br/public/api',
  timeout: 3000,
  withCredentials: true,
  transformRequest: [(data) => JSON.stringify(data.data)],
  headers: {
    'Accept': 'application/json',
    'Content-Type': 'application/json',
  }
})
