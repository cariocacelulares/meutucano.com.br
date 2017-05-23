import Form from './components/Form'

export default [
  {
    path: '/products/create/:sku?',
    component: Form,
    name: 'products.create',
    meta: {
      auth: true,
      breadcrumb: 'Novo'
    },
  },
  {
    path: '/products/edit/:sku',
    component: Form,
    name: 'products.edit',
    meta: {
      auth: true,
      breadcrumb: 'Editar'
    },
    props: (route) => ({ productSku: route.params.sku })
  },
]
