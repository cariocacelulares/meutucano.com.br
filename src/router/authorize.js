import store from 'common/vuex';
import { isEmpty, find } from 'lodash';

export default (to, from, next) => {
  const requireLogin = to.meta.auth || false;
  const requirePermission = to.meta.permission || null;

  if (requireLogin) {
    if (isEmpty(store.getters['auth/IS_LOGGED'])) {
      next({ name: 'auth.login' });
    } else if (requirePermission) {
      const permissions = store.getters['auth/GET_USER'].permissions;

      if (!find(permissions, permission => permission === requirePermission)) {
        next({ name: 'app.main' });
      }
    }

    next();
  }
};
