import Vue from 'vue'
import store from 'common/vuex';
import router from './router'
import Wrapper from './Wrapper'

import VueProgressBar from 'vue-progressbar'
import VueBreadcrumbs  from 'vue2-breadcrumbs'

import Helpers from './imports/helpers'
import Axios from './imports/axios'
import moment from 'moment'

import { default as CommonTransformer } from 'common/transformer'

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
window.moment = moment
moment.locale('pt-BR')

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

const Dialog = Vue.extend({
  template: `
    <transition name="fade">
      <div v-if="show" class="confirm-dialog" @click="show = false">
        <div class="confirm-content" @click.stop>
          <Icon name="exclamation-triangle" color="dark" />
          <div>
            <h1>Você tem certeza?</h1>
            <span>Esta ação não poderá ser desfeita!</span>
            <div>
              <TButton @click="show = false" leftIcon="times" color="light" text="darker">Voltar</TButton>
              <TButton @click="show = doConfirm()" leftIcon="check" color="info" text="white">Confirmar</TButton>
            </div>
          </div>
        </div>
      </div>
    </transition>
  `
})

Vue.directive('confirm', {
  bind(el, binding, vnode) {
    const onConfirm = () => {
      binding.value()

      return false
    }

    el.handleClick = (e) => {
      const data = {
        doConfirm: onConfirm,
        show: true
      }

      let dialog = new Dialog({ data: data }).$mount()
      document.getElementById('app').appendChild(dialog.$el)

      const closeConfirm = () => {
        if (dialog.$data.show && event.keyCode == 27) {
          dialog.$data.show = false
          document.removeEventListener('keydown', closeConfirm)
        }
      }

      document.addEventListener('keydown', closeConfirm)
    }

    el.addEventListener('click', el.handleClick)
  },
  unbind(el) {
    el.removeEventListener('click', el.handleClick)
  }
})

const clipboardIcon = Vue.extend({
  template: `<Icon name="paperclip" class="m-l-5"/>`
})

Vue.directive('clipboard', {
  bind(el, binding, vnode) {
    const closeConfirm = () => {
      const app = document.getElementById('app')

      let clipboard = document.createElement('input')
      clipboard.type = 'text'
      clipboard.id = 'clipboard'
      clipboard.value = text
      app.appendChild(clipboard)

      document.getElementById('clipboard').select()
      document.execCommand('copy')

      app.removeChild(clipboard)
    }

    let text = binding.value

    if (!text) {
      text = el.innerHTML
    }

    text = text ? text.replace(/<[^>]*>/g, '') : null

    if (text) {
      el.appendChild((new clipboardIcon().$mount()).$el)
      el.className += ' clipboard'

      el.addEventListener('click', closeConfirm)
    }
  },
  unbind(el) {
    el.removeEventListener('click', el.closeConfirm)
  }
})

Vue.filter('money', (value) => CommonTransformer.monetary(value))
Vue.filter('date', (value) => CommonTransformer.date(value))
Vue.filter('humanDiff', (value) => CommonTransformer.humanDiff(value))

/* eslint-disable no-new */
new Vue({
  store,
  router,
  el: '#app',
  render: h => h(Wrapper),
})
