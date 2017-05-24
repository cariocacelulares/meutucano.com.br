import List from './components/List'

export default [
  {
    path: '/users/list',
    component: List,
    name: 'users.list',
    meta: {
      auth: true,
      breadcrumb: 'Lista'
    }
  },
]
