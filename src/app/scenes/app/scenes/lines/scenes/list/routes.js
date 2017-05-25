import List from './components/List'

export default [
  {
    path: '/lines/list',
    component: List,
    name: 'lines.list',
    meta: {
      auth: true,
      breadcrumb: 'Lista'
    }
  },
]
