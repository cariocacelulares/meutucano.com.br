<template>
  <label class="InputGroup">
  <!-- <label :class="classList"> -->
    <slot name="left"></slot>
    <slot name="input"></slot>
    <slot name="right"></slot>
  </label>
</template>

<script>
export default {
  props: {
    /*labeled: {
      type: Boolean,
      default: false
    }*/
  },

  computed: {
    /*classList() {
      let classList = []

      classList.push('InputGroup')

      if (this.labeled) {
        classList.push('labeled')
      }

      return notEmpty(classList).join(' ')
    }*/
  }
}
</script>

<style lang="scss" scoped>
.InputGroup {
  display: flex;

  > * {
    display: inline-block;
    flex-shrink: 0;
    max-height: 40px;

    &:not(.inputWrapper) {
      align-self: flex-end;
    }

    &:first-child:not(.inputWrapper) {
      border-radius: 3px 0 0 3px;
    }

    &:last-child:not(.inputWrapper) {
      border-radius: 0 3px 3px 0;
    }
  }
}
</style>
