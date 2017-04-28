<template>
  <div :class="classList">
    <slot></slot>
  </div>
</template>

<script>
import { isEmpty } from 'lodash'

export default {
  props: {
    boxed: {
      type: Boolean,
      default: false
    },
    classes: {
      type: String,
      default: null
    }
  },

  computed: {
    classList() {
      let classList = []

      classList.push('content')
      classList.push(this.classes)

      if (this.boxed) {
        classList.push('boxed')
      }

      classList = classList.filter((item) => {
        if (typeof(item) === 'boolean' || !isEmpty(item)) {
          return item
        }
      });

      return classList.join(' ')
    }
  },
}
</script>

<style lang="scss" scope>
@import '~style/vars';

.content {
  width: calc(100% - 40px);
  margin: 0 auto;
  min-height: 10px;
  padding: 20px;
  background-color: $white;
  box-shadow: 0px 0px 10px rgba(204, 204, 204, 0.5);
  border-radius: 3px;

  &.boxed {
    max-width: 980px;
  }
}
</style>
