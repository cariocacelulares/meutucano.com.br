import App from './common/layout/App'
import { routes as sign } from './scenes/sign'

export default [
  { path: '/dashboard', component: App, name: 'app.main', meta: { auth: true } },
  ...sign,
];
