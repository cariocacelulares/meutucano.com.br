import { default as ProductTransformer } from '../../../transformer'

export default {
  'products/detail/depots/RECEIVED' (state, depot) {
    state.depot = depot
  },

  'products/detail/depots/serials/RECEIVED' (state, serials) {
    state.serials = serials
  },
}
