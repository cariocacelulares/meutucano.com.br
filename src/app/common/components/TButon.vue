<template>
  <button :type="type" :class="classes" @click="buttonClicked">
    <slot></slot>
  </button>
</template>

<script>
import { isEmpty } from 'lodash'

export default {
  props: {
    type: {
      type: String,
      default: 'button'
    },
    block: {
      type: Boolean,
      default: false
    },
    color: {
      type: String,
      default: 'default'
    },
    size: {
      type: String,
      default: 'normal'
    },
    class: {
      type: String,
      default: null
    }
  },
  computed: {
    classes() {
      let classes = []

      classes.push('TButton')
      classes.push(this.class)
      classes.push(this.color)
      classes.push(this.size)

      if (this.block) {
        classes.push('block')
      }

      classes = classes.filter((item) => {
        if (typeof(item) === 'boolean' || !isEmpty(item)) {
          return item
        }
      });

      return classes.join(' ')
    }
  },
  methods: {
    buttonClicked() {
      this.$root.$emit('buttonClicked')
    }
  }
}
</script>

<style lang="scss" scoped>
@import '~style/vars';

button {
  display: inline-block;
  border-radius: 3px;
  color: #FFF;
  cursor: pointer;

  &.block {
    display: block;
    width: 100%;
  }

  // colors
  @each $name, $color in $colors {
    &.#{$name} {
      background-color: $color;
      transition: background-color linear 150ms;
    }

    &.#{$name}:focus,
    &.#{$name}:hover {
      background-color: darken($color, 5);
    }
  }

  // sizes
  &.big {
    height: 50px;
    line-height: 50px;
    padding: 0 30px;
  }
}
</style>
