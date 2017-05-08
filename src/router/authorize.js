import store from 'common/vuex'
import { isEmpty } from 'lodash'

export default (to, from, next) => {
  window.scrollTo(0, 0)

  const requirePermission = to.meta.permission || null
  const requireLogin = !!requirePermission || to.meta.auth || false

  let redirect = false;

  if (requireLogin) {
    const isAuth = store.getters['global/IS_AUTH'];

    if (isAuth !== true && isEmpty(isAuth)) {
      redirect = { name: 'auth.signin' }
    } else if (requirePermission) {
      const permissions = store.getters['global/GET_USER'].permissions

      if (!permissions.find((permission) => permission === requirePermission))  {
        redirect = { name: 'app.dashboard' }
      }
    }
  }

  if (redirect) {
    next(redirect)
  } else {
    next()
  }
}
