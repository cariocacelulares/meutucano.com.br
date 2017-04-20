import Vue from 'vue'
import Vuex from 'vuex'
import state from './state'
import actions from './actions'
import getters from './getters'
import modules from './modules'
import mutations from './mutations'

Vue.use(Vuex)

export default new Vuex.Store({ state, mutations, actions, getters, modules })
