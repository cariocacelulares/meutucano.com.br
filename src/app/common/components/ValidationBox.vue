<template>
  <Alert v-if="validation" color="danger" class="ValidationBox">
    <ul>
      <template v-for="item in validation">
        <li v-for="subitem in item">{{ subitem }}</li>
      </template>
    </ul>
  </Alert>
</template>

<script>
import { mapGetters } from 'vuex';

export default {
  computed: {
    ...mapGetters({
      validation: 'global/GET_VALIDATION',
    }),
  }
}
</script>

<style lang="scss" scoped>
@import '~style/vars';

.ValidationBox {
}
</style>
