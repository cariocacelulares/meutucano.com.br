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
  <App>
    <PageHeader>
    </PageHeader>
    <ContentBox>
    </ContentBox>
  </App>
</template>

<script>
import App from 'common/layout/App'
import PageHeader from 'common/layout/PageHeader'
import ContentBox from 'common/layout/ContentBox'
import { mapActions } from 'vuex';

export default {
  components: {
    App,
    PageHeader,
    ContentBox,
  },

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
export default {
}

EOF

#vuex - getters
cat > src/app/scenes/$1/vuex/getters.js << EOF
export default {
}

EOF

#vuex - mutations
cat > src/app/scenes/$1/vuex/mutations.js << EOF
export default {
}

EOF

#vuex - state
cat > src/app/scenes/$1/vuex/state.js << EOF
export default {
}

EOF
