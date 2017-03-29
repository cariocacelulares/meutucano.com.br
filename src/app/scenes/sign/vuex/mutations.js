import * as types from './types'
import { isEmpty } from 'lodash'

export default {

    [types.TOKEN] (state, token) {
        if (!isEmpty(token)) {
            localStorage.setItem('token', token)
        } else {
            localStorage.removeItem('token')
        }

        state.token = token
    },

    [types.USER] (state, user) {
        state.user = user
    }

}
