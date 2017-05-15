export default {
  'sign/LOGIN_ATTEMPT' (context, request) {
    const credentials = {
      email: request.email,
      password: request.password
    }

    return axios.post('/authenticate', credentials)
      .then((response) => {
        context.commit('global/TOKEN_RECEIVED', response.token)
        context.dispatch('global/FETCH_USER', response.token)
      })
  },
}
