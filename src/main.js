import Vue from 'vue'
import store from 'common/vuex';
import router from './router'
import Wrapper from './Wrapper'

import VueProgressBar from 'vue-progressbar'
import VueBreadcrumbs  from 'vue2-breadcrumbs'

import Helpers from './imports/helpers'
import Axios from './imports/axios'

import * as layoutComponents from 'common/layout'
Object.keys(layoutComponents).map((component) => {
  Vue.component(component, layoutComponents[component])
})

import * as globalComponents from 'common/components'
Object.keys(globalComponents).map((component) => {
  Vue.component(component, globalComponents[component])
})

/**
 * Globals
 */
window.Vue = Vue

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

/**
 * Check if user has the requiredPermissions
 *
 * @param  {String} requiredPermissions
 * @return {Boolean}
 */
Vue.prototype.$can = ( ...requiredPermissions ) =>
  (_.difference(requiredPermissions, store.getters['global/GET_USER'].permissions).length === 0)

/* eslint-disable no-new */
new Vue({
  store,
  router,
  el: '#app',
  render: h => h(Wrapper),
})
