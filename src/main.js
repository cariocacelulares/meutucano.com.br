import Vue from 'vue'
import store from 'common/vuex';
import router from './router'
import Wrapper from './Wrapper'

import VueProgressBar from 'vue-progressbar'
import VueBreadcrumbs  from 'vue2-breadcrumbs'
import VTooltip from 'v-tooltip'
// import vSelect from 'vue-select'
import VueSelect from './imports/select'

import moment from 'moment'
import Helpers from './imports/helpers'
import Vars from './imports/vars'
import Axios from './imports/axios'
import VueHighcharts from './imports/vue2-highcharts/VueHighcharts'

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

Vue.component('vue-highcharts', VueHighcharts)
// Vue.component('v-select', vSelect)
Vue.component('v-select', VueSelect)


/**
 * Tooltips
 */
Vue.use(VTooltip)

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

Vue.prototype.$confirm = (callback, ...args) => {
  let dialog = new Dialog({ data: {
    show: true,
    doConfirm: () => {
      callback(...args)

      return false
    },
  }}).$mount()

  document.getElementById('app').appendChild(dialog.$el)

  const closeConfirm = () => {
    if (dialog.$data.show && event.keyCode == 27) {
      dialog.$data.show = false
      document.removeEventListener('keydown', closeConfirm)
    }
  }

  document.addEventListener('keydown', closeConfirm)
}

const clipboardIcon = Vue.extend({
  template: `<Icon name="paperclip" class="m-l-5"/>`
})

Vue.directive('clipboard', {
  componentUpdated(el, binding, vnode) {
    el.init(el, binding)
  },

  bind(el, binding, vnode) {
    const copyText = (text) => {
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

    el.init = (element, bind) => {
      if (element.classList.contains('clipboard')) {
        return
      }

      let text = bind.value

      if (!text) {
        text = element.innerHTML
      }

      text = text ? text.replace(/<[^>]*>/g, '') : null

      if (text) {
        element.appendChild((new clipboardIcon().$mount()).$el)
        element.className += ' clipboard'

        element.addEventListener('click', () => {
          copyText(text)
        })
      }
    }

    el.init(el, binding)
  },
  unbind(el) {
    el.removeEventListener('click', el.copyText)
  }
})

Vue.filter('money', (value) => CommonTransformer.monetary(value))
Vue.filter('humanDiff', (value) => CommonTransformer.humanDiff(value))
Vue.filter('dateTime', (value) => CommonTransformer.date(value))
Vue.filter('date', (value) => CommonTransformer.date(value).substring(0, 10))

Vue.filter('phone', (value) => {
  if (!value) {
    return value
  }

  value = value.match(/\d+/g, '').join('')

  const length = value.length

  if (length > 11) {
    return `+${value.substring(0, 2)} ` +
           `(${value.substring(2, 4)}) ` +
           `${value.substring(4, (length - 4))}-` +
           value.substring(length - 4)
  }

  return `(${value.substring(0, 2)}) ` +
         `${value.substring(2, (length - 4))}-` +
         value.substring(length - 4)
})

Vue.filter('taxvat', (value) => {
  if (!value) {
    return value
  }

  value = value.match(/\d+/g, '').join('')

  const length = value.length

  if (length > 11) {
    return `${value.substring(0, 2)}.` +
           `${value.substring(2, 5)}.` +
           `${value.substring(5, 8)}/` +
           `${value.substring(8, 12)}-` +
           value.substring(12)
  }

  return `${value.substring(0, 3)}.` +
         `${value.substring(3, 6)}.` +
         `${value.substring(6, 9)}-` +
         value.substring(9)
})

/* eslint-disable no-new */
new Vue({
  store,
  router,
  el: '#app',
  render: h => h(Wrapper),
})
