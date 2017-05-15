<template>
  <span :class="classList" :style="{
    width,
    height,
    }">
    <slot></slot>
  </span>
</template>

<script>
export default {
  props: {
    color: {
      type: String,
      default: 'info'
    },
    text: {
      type: String,
      default: 'white'
    },
    width: {
      type: String,
    },
    height: {
      type: String,
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
  line-height: 26px;
  padding: 0 20px;
  border-radius: $borderRadius;
  font-size: 11px;
  font-weight: bold;
  cursor: default;

  display: flex;
  align-items: center;
  justify-content: center;
}
</style>
