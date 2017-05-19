export default {
  'global/SIGN_OUT' (context) {
    context.commit('global/TOKEN_RECEIVED', null);
    context.commit('global/USER_RECEIVED', null);
  },

  'global/FETCH_USER' (context, token) {
    return axios.get('authenticate/user')
      .then(response => {
        context.commit('global/USER_RECEIVED', response.user);
      })
      .catch(error => {
        console.log(error);
      })
  },

  'global/REFRESH_TOKEN' (context) {
    return axios.get('token')
      .then(
        (response) => {
          context.commit('global/TOKEN_RECEIVED', response.token)
          context.dispatch('global/FETCH_USER', response.token)
        }
      )
  },

  'global/ADD_TOAST' (context, attrs) {
    context.commit('global/TOAST_ADDED', attrs)
  },

  'global/SET_NAMESPACE' (context, namespace) {
    context.commit('global/NAMESPACE_CHANGED', namespace)
  },

  'global/VALIDATION' (context, validation) {
    validation = (typeof(validation) == 'undefined' || !validation) ? null : validation

    context.commit('global/VALIDATION_RECEIVED', validation)
  },
}
