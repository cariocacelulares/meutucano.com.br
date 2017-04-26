import Vue from 'vue'
import Vuex from 'vuex'

import { state as tableListState } from './tableList'
import { actions as tableListActions } from './tableList'
import { getters as tableListGetters } from './tableList'
import { mutations as tableListMutations } from './tableList'

import state from './state'
import actions from './actions'
import getters from './getters'
import modules from './modules'
import mutations from './mutations'

Vue.use(Vuex)

export default new Vuex.Store({
  state: Object.assign(state, tableListState),
  mutations: Object.assign(mutations, tableListMutations),
  actions: Object.assign(actions, tableListActions),
  getters: Object.assign(getters, tableListGetters),
  modules
})
