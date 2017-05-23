import List from './components/List'

export default [
  {
    path: '/customers/list',
    component: List,
    name: 'customers.list',
    meta: {
      auth: true,
      breadcrumb: 'Lista'
    }
  },
]
