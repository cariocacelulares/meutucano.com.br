import { SignIn } from '../services'

export default {
  'sign/LOGIN_ATTEMPT' (context, request) {
    const credentials = {
      email: request.email,
      password: request.password
    };

    return SignIn.authenticate(credentials)
      .then(response => {
        context.commit('global/TOKEN_RECEIVED', response.data.token);
        context.dispatch('global/FETCH_USER', response.data.token);
      })
      .catch(error => {
        console.log(error);
      })
  },
}