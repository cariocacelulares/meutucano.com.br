import store from 'common/vuex'
import { isEmpty, find } from 'lodash'

export default (to, from, next) => {
  const requireLogin = to.meta.auth || false
  const requirePermission = to.meta.permission || null

  if (requireLogin) {
    if (isEmpty(store.getters['global/IS_AUTH'])) {
      next({ name: 'auth.signin' })
    } else if (requirePermission) {
      const permissions = store.getters['global/GET_USER'].permissions

      if (!find(permissions, permission => permission === requirePermission)) {
        next({ name: 'app.dashboard' })
      }
    }
  }

  next();
};
