<template>
  <label :class="classList">
    <label v-if="label">{{ label }}</label>
    <div class="ig-container">
      <div v-if="hasLeft" :class="leftClasses">
        <slot name="left"></slot>
      </div>
      <div v-if="hasInput" :class="inputClasses">
        <slot name="input"></slot>
      </div>
      <div v-if="hasRight" :class="rightClasses">
        <slot name="right"></slot>
      </div>
    </div>
  </label>
</template>

<script>
export default {
  props: {
    fixLabel: {
      type: Boolean,
      default: false
    },
    size: {
      type: String,
      default: 'normal'
    },
    leftShrink: {
      type: Number,
      default: null
    },
    inputShrink: {
      type: Number,
      default: null
    },
    rightShrink: {
      type: Number,
      default: null
    },
    label: {
      type: String,
      default: null
    },
  },

  computed: {
    hasLeft() {
      return (typeof(this.$slots.left) !== 'undefined')
    },

    hasInput() {
      return (typeof(this.$slots.input) !== 'undefined')
    },

    hasRight() {
      return (typeof(this.$slots.right) !== 'undefined')
    },

    classList() {
      let classList = []

      classList.push('InputGroup')
      classList.push(this.size)

      if (this.fixLabel) {
        classList.push('fix-label')
      }

      if (this.hasLeft) {
        classList.push('has-left')
      }

      if (this.hasInput) {
        classList.push('has-input')
      }

      if (this.hasRight) {
        classList.push('has-right')
      }

      if (this.leftShrink || this.inputShrink || this.rightShrink) {
        classList.push('has-shrink')
      }

      return notEmpty(classList).join(' ')
    },

    leftClasses() {
      let classList = []

      classList.push('left')

      if (this.leftShrink) {
        classList.push(`shrink-${this.leftShrink}`)
      }

      return notEmpty(classList).join(' ')
    },

    inputClasses() {
      let classList = []

      classList.push('input')

      if (this.inputShrink) {
        classList.push(`shrink-${this.inputShrink}`)
      }

      return notEmpty(classList).join(' ')
    },

    rightClasses() {
      let classList = []

      classList.push('right')

      if (this.rightShrink) {
        classList.push(`shrink-${this.rightShrink}`)
      }

      return notEmpty(classList).join(' ')
    },
  }
}
</script>

<style lang="scss" scoped>
@import '~style/vars';

.InputGroup.fix-label.has-right:not(.has-left) .right,
.InputGroup.fix-label.has-left:not(.has-right) .left {
  position: relative;
  top: 17px;
}

.InputGroup {
  display: flex;
  flex-direction: column;

  &.normal {
    height: 40px;

    * {
      max-height: 40px;
    }
  }

  &.small {
    height: 30px;

    * {
      max-height: 30px;
    }
  }

  &.has-shrink .ig-container > * {
    flex-shrink: 0;
  }

  .ig-container {
      display: flex;

    > * {
      display: flex;
      align-items: center;
      height: 100%;
    }
  }

  > label {
    display: block;
    line-height: 1;
    margin-bottom: 5px;
    font-weight: bold;
    font-size: 12px;
    color: $inputLabel;
  }
}
</style>
