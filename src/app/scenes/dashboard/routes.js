import Dashboard from './components/Dashboard'

export default [
  { path: '/dashboard', component: Dashboard, name: 'dashboard', meta: { auth: true } },
]
