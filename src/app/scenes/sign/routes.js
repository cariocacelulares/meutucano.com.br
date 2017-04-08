import SignIn from './components/SignIn'
import ResetPassword from './components/ResetPassword'
import ForgotPassword from './components/ForgotPassword'

export default [
    { path: '/',       component: SignIn,         name: 'auth.signin' },
    { path: '/forgot', component: ForgotPassword, name: 'auth.forgot' },
    { path: '/reset',  component: ResetPassword,  name: 'auth.reset' }
]
