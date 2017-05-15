<template>
  <span :class="classList" :style="{
    height: `${height}px`,
    width: `${width}px`,
    margin: `${spacing}px 0`,
    marginTop: `${top}px`,
    marginBottom: `${bottom}px`
    }"></span>
</template>

<script>
export default {
  props: {
    height: {
      type: Number
    },
    width: {
      type: Number
    },
    spacing: {
      type: Number,
      default: 15
    },
    top: {
      type: Number
    },
    bottom: {
      type: Number
    },
    color: {
      type: String,
      default: 'light'
    },
    classes: {
      type: String,
      default: null
    },
  },
  computed: {
    classList() {
      let classList = []

      classList.push('HSeparator')
      classList.push(this.classes)
      classList.push(`bg-${this.color}`)

      return notEmpty(classList).join(' ')
    }
  }
}
</script>

<style lang="scss" scoped>
@import '~style/vars';

.HSeparator {
  display: inline-block;
  width: 100%;
  height: 1px;
}
</style>
