import Dashboard from './components/Dashboard'

export default [
  { path: '/dashboard', component: Dashboard, name: 'app.dashboard', meta: { auth: true } },
]
