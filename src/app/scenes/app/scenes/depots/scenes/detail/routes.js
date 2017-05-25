import Detail from './components/Detail'

export default [
  {
    path: '/depots/detail/:slug',
    component: Detail,
    name: 'depots.detail',
    meta: {
      auth: true,
      breadcrumb: 'Detalhe'
    },
    props: (route) => ({ depotSlug: route.params.slug })
  },
]
