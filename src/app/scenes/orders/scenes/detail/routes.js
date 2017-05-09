import Detail from './components/Detail'
import General from './components/General'
import Comments from './components/Comments'
import Calls from './components/Calls'

export default [
  {
    path: '/orders/detail',
    component: Detail,
    name: 'orders.detail',
    meta: {
      auth: true,
      breadcrumb: 'Detalhe'
    },
    redirect: '/orders/detail/general',
    children: [
      {
        path: '/orders/detail/general',
        component: General,
        name: 'orders.detail.general',
        meta: {
          auth: true,
          breadcrumb: 'Informações gerais'
        },
      },
      {
        path: '/orders/detail/comments',
        component: Comments,
        name: 'orders.detail.comments',
        meta: {
          auth: true,
          breadcrumb: 'Comentários'
        },
      },
      {
        path: '/orders/detail/calls',
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
