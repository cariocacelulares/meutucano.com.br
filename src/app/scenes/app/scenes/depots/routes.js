import Depots from './components/Depots'
import { routes as list } from './scenes/list'
import { routes as form } from './scenes/form'
import { routes as detail } from './scenes/detail'

export default [
  {
    redirect: '/depots/list',
    path: '/depots',
    name: 'depots',
    component: Depots,
    meta: {
      auth: true,
      breadcrumb: 'Depósitos'
    },
    children: [
      ...list,
      ...form,
      ...detail,
    ],
  },
]
