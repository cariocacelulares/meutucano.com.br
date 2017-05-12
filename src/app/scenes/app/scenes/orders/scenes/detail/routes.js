import Detail from './components/Detail'
import General from './components/General'
import Comments from './components/Comments'
import Calls from './components/Calls'

export default [
  {
    path: '/orders/detail/:id',
    component: Detail,
    name: 'orders.detail',
    meta: {
      auth: true,
      breadcrumb: 'Detalhe'
    },
    redirect: '/orders/detail/:id/general',
    children: [
      {
        path: '/orders/detail/:id/general',
        component: General,
        name: 'orders.detail.general',
        meta: {
          auth: true,
          breadcrumb: 'Informações gerais'
        },
      },
      {
        path: '/orders/detail/:id/comments',
        component: Comments,
        name: 'orders.detail.comments',
        meta: {
          auth: true,
          breadcrumb: 'Comentários'
        },
      },
      {
        path: '/orders/detail/:id/calls',
        component: Calls,
        name: 'orders.detail.calls',
        meta: {
          auth: true,
          breadcrumb: 'Ligações'
        },
      },
    ],
  },
]
