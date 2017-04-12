import Vue from 'vue'
import axios from 'axios'
import store from 'common/vuex';
import router from './router'
import Wrapper from './Wrapper'

/**
 * Globals
 */
window.Vue = Vue;

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

/* eslint-disable no-new */
new Vue({
  store,
  router,
  el: '#app',
  render: h => h(Wrapper),
})
