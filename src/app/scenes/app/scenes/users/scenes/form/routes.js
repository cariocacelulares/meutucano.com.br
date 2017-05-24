import Form from './components/Form'

export default [
  {
    path: '/users/create',
    component: Form,
    name: 'users.create',
    meta: {
      auth: true,
      breadcrumb: 'Novo'
    },
  },
  {
    path: '/users/edit/:id',
    component: Form,
    name: 'users.edit',
    meta: {
      auth: true,
      breadcrumb: 'Editar'
    },
    props: (route) => ({ userId: route.params.id })
  },
]
