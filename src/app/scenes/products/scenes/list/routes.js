import ProductList from './components/ProductList'

export default [
    {
      path: '/products/list',
      component: ProductList,
      name: 'products.list',
      meta: {
        auth: true,
        breadcrumb: 'Lista'
      }
    },
]
