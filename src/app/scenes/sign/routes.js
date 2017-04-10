import SignIn from './components/SignIn'
import ForgotPassword from './components/ForgotPassword'

export default [
    { path: '/',       component: SignIn,         name: 'auth.signin' },
    { path: '/forgot', component: ForgotPassword, name: 'auth.forgot' },
]
