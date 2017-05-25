import Lines from './components/Lines'
import { routes as list } from './scenes/list'

export default [
  {
    redirect: '/lines/list',
    path: '/lines',
    name: 'lines',
    component: Lines,
    meta: {
      auth: true,
      breadcrumb: 'Linhas'
    },
    children: [
      ...list,
    ],
  },
]
