#!/bin/bash

# $1 = scene name
# $2 = first component name

mkdir src/app/scenes/$1
mkdir src/app/scenes/$1/components
mkdir src/app/scenes/$1/services
mkdir src/app/scenes/$1/vuex

#root - index
cat > src/app/scenes/$1/index.js << EOF
export { default as vuex } from './vuex'
export { default as routes } from './routes'

EOF

#root - routes
cat > src/app/scenes/$1/routes.js << EOF
export default [
]

EOF

#components - $2
cat > src/app/scenes/$1/components/$2.vue << EOF
<template>
</template>

<script>
import * as types from '../vuex/types'
import { mapActions } from 'vuex';

export default {
  data() {
    return {
      //
    };
  },

  methods: {
    ...mapActions({
      //
    }),
  },
};
</script>

<style lang="scss" scoped>
</style>

EOF

#services - index
cat > src/app/scenes/$1/services/index.js << EOF
//

EOF

#vuex - index
cat > src/app/scenes/$1/vuex/index.js << EOF
import state from './state'
import getters from './getters'
import actions from './actions'
import mutations from './mutations'

export default { state, mutations, actions, getters }

EOF

#vuex - actions
cat > src/app/scenes/$1/vuex/actions.js << EOF
import * as types from './types'

export default {
}

EOF

#vuex - getters
cat > src/app/scenes/$1/vuex/getters.js << EOF
import * as types from './types'

export default {
}

EOF

#vuex - mutations
cat > src/app/scenes/$1/vuex/mutations.js << EOF
import * as types from './types'

export default {
}

EOF

#vuex - state
cat > src/app/scenes/$1/vuex/state.js << EOF
export default {
}

EOF

#vuex - types
cat > src/app/scenes/$1/vuex/types.js << EOF
// scene name
const namespace = '$1';

/**
 * Actions
 */
export const LOGIN_ATTEMPT = \`\${namespace}/EXAMPLE\`

/**
 * Mutations
 */

/**
 * Getters
 */

EOF
