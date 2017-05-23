import Detail from './components/Detail'

export default [
  {
    path: '/customers/detail/:id',
    component: Detail,
    name: 'customers.detail',
    meta: {
      auth: true,
      breadcrumb: 'Detalhe'
    },
    props: (route) => ({ customerId: route.params.id })
  },
]
