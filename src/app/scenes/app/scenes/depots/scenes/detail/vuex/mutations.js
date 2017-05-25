import { default as DepotTransformer } from '../../../transformer'

export default {
  'depots/detail/products/DEPOT_RECEIVED' (state, depot) {
    state.depot = depot
  },

  'depots/detail/products/RECEIVED' (state, depotProducts) {
    state.depotProducts = depotProducts
  },
}
