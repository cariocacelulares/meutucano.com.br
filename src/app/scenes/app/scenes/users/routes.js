import Users from './components/Users'
import { routes as list } from './scenes/list'
import { routes as form } from './scenes/form'

export default [
  {
    redirect: '/users/list',
    path: '/users',
    name: 'users',
    component: Users,
    meta: {
      auth: true,
      breadcrumb: 'Usuários'
    },
    children: [
      ...list,
      ...form,
    ],
  },
]
