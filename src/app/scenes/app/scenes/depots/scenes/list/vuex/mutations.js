import { default as DepotTransformer } from '../../../transformer'

export default {
  'depots/list/RECEIVED' (state, depots) {
    depots = depots.map((depot) =>
      DepotTransformer.transform(depot)
    )

    state.depots = depots
  },

  'depots/list/FILTER_CHANGED' (state, filter) {
    state.filter = filter
  },
}
