import { User } from '../services'

export default {
  'global/SIGN_OUT' (context, redirect = null) {
    context.commit('global/TOKEN_RECEIVED', null);
    context.commit('global/USER_RECEIVED', null);
  },

  'global/FETCH_USER' (context, token) {
    return User.get()
      .then(response => {
        context.commit('global/USER_RECEIVED', response.data.user);
      })
      .catch(error => {
        console.log(error);
      })
  }
}
