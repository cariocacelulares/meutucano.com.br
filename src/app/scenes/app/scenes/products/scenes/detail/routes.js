import Detail from './components/Detail'
import General from './components/General'
import Depots from './components/Depots'

export default [
  {
    path: '/products/detail/:sku',
    component: Detail,
    name: 'products.detail',
    meta: {
      auth: true,
      breadcrumb: 'Detalhe'
    },
    redirect: '/products/detail/:sku/general',
    children: [
      {
        path: '/products/detail/:sku/general',
        component: General,
        name: 'products.detail.general',
        meta: {
          auth: true,
          breadcrumb: 'Informações gerais'
        },
      },
      {
        path: '/products/detail/:sku/depots',
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
