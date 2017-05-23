import { default as CustomerTransformer } from '../../../transformer'

export default {
  'customers/list/RECEIVED' (state, customers) {
    customers = customers.map((customer) =>
      CustomerTransformer.transform(customer)
    )

    state.customers = customers
  },

  'customers/list/FILTER_CHANGED' (state, filter) {
    state.filter = filter
  },
}
