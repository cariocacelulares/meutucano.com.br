import Vue from 'vue'
import store from 'common/vuex';
import router from './router'
import Wrapper from './Wrapper'
import VueBreadcrumbs  from 'vue2-breadcrumbs'
import Helpers from './imports/helpers'
import Axios from './imports/axios'

/**
 * Globals
 */
window.Vue = Vue;

/**
 * Breadcrumbs
 */
Vue.use(VueBreadcrumbs)

/* eslint-disable no-new */
new Vue({
  store,
  router,
  el: '#app',
  render: h => h(Wrapper),
})
