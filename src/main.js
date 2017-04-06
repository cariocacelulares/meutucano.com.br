import Vue from 'vue'
import store from 'common/vuex';
import router from './router'
import Wrapper from './Wrapper'
 
/**
 * Globals
 */
window.Vue = Vue;

/* eslint-disable no-new */
new Vue({
  store,
  router,
  el: '#app',
  render: h => h(Wrapper),
})
