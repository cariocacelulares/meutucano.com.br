import Detail from './components/Detail'
import General from './components/General'
import Depots from './components/Depots'

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
    redirect: '/products/detail/general',
    // props: (route) => ({ productSku: route.params.sku })
    //
    children: [
      {
        // path: '/products/detail/:sku/general',
        path: '/products/detail/general',
        component: General,
        name: 'products.detail.general',
        meta: {
          auth: true,
          breadcrumb: 'Informações gerais'
        },
      },
      {
        // path: '/products/detail/:sku/depots',
        path: '/products/detail/depots',
        component: Depots,
        name: 'products.detail.depots',
        meta: {
          auth: true,
          breadcrumb: 'Depósitos'
        },
      },
    ],
  },
]
