<template>
  <span :class="classList" :style="{
      width,
      height,
    }">
    <Icon v-if="icon" :name="icon" />
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
    icon: {
      type: String,
    },
    textCenter: {
      type: Boolean,
      default: false
    },
  },

  computed: {
    classList() {
      let classList = []

      classList.push('Alert')
      classList.push(`bg-${this.color}`)
      classList.push(`text-${this.text}`)

      if (this.textCenter) {
        classList.push('centered')
      }

      return notEmpty(classList).join(' ')
    }
  },
}
</script>

<style lang="scss" scoped>
@import '~style/vars';

.Alert {
  height: 40px;
  padding: 0 20px;
  border-radius: $borderRadius;
  font-size: 12px;
  cursor: default;

  display: flex;
  align-items: center;

  &.centered {
    justify-content: center;
  }

  .Icon {
    margin-right: 15px;
  }

  &.ValidationBox {
    padding: 20px;
    height: auto;
    line-height: 1.6;
    box-shadow: $defaultShadow;

    ul {
      padding-left: 20px;
      font-size: 13px;
    }
  }
}
</style>
