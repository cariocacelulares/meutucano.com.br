import Vue from 'vue';
import Router from 'vue-router';
import routes from './routes';
import authorize from './authorize';

Vue.use(Router);

const router = new Router({
  routes,
  mode: 'history',
  linkActiveClass: 'active',
});

router.beforeEach(authorize);

export default router;
