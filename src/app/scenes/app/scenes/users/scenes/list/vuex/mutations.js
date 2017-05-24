import { default as UserTransformer } from '../../../transformer'

export default {
  'users/list/RECEIVED' (state, users) {
    users = users.map((user) =>
      UserTransformer.transform(user)
    )

    state.users = users
  },

  'users/list/FILTER_CHANGED' (state, filter) {
    state.filter = filter
  },
}
