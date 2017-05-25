import Form from './components/Form'

export default [
  {
    path: '/depots/create',
    component: Form,
    name: 'depots.create',
    meta: {
      auth: true,
      breadcrumb: 'Novo'
    },
  },
  {
    path: '/depots/edit/:slug',
    component: Form,
    name: 'depots.edit',
    meta: {
      auth: true,
      breadcrumb: 'Editar'
    },
    props: (route) => ({ depotSlug: route.params.slug })
  },
]
