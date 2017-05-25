import List from './components/List'

export default [
  {
    path: '/brands/list',
    component: List,
    name: 'brands.list',
    meta: {
      auth: true,
      breadcrumb: 'Lista'
    }
  },
]
