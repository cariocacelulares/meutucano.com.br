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
    discret: {
      type: Boolean,
      default: false
    },
    classes: {
      type: String,
      default: null
    },
  },

  computed: {
    classList() {
      let classList = []

      classList.push('content ContentBox')
      classList.push(this.classes)

      if (this.boxed) {
        classList.push('boxed')
      }

      if (this.discret) {
        classList.push('discret')
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

  &:not(.discret) {
    padding: 20px;
    background-color: $white;
    box-shadow: $defaultShadow;
    border-radius: $borderRadius;
  }

  &.boxed {
    max-width: 980px;
  }
}
</style>
