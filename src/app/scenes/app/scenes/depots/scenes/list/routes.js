import List from './components/List'

export default [
  {
    path: '/depots/list',
    component: List,
    name: 'depots.list',
    meta: {
      auth: true,
      breadcrumb: 'Lista'
    }
  },
]
