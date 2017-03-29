import SignIn from './views/SignIn'
import ResetPassword from './views/ResetPassword'
import ForgotPassword from './views/ForgotPassword'

export default [
    { path: '/signin', component: SignIn,         name: 'auth.signin' },
    { path: '/forgot', component: ForgotPassword, name: 'auth.forgot' },
    { path: '/reset',  component: ResetPassword,  name: 'auth.reset' }
]
