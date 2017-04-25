import Vue from 'vue'
import store from 'common/vuex';
import router from './router'
import Wrapper from './Wrapper'

import VueProgressBar from 'vue-progressbar'
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

/**
 * Progressbar
 */
 Vue.use(VueProgressBar, {
  color: '#3C83EB',
  failedColor: '#F55753',
  thickness: '3px',
  transition: {
    speed: '0.2s',
    opacity: '0.6s'
  }
})

/* eslint-disable no-new */
new Vue({
  store,
  router,
  el: '#app',
  render: h => h(Wrapper),
})
