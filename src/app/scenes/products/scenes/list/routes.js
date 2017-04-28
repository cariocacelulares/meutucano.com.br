import List from './components/List'

export default [
  {
    path: '/products/list',
    component: List,
    name: 'products.list',
    meta: {
      auth: true,
      breadcrumb: 'Lista'
    }
  },
]
