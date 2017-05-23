import Form from './components/Form'

export default [
  {
    path: '/customers/create',
    component: Form,
    name: 'customers.create',
    meta: {
      auth: true,
      breadcrumb: 'Novo'
    },
  },
  {
    path: '/customers/edit/:id',
    component: Form,
    name: 'customers.edit',
    meta: {
      auth: true,
      breadcrumb: 'Editar'
    },
    props: (route) => ({ customerId: route.params.id })
  },
]
