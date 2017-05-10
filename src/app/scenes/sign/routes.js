import Sign from './components/Sign'
import { routes as forgot } from './scenes/forgot'
import { routes as signIn } from './scenes/signIn'

export default [
  {
    path: '/',
    name: 'sign',
    component: Sign,
    redirect: '/signin',
    children: [
      ...forgot,
      ...signIn,
    ]
  },
]
