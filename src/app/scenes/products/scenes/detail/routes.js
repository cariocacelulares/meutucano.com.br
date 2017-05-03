import Detail from './components/Detail'

export default [
  {
    // path: '/products/detail/:sku',
    path: '/products/detail',
    component: Detail,
    name: 'products.detail',
    meta: {
      auth: true,
      breadcrumb: 'Detalhe'
    },
    // props: (route) => ({ productSku: route.params.sku })
  },
]
