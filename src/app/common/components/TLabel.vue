<template>
  <label class="TLabel">
    <span v-if="text" class="label">{{ text }}</span>
    <slot></slot>
  </label>
</template>

<script>
export default {
  props: {
    text: {
      type: String,
      required: true,
    },
  },

  computed: {
    classList() {
      let classList = []

      classList.push('TLabel')
      classList.push(`bg-${this.color}`)
      classList.push(`text-${this.text}`)

      return notEmpty(classList).join(' ')
    }
  },
}
</script>

<style lang="scss" scoped>
@import '~style/vars';

.TLabel {
  position: relative;
  display: inline-block;

  .label {
    display: block;
    line-height: 1;
    margin-bottom: 5px;
    font-weight: bold;
    font-size: 12px;
    color: $inputLabel;
  }

  > :not(.label) {
    height: 40px;
    line-height: 40px;
  }
}
</style>
