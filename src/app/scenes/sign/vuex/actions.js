import * as types from './types'
import { Sign } from '../services'
import { User } from '../services'

export default {
  [types.LOGIN_ATTEMPT] (context, request) {
    const credentials = {
      email: request.email,
      password: request.password
    };

    return Sign.authenticate(credentials)
      .then(response => {
        context.commit(types.TOKEN_RECEIVED, response.data.token);
        context.dispatch(types.FETCH_USER, response.data.token);
      })
      .catch(error => {
        console.log(error);
      })
  },

  [types.FETCH_USER] (context, token) {
    return User.get()
      .then(response => {
        context.commit(types.USER_RECEIVED, response.data.user);
      })
      .catch(error => {
        console.log(error);
      })
  },

  [types.FORGOT_PASSWORD] (context, email) {
    return Sign.forgotPassword(email)
      .then(response => {
        console.log(response);
      })
      .catch(error => {
        console.log(error);
      })
  }
}
