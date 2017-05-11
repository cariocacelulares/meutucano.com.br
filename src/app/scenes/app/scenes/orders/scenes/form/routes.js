import Form from './components/Form'

export default [
  {
    path: '/orders/create',
    component: Form,
    name: 'orders.create',
    meta: {
      auth: true,
      breadcrumb: 'Novo'
    }
  },
  {
    path: '/orders/edit/:id',
    component: Form,
    name: 'orders.edit',
    meta: {
      auth: true,
      breadcrumb: 'Editar'
    },
    props: (route) => ({ orderId: route.params.id })
  },
]
