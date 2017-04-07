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
  baseURL: 'http://test.com'
})

/* eslint-disable no-new */
new Vue({
  store,
  router,
  el: '#app',
  render: h => h(Wrapper),
})
